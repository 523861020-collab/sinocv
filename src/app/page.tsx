'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Advantages from '@/components/Advantages';
import Contact from '@/components/Contact';
import { trucks, zones, categories } from '@/data/trucks';

const allProducts = zones.flatMap(zone =>
  trucks
    .filter(t => zone.categories.includes(t.category))
    .map(t => ({ ...t, zoneId: zone.id, zoneTitle: zone.title, zoneHref: zone.id === 'heavy-truck' ? '/heavy-truck' : `/${zone.id}` }))
);

const PER_PAGE = 3;
const totalPages = Math.ceil(allProducts.length / PER_PAGE);

function ProductCard({ product }: { product: typeof allProducts[0] }) {
  return (
    <div className="rounded-xl bg-gray-900 border border-gray-800 overflow-hidden group hover:border-amber-500/50 transition-all duration-300">
      <div className="relative h-48 overflow-hidden bg-gray-800">
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
        <h3 className="text-base font-bold text-white mb-2 group-hover:text-amber-500 transition-colors">{product.name}</h3>
        <div className="flex justify-between text-sm mb-3">
          <span className="text-gray-500">{product.driveType}</span>
          <span className="text-amber-500 font-semibold">{product.price}</span>
        </div>
        <Link
          href={product.zoneHref}
          className="block w-full rounded-md bg-amber-500/10 py-2 text-center text-amber-500 text-xs font-semibold transition-all hover:bg-amber-500 hover:text-black"
        >
          查看详情
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const [page, setPage] = useState(0);
  const [dir, setDir] = useState(1);

  const goTo = useCallback((i: number) => {
    setDir(i > page ? 1 : -1);
    setPage(i);
  }, [page]);

  useEffect(() => {
    const t = setInterval(() => {
      setDir(1);
      setPage(p => (p + 1) % totalPages);
    }, 5000);
    return () => clearInterval(t);
  }, []);

  const currentProducts = allProducts.slice(page * PER_PAGE, (page + 1) * PER_PAGE);

  return (
    <>
      <Hero />

      <section className="bg-gray-950 py-20">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">产品中心</h2>
            <p className="text-gray-400 text-lg">五大品类 · {allProducts.length}款产品 · 一站式采购</p>
          </motion.div>

          <div className="max-w-5xl mx-auto">
            <AnimatePresence mode="wait" custom={dir}>
              <motion.div
                key={page}
                custom={dir}
                initial={{ opacity: 0, x: dir * 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: dir * -50 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6"
              >
                {currentProducts.map(p => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </motion.div>
            </AnimatePresence>

            {/* Dots + Counter */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <button onClick={() => goTo((page - 1 + totalPages) % totalPages)} className="text-gray-500 hover:text-white text-sm">←</button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`h-1.5 rounded-full transition-all ${i === page ? 'w-8 bg-amber-500' : 'w-3 bg-gray-700'}`}
                />
              ))}
              <button onClick={() => goTo((page + 1) % totalPages)} className="text-gray-500 hover:text-white text-sm">→</button>
              <span className="text-gray-600 text-xs ml-2">{page + 1}/{totalPages}</span>
            </div>

            {/* Zone quick links */}
            <div className="flex flex-wrap justify-center gap-3 mt-12">
              {zones.map(zone => (
                <Link
                  key={zone.id}
                  href={zone.id === 'heavy-truck' ? '/heavy-truck' : `/${zone.id}`}
                  className="rounded-full border border-gray-700 px-5 py-2 text-sm text-gray-400 hover:border-amber-500 hover:text-amber-500 transition-colors"
                >
                  {zone.icon} {zone.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Advantages />
      <Contact />
    </>
  );
}
