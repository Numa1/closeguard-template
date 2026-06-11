import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "@/components/ThemeProvider";
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

const ttOtilito = localFont({
  src: [
    { path: "./fonts/otilito/TTOtilito-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/otilito/TTOtilito-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/otilito/TTOtilito-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/otilito/TTOtilito-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "./fonts/otilito/TTOtilito-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-tt-otilito",
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
    <html
      lang="fr"
      className={`${ttFirsNeue.variable} ${ttOtilito.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider />
        {children}
      </body>
    </html>
  );
}
