[toolu_bdrk_014R2SpCu...] 'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { trucks as allTrucks, categories, zones } from '@/data/trucks';
import type { Truck } from '@/data/trucks';

function ProductCard({ truck, index }: { truck: Truck; index: number }) {
  const allImages = truck.images && truck.images.length > 0 ? truck.images : [truck.image];
  const [imgIdx, setImgIdx] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden group hover:border-amber-500/50 transition-all duration-300"
    >
      <div className="relative h-52 overflow-hidden bg-gray-800">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
        <img src={allImages[imgIdx]} alt={truck.name} className="h-full w-full object-cover" />
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => { e.preventDefault(); setImgIdx(i => (i - 1 + allImages.length) % allImages.length); }}
              className="absolute left-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >◀</button>
            <button
              onClick={(e) => { e.preventDefault(); setImgIdx(i => (i + 1) % allImages.length); }}
              className="absolute right-2 top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
            >▶</button>
            <div className="absolute bottom-2 left-1/2 z-20 flex -translate-x-1/2 gap-1">
              {allImages.map((_, i) => (
                <div key={i} className={`h-1.5 w-1.5 rounded-full ${i === imgIdx ? 'bg-amber-500' : 'bg-white/50'}`} />
              ))}
            </div>
          </>
        )}
        <div className="absolute top-4 left-4 z-20 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-black">
          {categories.find(c => c.id === truck.category)?.name}
        </div>
        {truck.horsepower > 0 && (
          <div className="absolute top-4 right-4 z-20 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
            {truck.horsepower}HP
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-lg font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">
          {truck.name}
        </h3>
        <p className="text-amber-500 text-xs mb-3">{truck.brand}</p>
        <div className="space-y-1.5 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Drive</span>
            <span className="text-gray-300">{truck.driveType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Engine</span>
            <span className="text-gray-300">{truck.engine}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {truck.features.slice(0, 3).map((f, i) => (
            <span key={i} className="rounded-full bg-gray-800 px-2.5 py-1 text-xs text-gray-400">{f}</span>
          ))}
        </div>
        <a
          href="https://wa.me/8619103781257" target="_blank"
          className="block w-full rounded-md bg-amber-500/10 py-2.5 text-center text-amber-500 font-semibold text-sm transition-all hover:bg-amber-500 hover:text-black"
        >
          Get Quote
        </a>
      </div>
    </motion.div>
  );
}

export default function ZonePage({
  title, titleEn, icon, brand, description, trucks, bannerImage
}: {
  title: string; titleEn: string; icon: string; brand: string; description: string;
  trucks: Truck[]; bannerImage: string;
}) {
  const grouped = new Map<string, Truck[]>();
  for (const t of trucks) {
    const list = grouped.get(t.category) || [];
    list.push(t);
    grouped.set(t.category, list);
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="relative h-48 md:h-56 overflow-hidden bg-gray-900">
        <div className="h-full w-full bg-cover bg-center" style={{ backgroundImage: `url(${bannerImage})` }} />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{title}</h1>
            <p className="text-white/50 text-xs mb-1">{titleEn}</p>
            <p className="text-amber-400 text-sm">{brand}</p>
          </div>
        </div>
      </div>

      {Array.from(grouped.entries()).map(([catId, catTrucks]) => {
        const cat = categories.find(c => c.id === catId);
        return (
          <section key={catId} className="py-16">
            <div className="px-6">
              <div className="flex items-center gap-3 mb-10">
                <span className="text-3xl">{cat?.icon}</span>
                <h2 className="text-2xl font-bold text-white">{cat?.name}</h2>
                <span className="text-gray-500 text-sm">{cat?.nameEn}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {catTrucks.map((truck, i) => (
                  <ProductCard key={truck.id} truck={truck} index={i} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
