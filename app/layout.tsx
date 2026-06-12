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

const gustavo = localFont({
  src: [
    { path: "./fonts/gustavo/Gustavo-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/gustavo/Gustavo-Italic.otf", weight: "400", style: "italic" },
    { path: "./fonts/gustavo/Gustavo-Bold.otf", weight: "700", style: "normal" },
    { path: "./fonts/gustavo/Gustavo-BoldItalic.otf", weight: "700", style: "italic" },
  ],
  variable: "--font-gustavo",
  display: "swap",
});

const spaceGrotesk = localFont({
  src: [
    { path: "./fonts/space-grotesk/SpaceGrotesk-Light.ttf", weight: "300", style: "normal" },
    { path: "./fonts/space-grotesk/SpaceGrotesk-Regular.ttf", weight: "400", style: "normal" },
    { path: "./fonts/space-grotesk/SpaceGrotesk-Medium.ttf", weight: "500", style: "normal" },
    { path: "./fonts/space-grotesk/SpaceGrotesk-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-space-grotesk",
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
      className={`${ttFirsNeue.variable} ${gustavo.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider />
        {children}
      </body>
    </html>
  );
}
