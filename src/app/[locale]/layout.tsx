import type { Metadata } from "next";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import QuickLead from "@/components/QuickLead";
import VisitPing from "@/components/VisitPing";
import StructuredData from "@/components/StructuredData";
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

// 2026-11-01 性能：原来 [locale] 下所有页面都是"动态渲染"(ƒ)，每次访问都要在
// 服务器函数里现算一遍，TTFB 实测 1.4–4.1 秒——非洲客户用手机打开要等 4 秒以上。
// 加 generateStaticParams 后三语首页/分类页在构建时预生成，由 Vercel 全球 CDN 直接返回，
// 内容改动 1 小时内自动重建(ISR)，客户在肯尼亚/尼日利亚打开就是百毫秒级。
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export const revalidate = 3600;

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
      // 2026-11-01：原来没有 og:image，客户在 WhatsApp/Facebook 转发链接时
      // 显示的是一行灰字，没有任何卡车照片，白白损失信任。补一张 1200x630 封面。
      images: [{ url: `${SITE}/images/og-cover.jpg`, width: 1200, height: 630, alt: "XINYUNTONG — Chinese trucks & machinery exporter" }],
    },
    twitter: {
      card: "summary_large_image",
      title: m.title,
      description: m.desc,
      images: [`${SITE}/images/og-cover.jpg`],
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
  setRequestLocale(locale);

  const messages = await getMessages();
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} className="h-full antialiased" dir={isRTL ? 'rtl' : 'ltr'}>
      <body className="min-h-full flex flex-col bg-black text-white font-sans">
        {/* 2026-11-01 性能：logo 476KB 却是全站第一张图，被 4 次 preload 抢带宽。
            这里去掉无谓的证书/经理照片预加载，只预加载 logo 并标记为高优先级。 */}
        <link rel="preload" as="image" href="/images/logo-nav.webp" fetchPriority="high" />
        {/* 结构化数据：让谷歌/必应认出公司、产品、地址（2026-11-01） */}
        <StructuredData locale={locale} />
        <NextIntlClientProvider messages={messages}>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <WhatsAppFloat />
          {/* 2026-11-01 李总要求：取消 AI 聊天，改成一屏快速询价，5分钟内回电 */}
          <QuickLead />
          <VisitPing />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
