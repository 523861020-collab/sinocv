'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Advantages from '@/components/Advantages';
import Contact from '@/components/Contact';
import { trucks, zones, categories, stockTrucks } from '@/data/trucks';

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
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div key={current}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-amber-500 text-xs">{p.brand}</p>
            <h4 className="text-base font-bold text-white mt-0.5 mb-2 truncate">{p.name}</h4>
            <span className="text-gray-500 text-sm">{p.driveType}</span>
          </motion.div>
        </AnimatePresence>
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
                  <div className="relative h-52 overflow-hidden bg-gray-800">
                    <img src={t.image} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute top-3 left-3 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white">Hot</div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-white mb-1">{t.name}</h3>
                    <p className="text-amber-500 text-xs mb-3">{t.brand} · {t.engine}</p>
                    <div className="flex flex-wrap gap-2 mb-12">
                      {t.features.map((f, i) => <span key={i} className="rounded-full bg-gray-800 px-2.5 py-1 text-xs text-gray-400">{f}</span>)}
                    </div>
                    <a href="https://wa.me/8619103781257" target="_blank" className="block w-full rounded-md bg-red-500/10 py-2.5 text-center text-red-400 font-semibold text-sm transition-all hover:bg-red-500 hover:text-white">
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
        <div className="px-6">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">About Us</h2>
            <div className="flex flex-col items-center">
              <div className="relative mb-8">
                <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-2xl scale-110" />
                <img src="/images/manager.jpg" alt="李善龙" className="relative w-56 h-56 rounded-full object-cover border-4 border-amber-500/40 shadow-2xl" />
              </div>
              <h4 className="text-white font-bold text-5xl mb-3">李善龙</h4>
              <p className="text-amber-400 text-xl font-medium mb-6">General Manager</p>
              <div className="flex flex-wrap justify-center gap-3 text-base text-gray-400">
                <span>📧 lishanlong@sinocv.com</span>
                <span className="text-gray-700">|</span>
                <span>📱 +86 13001977959</span>
                <span className="text-gray-700">|</span>
                <a href="https://wa.me/8619103781257" target="_blank" className="text-green-400 hover:text-green-300 transition-colors">💬 WhatsApp: +86 19103781257</a>
              </div>
            </div>
            <h3 style={{marginTop: '2rem'}} className="text-3xl font-bold text-white mb-6">🏢 About SINOCV</h3>
            <p className="text-gray-300 leading-relaxed text-base text-left">
              <span className="text-amber-400 font-semibold">SINOCV</span> is a Hong Kong-based professional commercial vehicle and construction machinery export company, providing full-chain export services from vehicle selection, customization, inspection, logistics, to customs clearance.
            </p>
            <p className="text-gray-300 leading-relaxed text-base text-left">
              We have established long-term strategic partnerships with <span className="text-white font-medium">SINOTRUK, XCMG, CIMC, and Foton</span>, ensuring every vehicle delivered is factory-original with full warranty and after-sales support.
            </p>
            <p className="text-gray-300 leading-relaxed text-base text-left">
              Our product range covers the full lineup of commercial vehicles including tractor trucks, cargo trucks, dump trucks, mixer trucks, reefer trucks, water trucks, garbage trucks, crane trucks, and aerial work platforms, as well as construction machinery such as excavators, loaders, and mining dump trucks, plus trailers, vans, and mini trucks.
            </p>
            <p className="text-gray-300 leading-relaxed text-base text-left">
              Leveraging Hong Kong's international platform and mainland China's supply chain advantages, SINOCV has successfully exported to over 30 countries and regions across Africa, the Middle East, Southeast Asia, and Central Asia, earning widespread trust from overseas customers.
            </p>
            <p className="mt-12 pt-8 border-t border-gray-800/50 text-gray-400 italic text-base text-left">
              🎯 <span className="text-amber-400 font-medium">Our Mission:</span> Customer-focused, quality-driven — to provide the finest Chinese commercial vehicles and construction machinery to global customers and become a trusted long-term partner.
            </p>
            <h3 style={{marginTop: '2rem'}} className="text-2xl font-bold text-white mb-8">Certifications</h3>
            <div className="flex flex-wrap justify-center gap-6">
              <a href="/images/cert-hk-1.jpg" target="_blank" className="rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/40 transition-all block bg-gray-900 w-full max-w-sm">
                <img src="/images/cert-hk-1.jpg" alt="Certificate" className="w-full h-auto" />
                <div className="px-3 py-2 text-center text-xs text-gray-500">Hong Kong Certificate of Incorporation</div>
              </a>
              <a href="/images/cert-hk-2.jpg" target="_blank" className="rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/40 transition-all block bg-gray-900 w-full max-w-sm">
                <img src="/images/cert-hk-2.jpg" alt="Certificate" className="w-full h-auto" />
                <div className="px-3 py-2 text-center text-xs text-gray-500">Hong Kong Business Registration</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}
