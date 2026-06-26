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
  title: "Closium — Sales call analysis",
  description:
    "Analyze your sales calls and pinpoint exactly why you lose deals.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} h-full antialiased`}>
      <body className="min-h-full">{children}</body>
    </html>
  );
}
