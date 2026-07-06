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
      {/* Zone label */}
      <div className="bg-gray-800/50 px-4 py-2.5 flex items-center gap-2 border-b border-gray-800">
        <span className="text-lg">{zone.icon}</span>
        <span className="text-white font-semibold text-sm">{zone.title}</span>
      </div>

      {/* Product image */}
      <div className="relative h-52 overflow-hidden bg-gray-800">
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
        <div className="absolute top-3 left-3 rounded-full bg-amber-500 px-2.5 py-0.5 text-xs font-semibold text-black">
          {categories.find(c => c.id === p.category)?.name}
        </div>
      </div>

      {/* Product info */}
      <div className="p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
          >
            <p className="text-amber-500 text-xs">{p.brand}</p>
            <h4 className="text-base font-bold text-white mt-0.5 mb-2 truncate">{p.name}</h4>
            <span className="text-gray-500 text-sm">{p.driveType}</span>
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

      {/* 促销车 */}
      {stockTrucks.length > 0 && (
        <section className="bg-gray-950 py-16">
          <div className="container mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">促销车</h2>
              <p className="text-gray-400 text-lg">库存现车 · 即付即发 · 无需等待生产周期</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stockTrucks.map(t => (
                <div key={t.id} className="rounded-xl bg-gray-900 border border-red-500/20 overflow-hidden group hover:border-red-500/50 transition-all">
                  <div className="relative h-52 overflow-hidden bg-gray-800">
                    <img src={t.image} alt={t.name} className="h-full w-full object-cover" />
                    <div className="absolute top-3 left-3 rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-semibold text-white">
                      促销
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-base font-bold text-white mb-1">{t.name}</h3>
                    <p className="text-amber-500 text-xs mb-3">{t.brand} · {t.engine}</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {t.features.map((f, i) => <span key={i} className="rounded-full bg-gray-800 px-2.5 py-1 text-xs text-gray-400">{f}</span>)}
                    </div>
                    <a href="/#contact" className="block w-full rounded-md bg-red-500/10 py-2.5 text-center text-red-400 font-semibold text-sm transition-all hover:bg-red-500 hover:text-white">
                      立即咨询 →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-gray-950 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">产品中心</h2>
            <p className="text-gray-400 text-lg">五大品类 · 一站式采购</p>
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

      {/* 公司信息 */}
      <section className="bg-black py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">关于我们</h2>
          </div>

          {/* Row 1: Manager + Company Info */}
          <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10 items-stretch">
            {/* Manager — premium card, fills column height */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-900 to-amber-950/30 border border-gray-800 h-full">
              {/* subtle glow */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/5 rounded-full blur-3xl" />
              <div className="relative p-10 h-full flex flex-col items-center text-center justify-center">
                {/* photo with ring glow */}
                <div className="relative mb-8">
                  <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl scale-110" />
                  <img src="/images/manager.jpg" alt="李善龙" className="relative w-48 h-48 rounded-full object-cover border-4 border-amber-500/40 shadow-2xl shadow-amber-500/10" />
                </div>
                <h4 className="text-white font-bold text-3xl mb-2">李善龙</h4>
                <p className="text-amber-400 text-base font-medium mb-10">总经理 · General Manager</p>
                
                {/* contact pills */}
                <div className="space-y-4 w-full max-w-xs">
                  <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-gray-800/60 text-base text-gray-300 hover:bg-gray-800 transition-colors">
                    <span className="text-xl">📧</span>
                    <span className="truncate">lishanlong@sinocv.com</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-gray-800/60 text-base text-gray-300 hover:bg-gray-800 transition-colors">
                    <span className="text-xl">📱</span>
                    <span>+86 13001977959</span>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-4 rounded-xl bg-gray-800/60 text-base text-gray-300 hover:bg-gray-800 transition-colors">
                    <span className="text-xl">💬</span>
                    <span>微信: sinocv</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Company + Factory + Mission — three cards */}
            <div className="space-y-5">
              {/* 公司介绍 */}
              <div className="rounded-2xl bg-gray-900 border border-gray-800 p-10 hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl shrink-0">🏢</div>
                  <h3 className="text-xl font-bold text-white">公司介绍</h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-base">
                  SINOCV 是一家专业从事中国商用车及工程机械出口的贸易公司，总部位于香港。公司与多家中国顶级制造商建立了长期稳定的合作关系，致力于为全球客户提供高品质的重卡、工程机械、挂车及轻型商用车一站式采购服务。
                </p>
              </div>

              {/* 合作工厂 */}
              <div className="rounded-2xl bg-gray-900 border border-gray-800 p-10 hover:border-gray-700 transition-colors">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-2xl shrink-0">🏭</div>
                  <h3 className="text-xl font-bold text-white">合作工厂</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { name: '中国重汽', sub: 'SINOTRUK' },
                    { name: '徐工集团', sub: 'XCMG' },
                    { name: '中集车辆', sub: 'CIMC' },
                    { name: '福田汽车', sub: 'FOTON' },
                  ].map(f => (
                    <div key={f.name} className="rounded-xl border border-gray-800 bg-gray-800/40 py-5 px-4 text-center hover:border-amber-500/30 hover:bg-gray-800/70 transition-all">
                      <div className="text-white font-semibold text-base">{f.name}</div>
                      <div className="text-gray-500 text-sm mt-1">{f.sub}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 公司宗旨 */}
              <div className="rounded-2xl bg-gradient-to-r from-amber-500/5 to-transparent border border-amber-500/20 p-10">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center text-2xl shrink-0">🎯</div>
                  <h3 className="text-xl font-bold text-white">公司宗旨</h3>
                </div>
                <p className="text-gray-300 leading-relaxed text-lg italic">
                  "以客户需求为导向，以品质服务为根本，为全球客户提供最优质的中国制造商用车及工程机械产品，成为值得信赖的长期合作伙伴。"
                </p>
              </div>
            </div>
          </div>

          {/* Row 2: Certificates + Physical presence */}
          <div className="max-w-6xl mx-auto space-y-8">
            <h3 className="text-lg font-bold text-white text-center">企业资质</h3>

            {/* 国内展厅 — wide banner */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2 justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 国内展厅
              </h4>
              <a href="/images/4s-store.jpg" target="_blank" className="block rounded-2xl overflow-hidden border border-gray-800 hover:border-amber-500/40 transition-all">
                <img src="/images/4s-store.jpg" alt="国内展厅" className="w-full h-auto max-h-96 object-cover" />
              </a>
            </div>

            {/* 三证 — 3-column grid */}
            <div>
              <h4 className="text-sm font-semibold text-gray-400 mb-3 flex items-center gap-2 justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 资质证书
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <a href="/images/cert-hk-1.jpg" target="_blank" className="rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/40 transition-all block bg-gray-900">
                  <img src="/images/cert-hk-1.jpg" alt="香港公司注册证明书" className="w-full h-auto" />
                  <div className="px-3 py-2 text-center text-xs text-gray-500">香港公司注册证明书</div>
                </a>
                <a href="/images/cert-hk-2.jpg" target="_blank" className="rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/40 transition-all block bg-gray-900">
                  <img src="/images/cert-hk-2.jpg" alt="香港商业登记证" className="w-full h-auto" />
                  <div className="px-3 py-2 text-center text-xs text-gray-500">香港商业登记证</div>
                </a>
                <a href="/images/license-cn.jpg" target="_blank" className="rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/40 transition-all block bg-gray-900">
                  <img src="/images/license-cn.jpg" alt="国内营业执照" className="w-full h-auto" />
                  <div className="px-3 py-2 text-center text-xs text-gray-500">国内营业执照</div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}
