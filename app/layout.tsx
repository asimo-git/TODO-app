import type { Metadata } from "next";
import localFont from "next/font/local";
import { AuthProvider } from "./components/AuthProvider";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import "./globals.scss";

const geistMono = localFont({
  src: "./fonts/Bellota-BoldItalic.ttf",
  variable: "--font-regular",
  weight: "100 900",
});

const accentFont = localFont({
  src: "./fonts/Pacifico-Regular.ttf",
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
        <Header />
        <AuthProvider>
          <div className="d-flex flex-grow-1">
            <Sidebar />
            <main className="flex-grow-1">{children}</main>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
