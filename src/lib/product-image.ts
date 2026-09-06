import { productSchema } from "@/lib/validations";

const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export function productImageUrl(productId: string, updatedAt?: Date | string) {
  const version =
    updatedAt instanceof Date
      ? updatedAt.getTime()
      : updatedAt
        ? new Date(updatedAt).getTime()
        : undefined;

  return version
    ? `/api/products/${productId}/image?v=${version}`
    : `/api/products/${productId}/image`;
}

export async function readUploadedImage(file: File | null) {
  if (!file || file.size === 0) {
    return null;
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Допустимы JPG, PNG, WEBP или GIF");
  }

  if (file.size > MAX_IMAGE_BYTES) {
    throw new Error("Файл больше 5 МБ");
  }

  return {
    imageData: Buffer.from(await file.arrayBuffer()),
    imageMimeType: file.type,
  };
}

export function parseProductForm(formData: FormData) {
  const rawCategoryId = formData.get("categoryId");
  const categoryId =
    typeof rawCategoryId === "string" ? rawCategoryId.trim() : "";

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || "",
    price: formData.get("price"),
    calories: formData.get("calories") ?? 0,
    proteins: formData.get("proteins") ?? 0,
    fats: formData.get("fats") ?? 0,
    carbs: formData.get("carbs") ?? 0,
    categoryId,
    isActive: formData.get("isActive") ?? true,
  });

  const removeImage = formData.get("removeImage") === "true";
  const image = formData.get("image");
  const imageFile = image instanceof File ? image : null;

  return { parsed, removeImage, imageFile };
}
