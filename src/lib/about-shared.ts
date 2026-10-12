export const MAX_ABOUT_PHOTOS = 12;

export type AboutPhotoData = {
  id: string;
  caption: string;
  sortOrder: number;
  imageUrl: string;
};

export type AboutInfoData = {
  title: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  address: string;
  addressNote: string;
  city: string;
  postalCode: string;
  phone: string;
  phoneSecondary: string;
  email: string;
  whatsapp: string;
  telegram: string;
  instagram: string;
  vkontakte: string;
  hoursWeekdays: string;
  hoursWeekend: string;
  hoursNote: string;
  deliveryInfo: string;
  deliveryZones: string;
  minOrderNote: string;
  paymentMethods: string;
  parkingInfo: string;
  howToFind: string;
  mapUrl: string;
  legalName: string;
  unp: string;
  foundedYear: string;
  capacity: string;
  amenities: string;
  hasCoverImage: boolean;
  coverImageUrl: string | null;
  photos: AboutPhotoData[];
  updatedAt: string;
};
