import type { Metadata } from "next";
import { Inter, Be_Vietnam_Pro } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider } from "@/components/shared/react-query-provider";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

const beVietnamPro = Be_Vietnam_Pro({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hot Desking Management System",
  description:
    "Hệ thống quản lý chỗ ngồi linh hoạt (Hot Desking) cho doanh nghiệp — đặt chỗ nhanh, quản lý thông minh.",
  keywords: ["hot desking", "seat booking", "workspace management"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={`${inter.variable} ${beVietnamPro.variable}`} suppressHydrationWarning>
      <body className="font-be-vietnam-pro antialiased bg-background text-foreground">
        <ReactQueryProvider>{children}</ReactQueryProvider>
      </body>
    </html>
  );
}
