import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navbar";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Système de Vote",
  description: "Plateforme de vote en ligne avec Next.js, React, Tailwind et Supabase",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Navbar />
        <main className="container mx-auto py-6 px-4 min-h-[calc(100vh-64px)]">
          {children}
        </main>
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
