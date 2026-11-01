import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import AiChat from "@/components/AiChat";
import VisitPing from "@/components/VisitPing";
import { Analytics } from "@vercel/analytics/react";

// 2026-11-01 SEO：每个语言有独立标题/描述/canonical。
// 原因：原来全站（首页+5个分类页）共用一个标题，谷歌认为都是同一个页面，只收录了 8 条，
// 搜来的全是泛词的非目标国客。分类页标题由各 page.tsx 的 generateMetadata 覆盖。
const SITE = "https://www.sinocv.com";

const HOME: Record<string, { title: string; desc: string }> = {
  en: {
    title: "Chinese Trucks & Machinery for Africa & Middle East | SINOTRUK HOWO SHACMAN XCMG Exporter",
    desc: "Export supplier of SINOTRUK HOWO / SITRAK / SHACMAN heavy trucks, XCMG excavators and CIMC trailers. Factory FOB / CFR prices, spare parts, shipping to Africa, Middle East, Southeast Asia.",
  },
  fr: {
    title: "Camions et engins chinois pour l'Afrique et le Moyen-Orient | HOWO SHACMAN XCMG",
    desc: "Fournisseur export de camions lourds SINOTRUK HOWO / SHACMAN, excavatrices XCMG et semi-remorques CIMC. Prix usine FOB / CFR, pièces détachées, livraison en Afrique et au Moyen-Orient.",
  },
  ar: {
    title: "شاحنات ومعدات صينية للتصدير إلى أفريقيا والشرق الأوسط | HOWO SHACMAN XCMG",
    desc: "مورد تصدير شاحنات SINOTRUK HOWO و SHACMAN الثقيلة، حفارات XCMG، ومقطورات CIMC. أسعار المصنع FOB / CFR، قطع غيار، وشحن إلى أفريقيا والشرق الأوسط.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const m = HOME[locale] || HOME.en;
  const canonical = locale === "en" ? SITE : `${SITE}/${locale}`;
  return {
    title: { default: m.title, template: "%s | XINYUNTONG" },
    description: m.desc,
    alternates: {
      canonical,
      languages: { en: `${SITE}/en`, fr: `${SITE}/fr`, ar: `${SITE}/ar`, "x-default": SITE },
    },
    openGraph: {
      title: m.title,
      description: m.desc,
      url: canonical,
      siteName: "XINYUNTONG",
      locale: locale === "fr" ? "fr_FR" : locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

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
        {/* 2026-11-01 性能：logo 476KB 却是全站第一张图，被 4 次 preload 抢带宽。
            这里去掉无谓的证书/经理照片预加载，只预加载 logo 并标记为高优先级。 */}
        <link rel="preload" as="image" href="/images/logo-nav.png" fetchPriority="high" />
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
          <AiChat />
          <VisitPing />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
