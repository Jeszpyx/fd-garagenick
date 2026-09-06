import nodemailer from "nodemailer";
import { formatDateLabel, formatPrice } from "@/lib/utils";
import {
  getOrCreateNotificationSettings,
  getProviderStatus,
} from "@/lib/services/settings";

export type OrderNotificationPayload = {
  orderId: string;
  createdAt: Date;
  total: number;
  customer: {
    name: string | null;
    phone: string;
  };
  days: Array<{
    date: string;
    quantity: number;
    productNames: string[];
  }>;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
};

function buildMessage(payload: OrderNotificationPayload) {
  const when = new Intl.DateTimeFormat("ru-BY", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(payload.createdAt);

  const customerName = payload.customer.name?.trim() || "Без имени";
  const daysBlock =
    payload.days.length > 0
      ? payload.days
          .map((day) => {
            const composition =
              day.productNames.length > 0
                ? day.productNames.join(", ")
                : "состав не указан";
            return `• ${formatDateLabel(day.date)} × ${day.quantity}\n  ${composition}`;
          })
          .join("\n")
      : "• дни не указаны";

  const itemsBlock = payload.items
    .map(
      (item) =>
        `• ${item.name} × ${item.quantity} = ${formatPrice(item.price * item.quantity)}`,
    )
    .join("\n");

  return [
    `Новый заказ — Кафе Василёк`,
    `ID: ${payload.orderId}`,
    `Когда оформлен: ${when}`,
    ``,
    `Кто: ${customerName}`,
    `Телефон: ${payload.customer.phone}`,
    ``,
    `Дни меню:`,
    daysBlock,
    ``,
    `Позиции:`,
    itemsBlock,
    ``,
    `Итого: ${formatPrice(payload.total)}`,
  ].join("\n");
}

async function sendTelegram(text: string, chatIds: string[]) {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  if (!token || chatIds.length === 0) {
    return;
  }

  await Promise.allSettled(
    chatIds.map(async (chatId) => {
      const response = await fetch(
        `https://api.telegram.org/bot${token}/sendMessage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text,
            disable_web_page_preview: true,
          }),
        },
      );

      if (!response.ok) {
        const body = await response.text();
        console.error(`[telegram] chat ${chatId}: ${response.status} ${body}`);
      }
    }),
  );
}

async function sendEmail(text: string, emails: string[], total: number) {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();
  const from =
    process.env.SMTP_FROM?.trim() || user || "noreply@cafe-vasilek.local";

  if (!host || !user || !pass || emails.length === 0) {
    return;
  }

  const port = Number(process.env.SMTP_PORT || "587");
  const secure = process.env.SMTP_SECURE === "true" || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  await Promise.allSettled(
    emails.map(async (to) => {
      try {
        await transporter.sendMail({
          from,
          to,
          subject: `Новый заказ — Кафе Василёк · ${formatPrice(total)}`,
          text,
        });
      } catch (error) {
        console.error(`[email] ${to}:`, error);
      }
    }),
  );
}

/** Шлёт уведомления админам. Ошибки логируются, заказ не ломают. */
export async function notifyAdminsAboutOrder(
  payload: OrderNotificationPayload,
) {
  try {
    const settings = await getOrCreateNotificationSettings();
    const providers = getProviderStatus();
    const text = buildMessage(payload);

    const tasks: Promise<unknown>[] = [];

    if (providers.telegramConfigured && settings.telegramChatIds.length > 0) {
      tasks.push(sendTelegram(text, settings.telegramChatIds));
    } else if (settings.telegramChatIds.length > 0) {
      console.warn(
        "[notify] Telegram chat IDs set, but TELEGRAM_BOT_TOKEN missing",
      );
    }

    if (providers.smtpConfigured && settings.adminEmails.length > 0) {
      tasks.push(sendEmail(text, settings.adminEmails, payload.total));
    } else if (settings.adminEmails.length > 0) {
      console.warn("[notify] Admin emails set, but SMTP env is incomplete");
    }

    if (tasks.length === 0) {
      console.warn("[notify] No recipients or providers configured");
      return;
    }

    await Promise.allSettled(tasks);
  } catch (error) {
    console.error("[notify] failed:", error);
  }
}
