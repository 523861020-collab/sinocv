'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Advantages from '@/components/Advantages';
import Contact from '@/components/Contact';
import { trucks, zones, categories } from '@/data/trucks';

// Build a flat list of all products with zone info
const allProducts = zones.flatMap(zone =>
  trucks
    .filter(t => zone.categories.includes(t.category))
    .map(t => ({ ...t, zoneId: zone.id, zoneTitle: zone.title, zoneHref: zone.id === 'heavy-truck' ? '/heavy-truck' : `/${zone.id}` }))
);

export default function Home() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  const goTo = useCallback((i: number) => {
    setDirection(i > current ? 1 : -1);
    setCurrent(i);
  }, [current]);

  // Auto-rotate
  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setCurrent(prev => (prev + 1) % allProducts.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const product = allProducts[current];

  return (
    <>
      <Hero />

      {/* Product Showcase */}
      <section className="bg-gray-950 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">产品中心</h2>
            <p className="text-gray-400 text-lg">一站式采购，满足您的所有需求</p>
          </motion.div>

          {/* Single Product Showcase */}
          <div className="max-w-md mx-auto">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={{ opacity: 0, x: direction * 60 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -60 }}
                transition={{ duration: 0.4 }}
                className="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden group"
              >
                {/* Image */}
                <div className="relative h-64 overflow-hidden bg-gray-800">
                  <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
                  {/* Category badge */}
                  <div className="absolute top-4 left-4 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-black">
                    {categories.find(c => c.id === product.category)?.name}
                  </div>
                  {product.horsepower > 0 && (
                    <div className="absolute top-4 right-4 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                      {product.horsepower}HP
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-6">
                  <Link href={product.zoneHref} className="text-amber-500 text-xs mb-2 inline-block hover:underline">
                    {product.zoneTitle}
                  </Link>
                  <h3 className="text-xl font-bold text-white mb-1">{product.name}</h3>
                  <p className="text-amber-500 text-sm mb-4">{product.brand}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">驱动</span>
                      <span className="text-gray-300">{product.driveType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">发动机</span>
                      <span className="text-gray-300">{product.engine}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">价格</span>
                      <span className="text-amber-500 font-semibold">{product.price}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {product.features.slice(0, 4).map((f, i) => (
                      <span key={i} className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-400">{f}</span>
                    ))}
                  </div>

                  <div className="flex gap-3">
                    <Link
                      href={product.zoneHref}
                      className="flex-1 rounded-md bg-amber-500/10 py-3 text-center text-amber-500 font-semibold text-sm transition-all hover:bg-amber-500 hover:text-black"
                    >
                      查看品类
                    </Link>
                    <a
                      href="/#contact"
                      className="flex-1 rounded-md bg-white/5 py-3 text-center text-white font-semibold text-sm transition-all hover:bg-white/10"
                    >
                      获取报价
                    </a>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-6">
              {allProducts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === current ? 'w-8 bg-amber-500' : 'w-4 bg-gray-700'
                  }`}
                />
              ))}
            </div>

            {/* Counter */}
            <p className="text-center text-gray-600 text-xs mt-3">
              {current + 1} / {allProducts.length}
            </p>
          </div>
        </div>
      </section>

      <Advantages />
      <Contact />
    </>
  );
}
