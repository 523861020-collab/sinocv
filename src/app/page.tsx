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
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">公司资质</h2>
            <p className="text-gray-400 text-lg">正规注册 · 诚信经营 · 值得信赖</p>
          </div>

          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-2xl bg-gray-900 border border-gray-800 p-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🏢</span> 公司信息
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500">公司名称</span>
                  <span className="text-gray-300">[贵公司全称]</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500">注册地址</span>
                  <span className="text-gray-300">[公司注册地址]</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500">统一社会信用代码</span>
                  <span className="text-gray-300">[统一社会信用代码]</span>
                </div>
                <div className="flex justify-between border-b border-gray-800 pb-2">
                  <span className="text-gray-500">经营范围</span>
                  <span className="text-gray-300">汽车及零部件出口、工程机械出口</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">出口资质</span>
                  <span className="text-green-400">对外贸易经营者备案 · 海关报关单位</span>
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-gray-900 border border-gray-800 p-8">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>👤</span> 负责人
              </h3>
              <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center text-2xl shrink-0">
                  👔
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">[负责人姓名]</h4>
                  <p className="text-amber-500 text-sm">[职位，如：总经理 / Export Manager]</p>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-400">
                  <span>📧</span> lishanlong@sinocv.com
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span>📱</span> WhatsApp: [WhatsApp号]
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <span>📍</span> [办公地址]
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-8">
            <h3 className="text-lg font-bold text-white mb-4 text-center">资质证书</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['营业执照', '出口资质', '品牌授权', '银行资信'].map((label, i) => (
                <div key={i} className="rounded-xl bg-gray-900 border border-gray-800 p-6 text-center group hover:border-amber-500/30 transition-colors cursor-pointer">
                  <span className="text-3xl block mb-3">{['📄','🌐','✅','🏦'][i]}</span>
                  <p className="text-gray-400 text-sm">{label}</p>
                  <p className="text-gray-600 text-xs mt-1">点击查看</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Contact />
    </>
  );
}
