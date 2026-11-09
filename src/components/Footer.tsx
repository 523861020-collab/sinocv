'use client';

import { useTranslations, useLocale } from 'next-intl';
import Link from 'next/link';

export default function Footer() {
  const t = useTranslations();
  // 2026-11-01 修复：原来页脚链接写死 /heavy-truck，法语/阿语客户一点就被
  // 307 踢回 /en，语言丢了。改成带语言前缀的站内跳转。
  const locale = useLocale();
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="px-6 lg:px-16 max-w-[1920px] mx-auto pt-12 pb-36 md:pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            {/* 2026-11-09 品牌块重排：logo 放大一档、tagline 限宽成两行、社交图标统一 16px 高光学尺寸，
                不再是一条橙色长句 + 三个粗细不一的圆点。 */}
            <div className="flex flex-col items-start gap-3 mb-5">
              <img src="/images/logo-nav.webp" alt="Logo" className="h-11 w-auto" width={144} height={44} />
              <p className="max-w-[170px] text-[13px] font-medium leading-snug text-amber-500">
                {t('footer.tagline')}
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <a href="https://www.facebook.com/chintruck" target="_blank" rel="noopener noreferrer" aria-label="Facebook"
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/10 text-gray-300 transition-colors hover:bg-[#1877F2] hover:text-white hover:ring-transparent">
                <svg className="h-4 w-auto" viewBox="0 0 320 512" fill="currentColor"><path d="M80 299.3V512h116V299.3h86.5l18-97.8H196v-34.6c0-51.7 20.3-71.5 72.7-71.5 16.3 0 29.4.4 37 1.2V7.9C291.4 4 256.4 0 236.2 0 129.3 0 80 50.5 80 159.4v42.1H14v97.8h66z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/xinyuntong" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/10 text-gray-300 transition-colors hover:bg-[#0A66C2] hover:text-white hover:ring-transparent">
                <svg className="h-4 w-auto" viewBox="0 0 448 512" fill="currentColor"><path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"/></svg>
              </a>
              <a href="https://www.youtube.com/@sinocv-u2k" target="_blank" rel="noopener noreferrer" aria-label="YouTube"
                className="flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white/[0.06] ring-1 ring-inset ring-white/10 text-gray-300 transition-colors hover:bg-[#FF0000] hover:text-white hover:ring-transparent">
                <svg className="h-4 w-auto" viewBox="0 0 576 512" fill="currentColor"><path d="M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">{t('footer.partnerBrands')}</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>SINOTRUK</p>
              <p>XCMG</p>
              <p>CIMC</p>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">{t('footer.quickLinks')}</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <Link href={`/${locale}/heavy-truck`} className="text-gray-400 hover:text-amber-500">{t('nav.heavyTrucks')}</Link>
              <Link href={`/${locale}/machinery`} className="text-gray-400 hover:text-amber-500">{t('nav.machinery')}</Link>
              <Link href={`/${locale}/mining`} className="text-gray-400 hover:text-amber-500">{t('nav.mining')}</Link>
              <Link href={`/${locale}/trailers`} className="text-gray-400 hover:text-amber-500">{t('nav.trailers')}</Link>
              <Link href={`/${locale}/light`} className="text-gray-400 hover:text-amber-500">{t('nav.lightVehicles')}</Link>
              <Link href={`/${locale}/about`} className="text-gray-400 hover:text-amber-500">{locale === 'fr' ? 'À propos' : locale === 'ar' ? 'من نحن' : 'About Us'}</Link>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">{t('footer.contact')}</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📱 <bdi>+86 13001977959</bdi></p>
              <a href="https://wa.me/8619103781257" target="_blank" rel="noopener" className="flex items-center gap-2 text-green-400 hover:text-green-300">
                <span>💬 WhatsApp: <bdi>+86 19103781257</bdi></span>
              </a>
              <p>📧 <bdi>lishanlong@sinocv.com</bdi></p>
              <p>📍 {t('footer.address')}</p>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-800 text-center text-gray-600 text-xs">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  );
}
