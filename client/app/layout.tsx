import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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
  title: "M-PESA Wrapped - Your Money Story",
  description: "Discover your M-PESA spending patterns and habits",
  authors: [{ name: "Kagema Njoroge", url: "https://github.com/kagemanjoroge" }],
  openGraph: {
    title: "M-PESA Wrapped - Your Money Story",
    description: "Discover your M-PESA spending patterns and habits",
    url: "https://mpesa-wrapped.vercel.app",
    siteName: "M-PESA Wrapped",}
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
