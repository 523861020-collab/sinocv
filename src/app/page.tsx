'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '@/components/Hero';
import Advantages from '@/components/Advantages';
import Contact from '@/components/Contact';
import { trucks, zones, categories } from '@/data/trucks';

function ZoneWindow({ zone }: { zone: typeof zones[0] }) {
  const products = trucks.filter(t => zone.categories.includes(t.category));
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (products.length <= 1) return;
    const t = setInterval(() => setCurrent(p => (p + 1) % products.length), 3500);
    return () => clearInterval(t);
  }, [products.length]);

  const p = products[current];
  if (!p) return null;

  return (
    <div className="rounded-2xl bg-gray-900 border border-gray-800 overflow-hidden group hover:border-amber-500/40 transition-colors">
      {/* Zone label */}
      <div className="bg-gray-800/50 px-4 py-2.5 flex items-center gap-2 border-b border-gray-800">
        <span className="text-lg">{zone.icon}</span>
        <span className="text-white font-semibold text-sm">{zone.title}</span>
      </div>

      {/* Product image */}
      <div className="relative h-40 overflow-hidden bg-gray-800">
        <AnimatePresence mode="wait">
          <motion.img
            key={current}
            src={p.image}
            alt={p.name}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </AnimatePresence>
        <div className="absolute top-2 left-2 rounded-full bg-amber-500 px-2 py-0.5 text-xs font-semibold text-black">
          {categories.find(c => c.id === p.category)?.name}
        </div>
      </div>

      {/* Product info */}
      <div className="p-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-amber-500 text-xs">{p.brand}</p>
            <h4 className="text-sm font-bold text-white mt-0.5 mb-2 truncate">{p.name}</h4>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">{p.driveType}</span>
              <span className="text-amber-500 font-semibold">{p.price}</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dot indicator */}
      <div className="flex justify-center gap-1 pb-3">
        {products.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all ${i === current ? 'w-4 bg-amber-500' : 'w-1.5 bg-gray-700'}`} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      <section className="bg-gray-950 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">产品中心</h2>
            <p className="text-gray-400 text-lg">五大品类 · 一站式采购</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-6xl mx-auto">
            {zones.map(zone => (
              <ZoneWindow key={zone.id} zone={zone} />
            ))}
          </div>
        </div>
      </section>

      <Advantages />
      <Contact />
    </>
  );
}
