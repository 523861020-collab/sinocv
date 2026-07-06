'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Advantages from '@/components/Advantages';
import Contact from '@/components/Contact';
import { trucks, zones, categories } from '@/data/trucks';

function ProductCard({ truck, index }: { truck: typeof trucks[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="min-w-[300px] flex-shrink-0 rounded-xl bg-gray-900 border border-gray-800 overflow-hidden group hover:border-amber-500/50 transition-all duration-300"
    >
      <div className="relative h-44 overflow-hidden bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
        <img src={truck.image} alt={truck.name} className="h-full w-full object-cover" />
        <div className="absolute top-3 left-3 z-20 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-black">
          {categories.find(c => c.id === truck.category)?.name}
        </div>
        {truck.horsepower > 0 && (
          <div className="absolute top-3 right-3 z-20 rounded-full bg-white/20 backdrop-blur-sm px-2.5 py-0.5 text-xs font-semibold text-white">
            {truck.horsepower}HP
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-base font-bold text-white mb-0.5 group-hover:text-amber-500 transition-colors">{truck.name}</h3>
        <p className="text-amber-500 text-xs mb-2">{truck.brand}</p>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-500">价格</span>
          <span className="text-amber-500 font-semibold">{truck.price}</span>
        </div>
        <a href="/#contact" className="block w-full rounded-md bg-amber-500/10 py-2 text-center text-amber-500 font-semibold text-xs transition-all hover:bg-amber-500 hover:text-black">
          获取报价
        </a>
      </div>
    </motion.div>
  );
}

function ZoneRow({ zone, index }: { zone: typeof zones[0]; index: number }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const zoneTrucks = trucks.filter(t => zone.categories.includes(t.category));

  const scroll = (dir: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir === 'left' ? -330 : 330, behavior: 'smooth' });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="py-16 border-b border-gray-800 last:border-0"
    >
      <div className="container mx-auto px-6">
        {/* Section header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">{zone.title}</h2>
            <p className="text-amber-500 text-sm">{zone.brand}</p>
          </div>
          <Link
            href={`/${zone.id === 'heavy-truck' ? 'heavy-truck' : zone.id}`}
            className="text-amber-500 hover:text-amber-400 text-sm font-semibold transition-colors shrink-0"
          >
            查看全部 →
          </Link>
        </div>

        {/* Product slider */}
        <div className="relative">
          <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors">
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto pb-2" style={{ scrollbarWidth: 'none' }}>
            {zoneTrucks.map((truck, i) => (
              <ProductCard key={truck.id} truck={truck} index={i} />
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}

export default function Home() {
  return (
    <>
      <Hero />

      {/* Product Zones - vertical stack */}
      <div className="bg-gray-950">
        <div className="container mx-auto px-6 pt-20 pb-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-4"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">产品中心</h2>
            <p className="text-gray-400 text-lg">选择品类，查看详细产品</p>
          </motion.div>
        </div>

        {zones.map((zone, i) => (
          <ZoneRow key={zone.id} zone={zone} index={i} />
        ))}
      </div>

      <Advantages />
      <Contact />
    </>
  );
}
