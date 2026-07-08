'use client';

import { motion } from 'framer-motion';
import { Truck, categories } from '@/data/trucks';

interface ZonePageProps {
  title: string;
  titleEn: string;
  icon: string;
  brand: string;
  description: string;
  trucks: Truck[];
  bannerImage: string;
}

function ProductCard({ truck, index }: { truck: Truck; index: number }) {
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
        <img src={truck.image} alt={truck.name} className="h-full w-full object-cover" />
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
            <span className="text-gray-500">驱动</span>
            <span className="text-gray-300">{truck.driveType}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">发动机</span>
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
          获取报价
        </a>
      </div>
    </motion.div>
  );
}

export default function ZonePage({ title, titleEn, icon, brand, trucks, bannerImage }: ZonePageProps) {
  const grouped = new Map<string, Truck[]>();
  for (const t of trucks) {
    const cat = t.category;
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(t);
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Spacer for fixed navbar */}
      <div className="h-20" />
      {/* Banner with Title Overlay */}
      <div className="relative h-48 md:h-56 overflow-hidden bg-gray-900">
        <div
          className="h-full w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${bannerImage})` }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-1">{title}</h1>
            <p className="text-white/50 text-xs mb-1">{titleEn}</p>
            <p className="text-amber-400 text-sm">{brand}</p>
          </div>
        </div>
      </div>

      {/* Products grouped by sub-category */}
      {Array.from(grouped.entries()).map(([catId, catTrucks]) => {
        const cat = categories.find(c => c.id === catId);
        return (
          <section key={catId} className="py-16">
            <div className="px-6 lg:px-16 max-w-[1920px] mx-auto">
              <div className="max-w-6xl mx-auto w-full">
              <div className="flex items-center gap-3 mb-10">
                <span className="text-3xl">{cat?.icon}</span>
                <h2 className="text-2xl font-bold text-white">{cat?.name}</h2>
                <span className="text-gray-500 text-sm">{cat?.nameEn}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {catTrucks.map((truck, i) => (
                  <ProductCard key={truck.id} truck={truck} index={i} />
                ))}
              </div>
            </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}
