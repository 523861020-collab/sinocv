import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "SINOCV | Trucks · Machinery · Vans · Trailers Export Experts",
  description: "Professional export of SINOTRUK heavy trucks, XCMG machinery, CIMC trailers, and Foton commercial vehicles. Tractor trucks, dump trucks, mixer trucks, excavators, loaders, reefers, special vehicles. Serving 50+ countries across Africa, Middle East, and Southeast Asia.",
  keywords: "SINOTRUK, HOWO, SITRAK, XCMG, CIMC, Foton, heavy truck export, tractor truck, dump truck, mixer truck, excavator, loader, trailer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
