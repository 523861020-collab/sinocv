import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SINOCV | 卡车·工程机械·Van·挂车 出口专家",
  description: "专业出口中国重汽重卡、徐工工程机械、中集挂车、福田商用车。牵引车、自卸车、搅拌车、挖掘机、装载机、冷藏车、专用车等全系列。服务非洲、中东、东南亚50+国家。",
  keywords: "中国重汽, HOWO, SITRAK, 徐工, 中集, 福田, 重卡出口, 牵引车, 自卸车, 搅拌车, 挖掘机, 装载机, 挂车",
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
