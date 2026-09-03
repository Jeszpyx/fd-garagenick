import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4efe6",
};

export const metadata: Metadata = {
  title: {
    default: "GarageNick — доставка еды",
    template: "%s | GarageNick",
  },
  description:
    "Современная доставка еды с меню на каждый день недели, корзиной и быстрым входом по телефону.",
  openGraph: {
    title: "GarageNick — доставка еды",
    description: "Заказывайте свежие блюда с доставкой",
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full min-w-0 flex flex-col overflow-x-clip">
        {children}
        <Toaster richColors position="top-center" offset={16} />
      </body>
    </html>
  );
}
