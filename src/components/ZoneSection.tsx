'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Truck, zones, categories } from '@/data/trucks';

interface ZoneSectionProps {
  zone: typeof zones[0];
  trucks: Truck[];
}

function TruckCard({ truck, index }: { truck: Truck; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="min-w-[320px] flex-shrink-0 rounded-xl bg-gray-900 border border-gray-800 overflow-hidden group hover:border-amber-500/50 transition-all duration-300"
    >
      <div className="relative h-48 overflow-hidden bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
        <img
          src={truck.image}
          alt={truck.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute top-4 left-4 z-20 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-black">
          {categories.find(c => c.id === truck.category)?.name}
        </div>
        {truck.horsepower > 0 && (
          <div className="absolute top-4 right-4 z-20 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
            {truck.horsepower}HP
          </div>
        )}
      </div>

      <div className="p-5">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">
          {truck.name}
        </h3>
        <p className="text-amber-500 text-xs mb-3">{truck.brand}</p>
        <div className="space-y-1.5 mb-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">驱动</span>
            <span className="text-gray-300">{truck.driveType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">发动机</span>
            <span className="text-gray-300">{truck.engine}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">价格</span>
            <span className="text-amber-500 font-semibold">{truck.price}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-3">
          {truck.features.slice(0, 3).map((f, i) => (
            <span key={i} className="rounded-full bg-gray-800 px-2.5 py-1 text-xs text-gray-400">
              {f}
            </span>
          ))}
        </div>
        <a
          href="https://wa.me/8619103781257" target="_blank"
          className="block w-full rounded-md bg-amber-500/10 py-2.5 text-center text-amber-500 font-semibold text-sm transition-all hover:bg-amber-500 hover:text-black"
        >
          获取报价
        </a>
      </div>
    </motion.div>
  );
}

export default function ZoneSection({ zone, trucks }: ZoneSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = direction === 'left' ? -350 : 350;
      scrollRef.current.scrollBy({ left: amount, behavior: 'smooth' });
    }
  };

  if (trucks.length === 0) return null;

  return (
    <section id={zone.id} className="bg-gray-950 py-20">
      <div className="container mx-auto px-6">
        {/* Zone Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">{zone.icon}</span>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-3xl md:text-4xl font-bold text-white">{zone.title}</h2>
                <span className="text-sm text-gray-500 font-normal">{zone.titleEn}</span>
              </div>
              <p className="text-amber-500 text-sm mt-1">{zone.brand}</p>
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed">{zone.description}</p>
        </motion.div>

        {/* Product Slider */}
        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2.5 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto pb-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {trucks.map((truck, index) => (
              <TruckCard key={truck.id} truck={truck} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
