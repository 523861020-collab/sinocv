'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const slides = [
  {
    image: '/images/hero-tractor.jpg',
    title: '中国重汽 牵引车',
    subtitle: 'HOWO / SITRAK · 德国曼技术',
    description: '潍柴发动机，6×4驱动，30年重卡出口经验',
    link: '/heavy-truck'
  },
  {
    image: '/images/hero-excavator.jpg',
    title: '徐工 挖掘机',
    subtitle: 'XCMG · 中国工程机械第一品牌',
    description: 'XE215挖掘机、ZL50装载机，矿山/基建/市政工程',
    link: '/machinery'
  },
  {
    image: '/images/hero-van.jpg',
    title: '福田 Van 封闭货车',
    subtitle: 'Foton · 城市物流配送专家',
    description: '图雅诺Van、时代微卡，经济节油，灵活高效',
    link: '/light'
  },
  {
    image: '/images/hero-trailer.jpg',
    title: '中集 挂车',
    subtitle: 'CIMC · 全球挂车销量第一',
    description: '平板挂车、自卸挂车，13吨车桥，耐用可靠',
    link: '/trailers'
  },
  {
    image: '/images/hero-mining.jpg',
    title: '矿用宽体自卸车',
    subtitle: '同力重工 · 徐工 · 临工重机',
    description: '40-45吨载重，加强型底盘，适应矿山恶劣工况',
    link: '/mining'
  }
];

export default function Hero() {
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
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent pointer-events-none" />
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
                className="flex gap-4"
              >
                <Link
                  href={slides[current].link}
                  className="rounded-md bg-amber-500 px-8 py-4 text-lg font-semibold text-black transition-all hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/30"
                >
                  查看产品
                </Link>
                <a
                  href="/#contact"
                  className="rounded-md border-2 border-white px-8 py-4 text-lg font-semibold text-white transition-all hover:bg-white hover:text-black"
                >
                  立即询价
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
