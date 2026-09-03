import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number | string) {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    maximumFractionDigits: 0,
  }).format(amount);
}

const BELARUS_MOBILE_CODES = ["25", "29", "33", "44"];

export function getBelarusLocalDigits(phone: string) {
  let digits = phone.replace(/\D/g, "");

  if (digits.startsWith("80") && digits.length >= 11) {
    digits = `375${digits.slice(2)}`;
  } else if (digits.startsWith("0") && digits.length >= 10) {
    digits = `375${digits.slice(1)}`;
  } else if (digits.startsWith("375")) {
    digits = digits.slice(0, 12);
  } else if (digits.length <= 9) {
    digits = `375${digits}`;
  }

  return digits.startsWith("375") ? digits.slice(3, 12) : digits.slice(0, 9);
}

export function normalizePhone(phone: string) {
  const local = getBelarusLocalDigits(phone);
  return `+375${local}`;
}

export function isBelarusMobile(phone: string) {
  const local = getBelarusLocalDigits(phone);
  return (
    local.length === 9 && BELARUS_MOBILE_CODES.includes(local.slice(0, 2))
  );
}

export function formatBelarusPhoneInput(phone: string) {
  const local = getBelarusLocalDigits(phone);
  const parts = [
    local.slice(0, 2),
    local.slice(2, 5),
    local.slice(5, 7),
    local.slice(7, 9),
  ].filter(Boolean);

  if (parts.length <= 1) return parts[0] ?? "";
  if (parts.length === 2) return `${parts[0]} ${parts[1]}`;
  return `${parts[0]} ${parts[1]}-${parts.slice(2).join("-")}`;
}

export function getTodayDayOfWeek() {
  const jsDay = new Date().getDay();
  return jsDay === 0 ? 6 : jsDay - 1;
}

export const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;

export const DAY_FULL_LABELS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
] as const;
