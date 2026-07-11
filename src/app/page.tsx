'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Advantages from '@/components/Advantages';
import Contact from '@/components/Contact';
import { trucks, zones, categories, stockTrucks } from '@/data/trucks';

function Lightbox({ images, onClose }: { images: string[]; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex flex-col items-center justify-center" onClick={onClose} style={{background: 'transparent'}}>
      <button onClick={e => { e.stopPropagation(); onClose(); }} className="absolute top-4 right-6 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 text-xl">✕</button>
      <img src={images[idx]} alt="" className="max-h-[75vh] max-w-[90vw] object-contain rounded-lg shadow-2xl" onClick={e => e.stopPropagation()} />
      {images.length > 1 && (
        <div className="mt-4 flex items-center gap-4 z-50">
          <button onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + images.length) % images.length); }} className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/30 text-lg">◀ Prev</button>
          <div className="flex gap-2">{images.map((_, i) => <div key={i} className={`h-2 w-2 rounded-full ${i === idx ? 'bg-amber-500' : 'bg-white/40'}`} />)}</div>
          <button onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % images.length); }} className="rounded-full bg-white/10 px-4 py-2 text-white hover:bg-white/30 text-lg">Next ▶</button>
        </div>
      )}
    </motion.div>
  );
}

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
      <div className="bg-gray-800/50 px-4 py-2.5 flex items-center gap-2 border-b border-gray-800">
        <span className="text-lg">{zone.icon}</span>
        <span className="text-white font-semibold text-sm">{zone.title}</span>
      </div>
      <div className="relative h-52 overflow-hidden bg-gray-800">
        <AnimatePresence mode="wait">
          <motion.img key={current} src={p.image} alt={p.name}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 h-full w-full object-cover" loading="lazy"
          />
        </AnimatePresence>
        <div className="absolute top-3 left-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-black">
          {categories.find(c => c.id === p.category)?.name}
        </div>
      </div>
      <div className="p-4 text-center">
        <h4 className="text-base font-bold text-white truncate">{p.name}</h4>
      </div>
      <div className="flex justify-center gap-1 pb-3">
        {products.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all ${i === current ? 'w-4 bg-amber-500' : 'w-1.5 bg-gray-700'}`} />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const [lightbox, setLightbox] = useState<string[] | null>(null);
  return (
    <>
      <Hero />

      {stockTrucks.length > 0 && (
        <section style={{paddingTop: '1.5rem', paddingBottom: '1.5rem'}} className="bg-gray-950">
          <div className="px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-1">Promotions</h2>
              <p className="text-gray-400 text-lg">In-Stock · Ready to Ship · No Production Wait</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stockTrucks.map(t => (
                <div key={t.id} className="rounded-xl bg-gray-900 border border-red-500/20 overflow-hidden group hover:border-red-500/50 transition-all">
                  <div className="relative h-52 overflow-hidden bg-gray-800 cursor-pointer" onClick={() => setLightbox(t.images || [t.image])}>
                    <img src={t.image} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute top-3 left-3 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white">Hot</div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-base font-bold text-white">{t.name}</h3>
                    <a href="https://wa.me/8619103781257" target="_blank" className="mt-3 inline-block w-full rounded-md bg-red-500/10 py-2.5 text-center text-red-400 font-semibold text-sm transition-all hover:bg-red-500 hover:text-white">
                      Inquire Now →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section style={{paddingTop: '1.5rem', paddingBottom: '1.5rem'}} className="bg-gray-950">
        <div className="px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-1">Products</h2>
            <p className="text-gray-400 text-lg">5 Categories · One-Stop Sourcing</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {zones.map(zone => (
              <Link key={zone.id} href={zone.id === 'heavy-truck' ? '/heavy-truck' : `/${zone.id}`}>
                <ZoneWindow zone={zone} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Advantages />

      <section style={{paddingTop: '1.5rem', paddingBottom: '1.5rem'}} className="bg-black">
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '768px', margin: '0 auto', padding: '0 1.5rem'}}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">About Us</h2>
          {/* v20260710-1: manager photo directly below */}
          <div className="mb-8">
            <img src="/images/manager.jpg" alt="Li Shanlong" className="w-56 h-56 rounded-full object-cover border-2 border-amber-500/40 mx-auto" />
          </div>
          <h4 className="text-white font-bold text-5xl mb-3">Li Shanlong</h4>
          <p className="text-amber-400 text-xl font-medium mb-6">General Manager</p>
          <div className="flex flex-wrap justify-center gap-3 text-base text-gray-400 mb-12">
            <span>📧 lishanlong@sinocv.com</span>
            <span>📱 +86 13001977959</span>
            <a href="https://wa.me/8619103781257" target="_blank" className="text-green-400 hover:text-green-300">💬 WhatsApp</a>
          </div>
          <h3 className="text-3xl font-bold text-white mb-6">About XINYUNTONG CHINA</h3>
          <p className="text-gray-300 leading-relaxed text-base mb-4">
            <span className="text-amber-400 font-semibold">Xin Yuntong China Limited</span> is dedicated to providing superior services to global truck users. As a professional commercial vehicle export enterprise, we specialize in exporting Chinese heavy-duty trucks and construction machinery. Backed by a comprehensive supply chain and complete export qualifications, we deliver high-quality, smart manufacturing from China to the world.
          </p>
          <p className="text-gray-300 leading-relaxed text-base mb-6">
            We offer not only one-stop procurement services covering complete vehicles and spare parts but also a robust after-sales support system, ensuring a hassle-free, efficient, and seamless cross-border purchasing experience for every client.
          </p>
          <p className="text-gray-400 italic text-base mb-12">
            🎯 <span className="text-amber-400 font-medium">Our Mission:</span> Customer-focused, quality-driven — to provide the finest Chinese commercial vehicles and construction machinery to global customers and become a trusted long-term partner.
          </p>
          <h3 className="text-2xl font-bold text-white mb-8">Certifications</h3>
          <div className="flex justify-center gap-6">
            <a href="/images/cert-hk-1.jpg" target="_blank" className="rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/40 block" style={{width: '45%', maxWidth: '300px'}}>
              <img src="/images/cert-hk-1.jpg" alt="Certificate" className="w-full" />
              <div className="px-3 py-2 text-xs text-gray-500">Hong Kong Certificate of Incorporation</div>
            </a>
            <a href="/images/cert-hk-2.jpg" target="_blank" className="rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/40 block" style={{width: '45%', maxWidth: '300px'}}>
              <img src="/images/cert-hk-2.jpg" alt="Certificate" className="w-full" />
              <div className="px-3 py-2 text-xs text-gray-500">Hong Kong Business Registration</div>
            </a>
          </div>
        </div>
      </section>

      <Contact />
      <AnimatePresence>{lightbox && <Lightbox images={lightbox} onClose={() => setLightbox(null)} />}</AnimatePresence>
    </>
  );
}
