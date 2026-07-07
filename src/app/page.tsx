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
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-16">关于我们</h2>
            {/* Manager */}
            <div className="flex flex-col items-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-2xl scale-110" />
                <img src="/images/manager.jpg" alt="李善龙" className="relative w-56 h-56 rounded-full object-cover border-4 border-amber-500/40 shadow-2xl" />
              </div>
              <h4 className="text-white font-bold text-5xl mb-2">李善龙</h4>
              <p className="text-amber-400 text-xl font-medium mb-4">总经理 · General Manager</p>
              <div className="flex flex-wrap justify-center gap-3 text-base text-gray-400 mb-10">
                <span>📧 lishanlong@sinocv.com</span>
                <span className="text-gray-700">|</span>
                <span>📱 +86 13001977959</span>
                <span className="text-gray-700">|</span>
                <span>💬 微信: 13001977959</span>
              </div>
            </div>
            
            {/* Company intro — right below manager */}
            <h3 className="text-3xl font-bold text-white mt-8 mb-8">🏢 关于 SINOCV</h3>
            <p className="text-gray-300 leading-relaxed text-base mb-4">
              <span className="text-amber-400 font-semibold">SINOCV</span> 是一家总部位于香港的专业商用车及工程机械出口贸易公司，为全球客户提供从选型、定制、验车、物流到清关的全链条出口服务。
            </p>
            <p className="text-gray-300 leading-relaxed text-base mb-4">
              公司与<span className="text-white font-medium">中国重汽（SINOTRUK）、徐工集团（XCMG）、中集车辆（CIMC）、福田汽车（Foton）</span>等国内一线品牌建立了长期稳定的战略合作关系，确保每一台车辆均为原厂正品。
            </p>
            <p className="text-gray-300 leading-relaxed text-base mb-4">
              产品覆盖牵引车、载货车、自卸车、搅拌车、冷藏车、洒水车、垃圾运输车、随车吊、高空作业车等全系列商用车，以及挖掘机、装载机、矿用宽体自卸车、平板挂车、自卸挂车、Van封闭货车、微卡等多元化产品。
            </p>
            <p className="text-gray-300 leading-relaxed text-base mb-4">
              凭借香港的国际化平台和内地供应链优势，已成功出口至非洲、中东、东南亚及中亚等 30 多个国家和地区，赢得了海外客户的广泛信赖。
            </p>
            <p className="mt-8 pt-6 border-t border-gray-800/50 text-gray-400 italic text-base">
              🎯 <span className="text-amber-400 font-medium">公司宗旨：</span>
              以客户需求为导向，以品质服务为根本，成为全球客户值得信赖的长期合作伙伴。
            </p>
          </div>

          {/* Row 3: HK Certificates — centered */}
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-6">企业资质</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <a href="/images/cert-hk-1.jpg" target="_blank" className="rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/40 transition-all block bg-gray-900">
                <img src="/images/cert-hk-1.jpg" alt="香港公司注册证明书" className="w-full h-auto" />
                <div className="px-3 py-2 text-center text-xs text-gray-500">香港公司注册证明书</div>
              </a>
              <a href="/images/cert-hk-2.jpg" target="_blank" className="rounded-xl overflow-hidden border border-gray-800 hover:border-amber-500/40 transition-all block bg-gray-900">
                <img src="/images/cert-hk-2.jpg" alt="香港商业登记证" className="w-full h-auto" />
                <div className="px-3 py-2 text-center text-xs text-gray-500">香港商业登记证</div>
              </a>
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}
