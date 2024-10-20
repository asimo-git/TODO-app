import type { Metadata } from "next";
import localFont from "next/font/local";
// import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.scss";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";

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
        <Header />
        <div className="d-flex flex-grow-1">
          <Sidebar />
          <main className="flex-grow-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
