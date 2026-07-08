'use client';

import { motion } from 'framer-motion';
import { markets } from '@/data/trucks';

export default function GlobalMarkets() {
  return (
    <section id="markets" className="bg-gray-950 py-24">
      <div className="px-6 lg:px-16 max-w-[1920px] mx-auto">
        <div className="max-w-6xl mx-auto w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-amber-500 tracking-widest text-sm">GLOBAL REACH</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            全球市场
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            产品远销非洲、中东、东南亚、中亚等50多个国家和地区
          </p>
        </motion.div>

        {/* World Map Placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-16 rounded-2xl bg-gray-900 border border-gray-800 p-8 md:p-12"
        >
          <div className="relative aspect-[2/1] bg-gray-800/50 rounded-xl overflow-hidden">
            {/* Simplified world map using CSS */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-8xl mb-4">🌍</div>
                <p className="text-gray-500 text-lg">我们的产品覆盖全球主要市场</p>
              </div>
            </div>
            
            {/* Market dots */}
            {[
              { top: '35%', left: '20%', label: '非洲' },
              { top: '30%', left: '55%', label: '中东' },
              { top: '45%', left: '75%', label: '东南亚' },
              { top: '25%', left: '60%', label: '中亚' }
            ].map((pos, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.2 }}
                className="absolute"
                style={{ top: pos.top, left: pos.left }}
              >
                <div className="relative">
                  <div className="h-4 w-4 rounded-full bg-amber-500 animate-ping absolute" />
                  <div className="h-4 w-4 rounded-full bg-amber-500 relative" />
                  <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-sm font-semibold text-amber-500">
                    {pos.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Market Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {markets.map((market, index) => (
            <motion.div
              key={market.region}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-xl bg-gray-900 border border-gray-800 p-6 hover:border-amber-500/50 transition-all"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-white">{market.region}</h3>
                <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-500 font-semibold">
                  {market.count}+ 台
                </span>
              </div>
              <div className="space-y-2">
                {market.countries.map((country, i) => (
                  <div key={i} className="flex items-center gap-2 text-gray-400">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
                    <span>{country}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
          </div>
      </div>
    </section>
  );
}
