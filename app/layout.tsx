import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { SidebarProvider } from "@/context/SidebarContext";
import { BlockRegistryProvider } from "@/context/BlockRegistryContext";

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
  title: "Dynamic Frontend Docs",
  description:
    "Backend-driven API documentation builder powered by JSON schemas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fa"
      suppressHydrationWarning
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col text-slate-950">
        <BlockRegistryProvider>
          <SidebarProvider>{children}</SidebarProvider>
        </BlockRegistryProvider>
      </body>
    </html>
  );
}
