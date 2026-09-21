import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HeaderBar } from "@/components/layout/HeaderBar";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FieldIn",
  description: "Hyper-local sports venues, matchmaking, and rewards",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-text-primary">
        <Providers>
          <HeaderBar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
