import { z } from "zod";
import { isBelarusMobile } from "@/lib/utils";

const belarusPhone = z
  .string()
  .trim()
  .refine(isBelarusMobile, "Введите номер РБ в формате +375 29 123-45-67");

export const phoneSchema = z.object({
  phone: belarusPhone,
});

export const verifyOtpSchema = z.object({
  phone: belarusPhone,
  code: z.string().length(4, "Код должен содержать 4 цифры"),
  name: z.string().trim().min(2).max(80).optional(),
});

export const adminLoginSchema = z.object({
  login: z.string().trim().min(1).max(40).optional(),
  password: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().min(1).max(500),
  price: z.coerce.number().positive(),
  calories: z.coerce.number().int().nonnegative(),
  proteins: z.coerce.number().nonnegative(),
  fats: z.coerce.number().nonnegative(),
  carbs: z.coerce.number().nonnegative(),
  categoryId: z.string().trim().min(1, "Выберите категорию"),
  isActive: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((value) => {
      if (value === undefined) return undefined;
      if (typeof value === "boolean") return value;
      return value === "true" || value === "on" || value === "1";
    }),
});

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Минимум 2 символа")
    .max(60, "Максимум 60 символов"),
});

const dateKeySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Укажите дату в формате ГГГГ-ММ-ДД");

export const menuScheduleSchema = z.object({
  productId: z.string().min(1),
  date: dateKeySchema,
});

export const menuCopySchema = z.object({
  fromDate: dateKeySchema,
  toDate: dateKeySchema,
});

export const orderItemSchema = z.object({
  date: dateKeySchema,
  quantity: z.coerce.number().int().positive(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
});

export const notificationSettingsSchema = z.object({
  adminEmails: z
    .array(z.string().trim().email("Некорректный email"))
    .max(50),
  telegramChatIds: z
    .array(
      z
        .string()
        .trim()
        .regex(/^-?\d+$/, "Telegram ID должен быть числом"),
    )
    .max(50),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type MenuScheduleInput = z.infer<typeof menuScheduleSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type NotificationSettingsInput = z.infer<
  typeof notificationSettingsSchema
>;
