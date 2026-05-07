import type { Metadata } from "next";
import { Noto_Sans_JP, Inter } from "next/font/google";
import { PecoToastProvider } from "@/components/peco";
import "./globals.css";

const notoSansJp = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PECO Smart Pet Medical — Design System",
  description:
    "PECO Smart Pet Medical 共通デザインシステム / SFA・診断支援・PecoStock 共通コンポーネントライブラリ",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ja"
      className={`${notoSansJp.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PecoToastProvider position="top-right">{children}</PecoToastProvider>
      </body>
    </html>
  );
}
