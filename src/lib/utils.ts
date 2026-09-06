import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number | string) {
  const amount = typeof value === "string" ? Number(value) : value;
  return new Intl.NumberFormat("ru-BY", {
    style: "currency",
    currency: "BYN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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

export function toDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function todayDateKey() {
  return toDateKey(new Date());
}

export function isDateKey(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function dateKeyToLocalDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function dateKeyToUtcDate(dateKey: string) {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function dbDateToKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function addDaysToDateKey(dateKey: string, days: number) {
  const date = dateKeyToLocalDate(dateKey);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function formatDateLabel(
  dateKey: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: "long",
    day: "numeric",
    month: "long",
  },
) {
  return new Intl.DateTimeFormat("ru-RU", options).format(
    dateKeyToLocalDate(dateKey),
  );
}

export function getMonthCells(year: number, monthIndex: number) {
  const first = new Date(year, monthIndex, 1);
  const startPad = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const cells: Array<{ dateKey: string; day: number; inMonth: boolean }> = [];

  for (let i = 0; i < startPad; i += 1) {
    const date = new Date(year, monthIndex, 1 - (startPad - i));
    cells.push({
      dateKey: toDateKey(date),
      day: date.getDate(),
      inMonth: false,
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    cells.push({
      dateKey: toDateKey(new Date(year, monthIndex, day)),
      day,
      inMonth: true,
    });
  }

  while (cells.length % 7 !== 0) {
    const last = cells[cells.length - 1];
    const nextKey = addDaysToDateKey(last.dateKey, 1);
    cells.push({
      dateKey: nextKey,
      day: dateKeyToLocalDate(nextKey).getDate(),
      inMonth: false,
    });
  }

  return cells;
}

export const DAY_LABELS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"] as const;
