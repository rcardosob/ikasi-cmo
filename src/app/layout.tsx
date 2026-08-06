import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ikasi CMO • Plataforma Inteligente de Marketing Inmobiliario",
  description: "Plataforma web interna para la automatización de marketing, generación de assets y fichas multilingües de propiedades industriales de Ikasi Inmobiliaria®.",
  icons: {
    icon: "/brand/Monograma_IK.ico",
    shortcut: "/brand/Monograma_IK.ico",
    apple: "/brand/Monograma_IK.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
