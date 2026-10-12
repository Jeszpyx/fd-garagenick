import type { Metadata, Viewport } from "next";
import { Geist, Manrope, Source_Serif_4 } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#dce8dc",
};

export const metadata: Metadata = {
  title: {
    default: "Кафе Василёк — доставка еды",
    template: "%s | Кафе Василёк",
  },
  description:
    "Доставка готового меню на день: свежие блюда, калории и состав — выбирайте дату и оформляйте заказ.",
  openGraph: {
    title: "Кафе Василёк — доставка еды",
    description: "Заказывайте готовый день с доставкой",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${sourceSerif.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full min-w-0 flex flex-col overflow-x-clip">
        {children}
        <Toaster richColors position="top-center" offset={16} />
      </body>
    </html>
  );
}
