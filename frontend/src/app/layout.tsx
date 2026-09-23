import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FieldIn",
  description: "Hyper-local sports venues, matchmaking, and rewards",
};

// Applies a persisted "light" theme preference before first paint, so
// returning light-mode users don't see a flash of the default dark theme.
// Dark is the default and requires no attribute (see globals.css).
const THEME_INIT_SCRIPT = `try{if(localStorage.getItem('fieldin-theme')==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-text-primary">
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
