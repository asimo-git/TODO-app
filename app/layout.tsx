import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const accentFont = localFont({
  src: "./fonts/IslandMoments-Regular.ttf",
  variable: "--font-accent",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Todo App",
  description: "todo list maker and habit tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${accentFont.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
