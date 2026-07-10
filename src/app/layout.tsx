import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "XINYUNTONG | Chinese Commercial Vehicles Export",
  description: "Professional export of SINOTRUK heavy trucks, XCMG machinery, and CIMC trailers. Tractors, dump trucks, mixers, excavators, loaders, reefers, special vehicles. Serving 50+ countries across Africa, Middle East, and Southeast Asia.",
  keywords: "SINOTRUK, HOWO, SITRAK, XCMG, CIMC, heavy truck export, tractor truck, dump truck, mixer truck, excavator, loader, trailer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppFloat />
        <Analytics />
      </body>
    </html>
  );
}
