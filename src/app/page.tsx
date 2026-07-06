'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Advantages from '@/components/Advantages';
import Contact from '@/components/Contact';
import { trucks, zones, categories } from '@/data/trucks';

const PER_PAGE = 3;

function ProductCard({ product }: { product: typeof trucks[0] }) {
  return (
    <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden group hover:border-amber-500/50 transition-all duration-300">
      <div className="relative h-44 overflow-hidden bg-gray-800">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-black">
          {categories.find(c => c.id === product.category)?.name}
        </div>
        {product.horsepower > 0 && (
          <div className="absolute top-3 right-3 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white">
            {product.horsepower}HP
          </div>
        )}
      </div>
      <div className="p-4">
        <p className="text-amber-500 text-xs mb-1">{product.brand}</p>
        <h3 className="text-sm font-bold text-white mb-2 group-hover:text-amber-500 transition-colors truncate">{product.name}</h3>
        <div className="flex justify-between text-xs mb-3">
          <span className="text-gray-500">{product.driveType}</span>
          <span className="text-amber-500 font-semibold">{product.price}</span>
        </div>
      </div>
    </div>
  );
}

function ZoneSection({ zone, index }: { zone: typeof zones[0]; index: number }) {
  const products = trucks.filter(t => zone.categories.includes(t.category));
  const totalPages = Math.ceil(products.length / PER_PAGE);
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);

  const goTo = useCallback((i: number) => {
    setDir(i > page ? 1 : -1);
    setPage(i);
  }, [page]);

  useEffect(() => {
    if (totalPages <= 1) return;
    const t = setInterval(() => {
      setDir(1);
      setPage(p => (p + 1) % totalPages);
    }, 5000);
    return () => clearInterval(t);
  }, [totalPages]);

  const currentProducts = products.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="py-14 border-b border-gray-800 last:border-0"
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Zone header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{zone.title}</h2>
          <p className="text-amber-500 text-sm mb-1">{zone.brand}</p>
          <p className="text-gray-500 text-xs">{zone.description}</p>
        </div>

        {/* Product grid */}
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={page}
            custom={dir}
            initial={{ opacity: 0, x: dir * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: dir * -40 }}
            transition={{ duration: 0.35 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6"
          >
            {currentProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Dots + link */}
        <div className="flex items-center justify-center gap-2">
          {totalPages > 1 && Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`h-1.5 rounded-full transition-all ${i === page ? 'w-6 bg-amber-500' : 'w-2 bg-gray-700'}`}
            />
          ))}
          <Link
            href={zone.id === 'heavy-truck' ? '/heavy-truck' : `/${zone.id}`}
            className="ml-4 text-amber-500 hover:text-amber-400 text-sm font-semibold transition-colors"
          >
            查看全部 {products.length} 款 →
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      <section className="bg-gray-950 py-16">
        <div className="text-center mb-4">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">产品中心</h2>
          <p className="text-gray-400 text-lg">五大品类 · {trucks.length}款产品 · 一站式采购</p>
        </div>
        {zones.map((zone, i) => (
          <ZoneSection key={zone.id} zone={zone} index={i} />
        ))}
      </section>

      <Advantages />
      <Contact />
    </>
  );
}
