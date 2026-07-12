import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import { Analytics } from "@vercel/analytics/react";

export const metadata: Metadata = {
  title: "XINYUNTONG | Chinese Commercial Vehicles Export",
  description: "Professional export of SINOTRUK heavy trucks, XCMG machinery, and CIMC trailers.",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!routing.locales.includes(locale as 'en' | 'fr' | 'ar')) {
    notFound();
  }

  const messages = await getMessages();
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} className="h-full antialiased" dir={isRTL ? 'rtl' : 'ltr'}>
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
