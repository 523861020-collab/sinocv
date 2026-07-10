'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const slides = [
  {
    image: '/images/hero-tractor.jpg',
    title: 'SINOTRUK Tractor Truck',
    subtitle: 'HOWO / SITRAK · German MAN Technology',
    description: 'Weichai engine, 6×4 drive, 30 years of heavy truck export experience',
    link: '/heavy-truck'
  },
  {
    image: '/images/hero-excavator.jpg',
    title: 'XCMG Excavator',
    subtitle: 'XCMG · China\'s #1 Construction Machinery',
    description: 'XE215 Excavator, ZL50 Loader — mining, infrastructure, municipal projects',
    link: '/machinery'
  },
  {
    image: '/images/hero-van-new.jpg',
    title: 'SINOTRUK Light Vehicles',
    subtitle: 'SINOTRUK · Urban Logistics Expert',
    description: 'Light Vehicles — fuel-efficient, spacious, and reliable for cargo delivery',
    link: '/light'
  },
  {
    image: '/images/hero-trailer.jpg',
    title: 'CIMC Trailer',
    subtitle: 'CIMC · Global #1 Trailer Manufacturer',
    description: 'Flatbed trailers, dump trailers — 13-ton axles, durable and dependable',
    link: '/trailers'
  },
  {
    image: '/images/hero-mining-new.jpg',
    title: 'Mining Dump Truck',
    subtitle: 'SINOTRUK · 70-105T Wide-body Mining Trucks',
    description: '40-45 ton payload, reinforced chassis, built for harsh mining conditions',
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
                  View Products
                </Link>
                <a
                  href="https://wa.me/8619103781257" target="_blank"
                    className="rounded-md border-2 border-green-500 px-8 py-4 text-lg font-semibold text-green-400 transition-all hover:bg-green-500 hover:text-white"
                >
                  Get Quote
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
