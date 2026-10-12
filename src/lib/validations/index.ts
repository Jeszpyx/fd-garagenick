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
  grams: z.coerce.number().int().positive("Укажите граммовку порции"),
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

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => value ?? "");

const optionalEmail = z
  .string()
  .trim()
  .max(120)
  .optional()
  .transform((value) => value ?? "")
  .refine(
    (value) => value === "" || z.string().email().safeParse(value).success,
    "Некорректный email",
  );

const optionalUrl = z
  .string()
  .trim()
  .max(500)
  .optional()
  .transform((value) => value ?? "")
  .refine(
    (value) =>
      value === "" ||
      z.string().url().safeParse(value).success ||
      value.startsWith("/"),
    "Укажите корректную ссылку",
  );

export const aboutInfoSchema = z.object({
  title: optionalText(120),
  tagline: optionalText(200),
  shortDescription: optionalText(500),
  fullDescription: optionalText(5000),
  address: optionalText(300),
  addressNote: optionalText(300),
  city: optionalText(120),
  postalCode: optionalText(20),
  phone: optionalText(40),
  phoneSecondary: optionalText(40),
  email: optionalEmail,
  whatsapp: optionalText(40),
  telegram: optionalText(120),
  instagram: optionalText(120),
  vkontakte: optionalText(120),
  hoursWeekdays: optionalText(200),
  hoursWeekend: optionalText(200),
  hoursNote: optionalText(500),
  deliveryInfo: optionalText(2000),
  deliveryZones: optionalText(2000),
  minOrderNote: optionalText(500),
  paymentMethods: optionalText(500),
  parkingInfo: optionalText(1000),
  howToFind: optionalText(2000),
  mapUrl: optionalUrl,
  legalName: optionalText(200),
  unp: optionalText(40),
  foundedYear: optionalText(10),
  capacity: optionalText(40),
  amenities: optionalText(2000),
});

export type ProductInput = z.infer<typeof productSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type MenuScheduleInput = z.infer<typeof menuScheduleSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type NotificationSettingsInput = z.infer<
  typeof notificationSettingsSchema
>;
export type AboutInfoInput = z.infer<typeof aboutInfoSchema>;
