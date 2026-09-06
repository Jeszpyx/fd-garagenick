import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Manrope, Source_Serif_4 } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin", "cyrillic"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin", "cyrillic"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#dce8dc",
};

export const metadata: Metadata = {
  title: {
    default: "GarageNick — доставка еды",
    template: "%s | GarageNick",
  },
  description:
    "Доставка готового меню на день: свежие блюда, калории и состав — выбирайте дату и оформляйте заказ.",
  openGraph: {
    title: "GarageNick — доставка еды",
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
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} ${manrope.variable} h-full antialiased`}
    >
      <body className="min-h-full min-w-0 flex flex-col overflow-x-clip">
        {children}
        <Toaster richColors position="top-center" offset={16} />
      </body>
    </html>
  );
}
