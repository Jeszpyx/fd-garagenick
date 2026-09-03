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
  login: z.string().trim().min(3, "Введите логин").max(40),
  password: z.string().min(6, "Пароль должен быть не короче 6 символов"),
});

export const productSchema = z.object({
  name: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional().nullable(),
  price: z.coerce.number().positive(),
  category: z.string().trim().max(60).optional().nullable(),
  isActive: z
    .union([z.boolean(), z.string()])
    .optional()
    .transform((value) => {
      if (value === undefined) return undefined;
      if (typeof value === "boolean") return value;
      return value === "true" || value === "on" || value === "1";
    }),
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
  productId: z.string().min(1),
  quantity: z.coerce.number().int().positive(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
});

export type ProductInput = z.infer<typeof productSchema>;
export type MenuScheduleInput = z.infer<typeof menuScheduleSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
