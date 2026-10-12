import { prisma } from "@/lib/prisma";
import type { AboutInfoData, AboutPhotoData } from "@/lib/about-shared";

export { MAX_ABOUT_PHOTOS } from "@/lib/about-shared";
export type { AboutInfoData, AboutPhotoData } from "@/lib/about-shared";

const aboutSelect = {
  id: true,
  title: true,
  tagline: true,
  shortDescription: true,
  fullDescription: true,
  address: true,
  addressNote: true,
  city: true,
  postalCode: true,
  phone: true,
  phoneSecondary: true,
  email: true,
  whatsapp: true,
  telegram: true,
  instagram: true,
  vkontakte: true,
  hoursWeekdays: true,
  hoursWeekend: true,
  hoursNote: true,
  deliveryInfo: true,
  deliveryZones: true,
  minOrderNote: true,
  paymentMethods: true,
  parkingInfo: true,
  howToFind: true,
  mapUrl: true,
  legalName: true,
  unp: true,
  foundedYear: true,
  capacity: true,
  amenities: true,
  coverImageMimeType: true,
  updatedAt: true,
  photos: {
    orderBy: [{ sortOrder: "asc" as const }, { createdAt: "asc" as const }],
    select: {
      id: true,
      caption: true,
      sortOrder: true,
      updatedAt: true,
    },
  },
};

export function aboutCoverImageUrl(updatedAt?: Date | string) {
  const version =
    updatedAt instanceof Date
      ? updatedAt.getTime()
      : updatedAt
        ? new Date(updatedAt).getTime()
        : undefined;

  return version
    ? `/api/about/cover?v=${version}`
    : "/api/about/cover";
}

export function aboutPhotoImageUrl(
  photoId: string,
  updatedAt?: Date | string,
) {
  const version =
    updatedAt instanceof Date
      ? updatedAt.getTime()
      : updatedAt
        ? new Date(updatedAt).getTime()
        : undefined;

  return version
    ? `/api/about/photos/${photoId}/image?v=${version}`
    : `/api/about/photos/${photoId}/image`;
}

export async function getOrCreateAboutInfo() {
  await prisma.aboutInfo.upsert({
    where: { id: 1 },
    create: { id: 1 },
    update: {},
  });

  return prisma.aboutInfo.findUniqueOrThrow({
    where: { id: 1 },
    select: aboutSelect,
  });
}

export function serializeAboutInfo(
  about: Awaited<ReturnType<typeof getOrCreateAboutInfo>>,
): AboutInfoData {
  const hasCoverImage = Boolean(about.coverImageMimeType);

  return {
    title: about.title,
    tagline: about.tagline,
    shortDescription: about.shortDescription,
    fullDescription: about.fullDescription,
    address: about.address,
    addressNote: about.addressNote,
    city: about.city,
    postalCode: about.postalCode,
    phone: about.phone,
    phoneSecondary: about.phoneSecondary,
    email: about.email,
    whatsapp: about.whatsapp,
    telegram: about.telegram,
    instagram: about.instagram,
    vkontakte: about.vkontakte,
    hoursWeekdays: about.hoursWeekdays,
    hoursWeekend: about.hoursWeekend,
    hoursNote: about.hoursNote,
    deliveryInfo: about.deliveryInfo,
    deliveryZones: about.deliveryZones,
    minOrderNote: about.minOrderNote,
    paymentMethods: about.paymentMethods,
    parkingInfo: about.parkingInfo,
    howToFind: about.howToFind,
    mapUrl: about.mapUrl,
    legalName: about.legalName,
    unp: about.unp,
    foundedYear: about.foundedYear,
    capacity: about.capacity,
    amenities: about.amenities,
    hasCoverImage,
    coverImageUrl: hasCoverImage
      ? aboutCoverImageUrl(about.updatedAt)
      : null,
    photos: about.photos.map((photo) => ({
      id: photo.id,
      caption: photo.caption,
      sortOrder: photo.sortOrder,
      imageUrl: aboutPhotoImageUrl(photo.id, photo.updatedAt),
    })),
    updatedAt: about.updatedAt.toISOString(),
  };
}
