'use client';

import { motion } from 'framer-motion';
import { advantages } from '@/data/trucks';

const iconMap: Record<string, React.ReactNode> = {
  shield: (
    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  ),
  price: (
    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  service: (
    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  custom: (
    <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};

export default function Advantages() {
  return (
    <section className="bg-black py-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-amber-500 tracking-widest text-sm">WHY CHOOSE US</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            我们的优势
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            四大品牌一站式采购，重汽重卡 + 徐工机械 + 中集挂车 + 福田商用车
          </p>
        </motion.div>

        {/* Advantages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((adv, index) => (
            <motion.div
              key={adv.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group rounded-xl bg-gray-900/50 border border-gray-800 p-8 text-center transition-all hover:border-amber-500/50 hover:bg-gray-900"
            >
              <div className="mx-auto mb-6 text-amber-500 group-hover:scale-110 transition-transform">
                {iconMap[adv.icon]}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{adv.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{adv.titleEn}</p>
              <p className="text-gray-400 leading-relaxed">{adv.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Coverage Map */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold text-white mb-2">销售覆盖区域</h3>
            <p className="text-gray-400">覆盖中东、非洲、东南亚、中亚等 30+ 国家和地区</p>
          </div>
          
          {/* Region cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: '中东',
                icon: '🕌',
                countries: '沙特 · 阿联酋 · 伊拉克 · 约旦 · 科威特 · 阿曼 · 巴林 · 卡塔尔',
                color: 'from-amber-500/20 to-amber-500/5',
                border: 'border-amber-500/30'
              },
              {
                name: '非洲',
                icon: '🌍',
                countries: '阿尔及利亚 · 尼日利亚 · 埃塞俄比亚 · 坦桑尼亚 · 肯尼亚 · 加纳 · 南非 · 埃及',
                color: 'from-emerald-500/20 to-emerald-500/5',
                border: 'border-emerald-500/30'
              },
              {
                name: '东南亚',
                icon: '🌏',
                countries: '越南 · 菲律宾 · 印尼 · 缅甸 · 老挝 · 柬埔寨 · 马来西亚 · 泰国',
                color: 'from-blue-500/20 to-blue-500/5',
                border: 'border-blue-500/30'
              },
              {
                name: '中亚',
                icon: '🏔️',
                countries: '哈萨克斯坦 · 乌兹别克斯坦 · 土库曼斯坦 · 吉尔吉斯斯坦 · 塔吉克斯坦',
                color: 'from-purple-500/20 to-purple-500/5',
                border: 'border-purple-500/30'
              }
            ].map(region => (
              <div key={region.name} className={`rounded-2xl bg-gradient-to-br ${region.color} border ${region.border} p-8 text-center`}>
                <span className="text-4xl mb-4 block">{region.icon}</span>
                <h4 className="text-white font-bold text-lg mb-3">{region.name}</h4>
                <p className="text-gray-400 text-sm leading-relaxed">{region.countries}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { number: '50+', label: '出口国家' },
            { number: '10,000+', label: '累计出口' },
            { number: '30+', label: '年行业经验' },
            { number: '98%', label: '客户满意度' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-amber-500 mb-2">{stat.number}</div>
              <div className="text-gray-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
