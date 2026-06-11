import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const ttFirsNeue = localFont({
  src: [
    { path: "./fonts/TTFirsNeue-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/TTFirsNeue-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/TTFirsNeue-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/TTFirsNeue-DemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/TTFirsNeue-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-tt-firs-neue",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CloseGuard — Analyse d'appels commerciaux",
  description:
    "Analysez vos appels commerciaux et identifiez exactement pourquoi vous perdez des deals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${ttFirsNeue.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f6f6f6] text-[#000102]">{children}</body>
    </html>
  );
}
