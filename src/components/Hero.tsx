'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
          transition={{ duration: 1.2 }}
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

      {/* Content */}
      <div className="relative z-20 flex h-full items-center pointer-events-none">
        <div className="container mx-auto px-6 lg:px-16 pointer-events-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-4 text-lg tracking-widest text-amber-400"
              >
                {slides[current].subtitle}
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mb-6 text-5xl font-bold leading-relaxed tracking-normal text-white md:text-7xl"
              >
                {slides[current].title}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="mb-8 text-xl leading-relaxed tracking-normal text-gray-300"
              >
                {slides[current].description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="flex flex-wrap gap-4"
              >
                <Link
                  href={slides[current].link}
                  className="rounded-md bg-amber-500 px-8 py-4 text-lg font-semibold text-black transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/30"
                >
                  {t.hero.ctaProducts}
                </Link>
                <a
                  href="https://wa.me/8619103781257" target="_blank"
                    className="rounded-md border-2 border-green-500 bg-green-500 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-green-500/20 transition-all hover:bg-green-400 hover:border-green-400"
                >
                  {t.hero.ctaQuote}
                </a>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-10 left-1/2 z-20 flex -translate-x-1/2 gap-3">
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
