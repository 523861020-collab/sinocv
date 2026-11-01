'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Advantages from '@/components/Advantages';
import Contact from '@/components/Contact';
import QuickNav from '@/components/QuickNav';
import QuickInquiry from '@/components/QuickInquiry';
import PriceListCTA from '@/components/PriceListCTA';
import PriceEstimator from '@/components/PriceEstimator';
import { trucks, zones, categories, stockTrucks } from '@/data/trucks';
import { useLocale } from 'next-intl';
import { content } from '@/data/site-i18n';

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
  const zoneText = content(useLocale()).zones[zone.id as keyof ReturnType<typeof content>['zones']];
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
        <span className="text-white font-semibold text-sm">{zoneText?.title ?? zone.title}</span>
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
        <h4 className="text-base font-bold text-white leading-snug line-clamp-2 min-h-[2.75rem]">{p.name}</h4>
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
  const c = content(useLocale());
  return (
    <>
      <Hero />

      {/* 首屏之后：快速定位 + 快速询价，第一屏滑完立刻能看到（2026-11-01 留客改造） */}
      <QuickNav />
      <section className="bg-gray-950 px-4 py-4 md:px-6">
        <div className="mx-auto max-w-4xl">
          <QuickInquiry />
        </div>
      </section>

      {/* 报价包索取（留联系方式换清单）2026-11-01 */}
      <PriceListCTA />

      {stockTrucks.length > 0 && (
        <section id="promo" style={{paddingTop: '1.5rem', paddingBottom: '1.5rem'}} className="bg-gray-950">
          <div className="px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-1">{c.promo.title}</h2>
              <p className="text-gray-400 text-lg">{c.promo.sub}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stockTrucks.map(t => (
                <div key={t.id} className="rounded-xl bg-gray-900 border border-red-500/20 overflow-hidden group hover:border-red-500/50 transition-all">
                  <div className="relative h-52 overflow-hidden bg-gray-800 cursor-pointer" onClick={() => setLightbox(t.images || [t.image])}>
                    <img src={t.image} alt={t.name} className="h-full w-full object-cover" loading="lazy" />
                    <div className="absolute top-3 left-3 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white">{c.promo.hot}</div>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="text-base font-bold text-white">{t.name}</h3>
                    <a href="https://wa.me/8619103781257" target="_blank" className="mt-3 inline-block w-full rounded-md bg-red-500/10 py-2.5 text-center text-red-400 font-semibold text-sm transition-all hover:bg-red-500 hover:text-white">
                      {c.promo.cta}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section id="products" style={{paddingTop: '1.5rem', paddingBottom: '1.5rem'}} className="bg-gray-950">
        <div className="px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-1">{c.products.title}</h2>
            <p className="text-gray-400 text-lg">{c.products.sub}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {zones.map(zone => (
              <div key={zone.id} id={zone.id === 'heavy-truck' ? 'truck' : zone.id === 'machinery' ? 'machine' : zone.id === 'trailers' ? 'trailer' : zone.id === 'light' ? 'light' : zone.id}>
                <Link href={zone.id === 'heavy-truck' ? '/heavy-truck' : `/${zone.id}`}>
                  <ZoneWindow zone={zone} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Advantages />

      {/* 到港价计算器（留 WhatsApp 换精确报价）2026-11-01 */}
      <PriceEstimator />

      <section style={{paddingTop: '1.5rem', paddingBottom: '1.5rem'}} className="bg-black">
        <div style={{textAlign: 'center', padding: '0 1.5rem'}}>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">{c.about.title}</h2>
          {/* v20260710-1: manager photo directly below */}
          <div className="mb-8 flex justify-center">
            <img src="/images/manager.webp" alt="Li Shanlong" className="w-56 h-56 rounded-full object-cover border-2 border-amber-500/40" />
          </div>
          <h4 className="text-white font-bold text-5xl mb-3">Li Shanlong</h4>
          <p className="text-amber-400 text-xl font-medium mb-6">General Manager</p>
          <div className="flex flex-wrap justify-center gap-3 text-base text-gray-400 mb-12">
            <span>📧 <bdi>lishanlong@sinocv.com</bdi></span>
            <span>📱 <bdi>+86 13001977959</bdi></span>
            <a href="https://wa.me/8619103781257" target="_blank" className="text-green-400 hover:text-green-300">💬 WhatsApp</a>
          </div>
          <h3 className="text-3xl font-bold text-white mb-6">{c.about.h3}</h3>
          {/* 2026-11-01 修：这段正文原来继承了外层的 text-align:center，
              几十个词的长段落被居中排，每行首尾参差，眼睛找不到下一行起点。
              正文一律左对齐并限宽到阅读舒适宽度（约 70 字符/行）。 */}
          <div className="mx-auto max-w-3xl text-left">
            <p className="text-gray-300 leading-relaxed text-base mb-4">
              {c.about.p1}</p>
            <p className="text-gray-300 leading-relaxed text-base mb-6">
              {c.about.p2}</p>
            <p className="mb-12 border-s-2 border-amber-500/60 ps-4 text-base not-italic leading-relaxed text-gray-300">
              🎯 <span className="text-amber-400 font-medium">{c.about.missionLabel}</span> {c.about.mission}
            </p>
          </div>
          <h3 className="text-2xl font-bold text-white mb-8">Certifications</h3>
          <div className="flex justify-center gap-6">
            <a href="/images/cert-hk-1.webp" target="_blank" className="rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/40 block" style={{width: '45%', maxWidth: '300px'}}>
              <img src="/images/cert-hk-1.webp" alt="Hong Kong Certificate of Incorporation" className="w-full bg-white object-cover object-center" style={{aspectRatio: "1 / 1.35"}} loading="lazy" />
              <div className="px-3 py-2 text-xs text-gray-500">Hong Kong Certificate of Incorporation</div>
            </a>
            <a href="/images/cert-hk-2.webp" target="_blank" className="rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/40 block" style={{width: '45%', maxWidth: '300px'}}>
              <img src="/images/cert-hk-2.webp" alt="Hong Kong Business Registration Certificate" className="w-full bg-white object-cover object-center" style={{aspectRatio: "1 / 1.35"}} loading="lazy" />
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
