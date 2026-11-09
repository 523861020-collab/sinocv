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
    // 2026-11-09 手机端：横版大图在竖屏上被 cover 裁得只剩中间一条（客户看不到整台车）。
    // 改成「手机上图片按 16:9 完整显示 + 文案在图下方」，桌面 md 以上保持原来的满屏 hero。
    <section className="relative flex w-full flex-col bg-black pt-20 md:block md:h-screen md:overflow-hidden md:pt-0">
      {/* All slides layered — 手机：固定 16:9 高度、object-cover 不裁切；桌面：满屏铺满 */}
      <div className="relative aspect-video w-full shrink-0 md:absolute md:inset-0 md:aspect-auto md:h-full">
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
            {/* 手机：先用同图模糊铺底，消除 contain 留出的黑边（5 张图比例不同，1.33~2.63） */}
            <div
              className="absolute inset-0 scale-110 blur-xl opacity-50 md:hidden"
              style={{ backgroundImage: `url(${slide.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
            />
            {/* 手机用 object-contain 保证整台车都在画面里；桌面用 object-cover 铺满 */}
            <img
              src={slide.image}
              alt={slide.title}
              className="relative h-full w-full object-contain md:object-cover"
            />
            {/* 桌面：左侧压暗保证文字可读；RTL 下文字在右，渐变镜像 */}
            <div className="absolute inset-0 hidden bg-gradient-to-r from-black/80 via-black/50 to-transparent rtl:bg-gradient-to-l pointer-events-none md:block" />
            {/* 手机：只有底部薄渐变，指示点看得清，图本身不压暗 */}
            <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none md:hidden" />
          </motion.div>
        ))}

        {/* Slide Indicators — 放在图片区底部，手机上不会和右下角悬浮按钮打架 */}
        <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-3 md:bottom-10">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`slide ${i + 1}`}
              className={`h-2 rounded-full transition-all ${
                i === current ? 'w-12 bg-amber-500' : 'w-6 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Content — 文案不做进出场动画：原来 AnimatePresence mode="wait" 在切换间隙会把文字整段清空，
          手机上（尤其微信内置浏览器）能停近 1 秒，看起来像"图配错了"。文字瞬切、始终有内容最稳。 */}
      <div className="relative z-20 flex px-6 py-7 pointer-events-none md:absolute md:inset-0 md:h-full md:items-center md:px-0 md:py-0">
        <div className="container mx-auto md:px-6 lg:px-16 pointer-events-auto">
          <div className="max-w-3xl">
            <p className="mb-2 text-sm tracking-widest text-amber-400 sm:mb-4 sm:text-lg">
              {slides[current].subtitle}
            </p>
            <h1 className="mb-3 text-3xl font-bold leading-tight tracking-normal text-white sm:mb-6 sm:text-5xl sm:leading-relaxed md:text-7xl">
              {slides[current].title}
            </h1>
            <p className="mb-6 text-base leading-relaxed tracking-normal text-gray-300 sm:mb-8 sm:text-xl">
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
    </section>
  );
}
