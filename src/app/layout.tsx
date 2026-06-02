import type { Metadata, Viewport } from "next";
import { Onest, Unbounded } from "next/font/google";
import { PwaRegister } from "@/components/PwaRegister";
import { SessionSync } from "@/components/SessionSync";
import "./globals.css";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  variable: "--font-onest",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin", "cyrillic"],
  weight: ["700", "800"],
  variable: "--font-unbounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Економия",
  description: "Хватит тратить бабки — учёт семейных расходов",
  manifest: "/manifest.webmanifest",
  applicationName: "Економия",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Економия",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0f1114",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${onest.variable} ${unbounded.variable}`}>
      <head>
        <link rel="apple-touch-startup-image" href="/splash.png" />
      </head>
      <body className="font-sans">
        <PwaRegister />
        <SessionSync />
        {children}
      </body>
    </html>
  );
}
