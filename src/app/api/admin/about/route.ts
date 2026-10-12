import { NextRequest } from "next/server";
import { requireAdmin } from "@/lib/auth/admin-auth";
import { prisma } from "@/lib/prisma";
import { apiError, apiSuccess } from "@/lib/api/response";
import { aboutInfoSchema } from "@/lib/validations";
import { readUploadedImage } from "@/lib/product-image";
import { MAX_ABOUT_PHOTOS } from "@/lib/about-shared";
import {
  getOrCreateAboutInfo,
  serializeAboutInfo,
} from "@/lib/services/about";

function formString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const about = await getOrCreateAboutInfo();
    return apiSuccess(serializeAboutInfo(about));
  } catch {
    return apiError("Не удалось загрузить раздел «О нас»", 500);
  }
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (!admin) {
    return apiError("Unauthorized", 401);
  }

  try {
    const formData = await request.formData();
    const parsed = aboutInfoSchema.safeParse({
      title: formString(formData, "title"),
      tagline: formString(formData, "tagline"),
      shortDescription: formString(formData, "shortDescription"),
      fullDescription: formString(formData, "fullDescription"),
      address: formString(formData, "address"),
      addressNote: formString(formData, "addressNote"),
      city: formString(formData, "city"),
      postalCode: formString(formData, "postalCode"),
      phone: formString(formData, "phone"),
      phoneSecondary: formString(formData, "phoneSecondary"),
      email: formString(formData, "email"),
      whatsapp: formString(formData, "whatsapp"),
      telegram: formString(formData, "telegram"),
      instagram: formString(formData, "instagram"),
      vkontakte: formString(formData, "vkontakte"),
      hoursWeekdays: formString(formData, "hoursWeekdays"),
      hoursWeekend: formString(formData, "hoursWeekend"),
      hoursNote: formString(formData, "hoursNote"),
      deliveryInfo: formString(formData, "deliveryInfo"),
      deliveryZones: formString(formData, "deliveryZones"),
      minOrderNote: formString(formData, "minOrderNote"),
      paymentMethods: formString(formData, "paymentMethods"),
      parkingInfo: formString(formData, "parkingInfo"),
      howToFind: formString(formData, "howToFind"),
      mapUrl: formString(formData, "mapUrl"),
      legalName: formString(formData, "legalName"),
      unp: formString(formData, "unp"),
      foundedYear: formString(formData, "foundedYear"),
      capacity: formString(formData, "capacity"),
      amenities: formString(formData, "amenities"),
    });

    if (!parsed.success) {
      return apiError(
        parsed.error.issues[0]?.message ?? "Некорректные данные",
        400,
      );
    }

    const removeCover = formData.get("removeCover") === "true";
    const coverField = formData.get("coverImage");
    const coverFile = coverField instanceof File ? coverField : null;

    let coverImageData: Uint8Array<ArrayBuffer> | null | undefined;
    let coverImageMimeType: string | null | undefined;

    if (coverFile && coverFile.size > 0) {
      const uploaded = await readUploadedImage(coverFile);
      if (uploaded) {
        coverImageData = Uint8Array.from(
          uploaded.imageData,
        ) as Uint8Array<ArrayBuffer>;
        coverImageMimeType = uploaded.imageMimeType;
      }
    } else if (removeCover) {
      coverImageData = null;
      coverImageMimeType = null;
    }

    const galleryFiles = formData
      .getAll("galleryImages")
      .filter((item): item is File => item instanceof File && item.size > 0);

    const existingCount = await prisma.aboutPhoto.count({
      where: { aboutId: 1 },
    });

    if (existingCount + galleryFiles.length > MAX_ABOUT_PHOTOS) {
      return apiError(
        `Можно загрузить не больше ${MAX_ABOUT_PHOTOS} фото в галерею`,
        400,
      );
    }

    const galleryUploads: Array<{
      imageData: Uint8Array<ArrayBuffer>;
      imageMimeType: string;
    }> = [];
    for (const file of galleryFiles) {
      const uploaded = await readUploadedImage(file);
      if (uploaded) {
        galleryUploads.push({
          imageData: Uint8Array.from(
            uploaded.imageData,
          ) as Uint8Array<ArrayBuffer>,
          imageMimeType: uploaded.imageMimeType,
        });
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.aboutInfo.upsert({
        where: { id: 1 },
        create: {
          id: 1,
          ...parsed.data,
          ...(coverImageData !== undefined
            ? { coverImageData, coverImageMimeType }
            : {}),
        },
        update: {
          ...parsed.data,
          ...(coverImageData !== undefined
            ? { coverImageData, coverImageMimeType }
            : {}),
        },
      });

      if (galleryUploads.length > 0) {
        const maxOrder = await tx.aboutPhoto.aggregate({
          where: { aboutId: 1 },
          _max: { sortOrder: true },
        });
        let nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

        for (const upload of galleryUploads) {
          await tx.aboutPhoto.create({
            data: {
              aboutId: 1,
              imageData: upload.imageData,
              imageMimeType: upload.imageMimeType,
              sortOrder: nextOrder,
            },
          });
          nextOrder += 1;
        }
      }
    });

    const about = await getOrCreateAboutInfo();
    return apiSuccess(serializeAboutInfo(about));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Не удалось сохранить";
    return apiError(message, 400);
  }
}
