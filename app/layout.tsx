import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

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
  title: "Closium — Analyse d'appels commerciaux",
  description:
    "Analysez vos appels commerciaux et identifiez exactement pourquoi vous perdez des deals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
