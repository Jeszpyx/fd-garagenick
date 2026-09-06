export type Category = {
  id: string;
  name: string;
};

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  calories: number;
  proteins: number;
  fats: number;
  carbs: number;
  imageUrl: string | null;
  categoryId: string | null;
  category: string | null;
  isActive: boolean;
};

export type MenuItem = {
  id: string;
  date: string;
  product: Product;
};

export type UserProfile = {
  id: string;
  phone: string;
  name: string | null;
};

export type OrderResponse = {
  id: string;
  status: string;
  total: number;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: {
      id: string;
      name: string;
      imageUrl: string | null;
    };
  }>;
};
