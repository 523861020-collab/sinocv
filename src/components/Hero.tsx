'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useLocale } from 'next-intl';
import { content } from '@/data/site-i18n';

// 图片与跳转固定在代码里，文案按语言从 site-i18n 取（2026-11-01）
const HERO_META = [
  { image: '/images/hero-tractor.webp', link: '/heavy-truck' },
  { image: '/images/hero-excavator.webp', link: '/machinery' },
  { image: '/images/hero-mining-new.webp', link: '/mining' },
  { image: '/images/hero-trailer.webp', link: '/trailers' },
  { image: '/images/hero-van-new.webp', link: '/light' }
];

export default function Hero() {
  const locale = useLocale();
  const t = content(locale);
  const slides = HERO_META.map((m, i) => ({
    ...m,
    ...t.hero.slides[i],
    description: t.hero.slides[i].desc,
  }));
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPrev(current);
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [current]);

  const goTo = (i: number) => {
    setPrev(current);
    setCurrent(i);
  };

  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* All slides layered */}
      {slides.map((slide, i) => (
        <motion.div
          key={i}
          initial={false}
          animate={{
            opacity: i === current ? 1 : i === prev ? 0 : 0,
            pointerEvents: i === current ? 'auto' : 'none',
          }}
          transition={{ duration: 0.45 }}
          className="absolute inset-0"
        >
          <Link href={slide.link} className="absolute inset-0 z-10 cursor-pointer" aria-label={slide.title} />
          <div
            className="h-full w-full bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          {/* 2026-11-01 修：RTL 下文字在右侧，渐变必须镜像，否则阿拉伯语压在亮色车身上看不清 */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent rtl:bg-gradient-to-l pointer-events-none" />
        </motion.div>
      ))}

      {/* Content — 文案不做进出场动画：原来 AnimatePresence mode="wait" 在切换间隙会把文字整段清空，
          手机上（尤其微信内置浏览器）能停近 1 秒，看起来像"图配错了"。文字瞬切、始终有内容最稳。
          2026-11-09 手机端排版：页头高 80px，顶部留 pt-24 让出位置；字号 5xl→4xl 起（390 宽屏
          "SINOTRUK Light Vehicles" 两行会压到 logo）；底部 pb-44 让出指示点 + 两个悬浮按钮。 */}
      <div className="relative z-20 flex h-full items-start pt-24 pb-40 sm:items-center sm:py-0 pointer-events-none">
        <div className="container mx-auto px-6 lg:px-16 pointer-events-auto">
          <div className="max-w-3xl">
            <p className="mb-2 text-sm tracking-widest text-amber-400 sm:mb-4 sm:text-lg">
              {slides[current].subtitle}
            </p>
            <h1 className="mb-4 text-4xl font-bold leading-tight tracking-normal text-white sm:mb-6 sm:text-5xl sm:leading-relaxed md:text-7xl">
              {slides[current].title}
            </h1>
            <p className="mb-6 text-base leading-relaxed tracking-normal text-gray-300 line-clamp-2 sm:mb-8 sm:text-xl sm:line-clamp-none">
              {slides[current].description}
            </p>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                href={slides[current].link}
                className="rounded-md bg-amber-500 px-6 py-3 text-base font-semibold text-black transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/30 sm:px-8 sm:py-4 sm:text-lg"
              >
                {t.hero.ctaProducts}
              </Link>
              <a
                href="https://wa.me/8619103781257" target="_blank"
                className="rounded-md border-2 border-green-500 bg-green-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-400 hover:border-green-400 sm:px-8 sm:py-4 sm:text-lg"
              >
                {t.hero.ctaQuote}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3 max-sm:bottom-32">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all ${
              i === current ? 'w-12 bg-amber-500' : 'w-6 bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
