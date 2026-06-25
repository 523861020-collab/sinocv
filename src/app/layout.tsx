import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HOWO Truck Export | 中国重卡出口专家",
  description: "专业出口中国重汽HOWO/SITRAK系列重卡，服务非洲、中东、东南亚等50+国家。牵引车、自卸车、搅拌车、罐式车等全系列车型。",
  keywords: "HOWO, SITRAK, 中国重汽, 重卡出口, 牵引车, 自卸车, 搅拌车, 非洲卡车, 中东卡车",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-white font-sans">{children}</body>
    </html>
  );
}
