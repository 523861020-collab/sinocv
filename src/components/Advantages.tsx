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
          
          <div className="max-w-4xl mx-auto relative">
            {/* Background world map dots pattern */}
            <svg viewBox="0 0 1000 500" className="w-full h-auto">
              <defs>
                <radialGradient id="africaGrad" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#ec4899" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="mideastGrad" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="seasiaGrad" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0"/>
                </radialGradient>
                <radialGradient id="casiaGrad" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.4"/>
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0"/>
                </radialGradient>
              </defs>
              
              {/* World outline — simple projection */}
              <g fill="none" stroke="#374151" strokeWidth="0.8" opacity="0.6">
                {/* North America */}
                <path d="M120,80 L200,60 L260,65 L280,80 L290,100 L280,130 L260,150 L230,160 L190,155 L150,140 L130,120 Z"/>
                {/* South America */}
                <path d="M210,220 L240,210 L260,220 L265,250 L255,280 L240,310 L225,330 L210,320 L200,290 Z"/>
                {/* Europe */}
                <path d="M340,65 L380,50 L420,48 L450,52 L470,60 L475,75 L465,85 L445,88 L420,90 L390,88 L360,85 Z"/>
                {/* Africa */}
                <path d="M395,110 L425,108 L445,115 L460,130 L465,160 L460,195 L455,230 L445,265 L430,295 L415,315 L400,320 L385,315 L370,295 L360,270 L355,240 L350,210 L350,175 L355,145 L365,125 Z"/>
                {/* Asia */}
                <path d="M470,60 L510,40 L560,30 L610,28 L660,38 L700,55 L730,75 L750,100 L760,130 L755,165 L740,190 L720,200 L700,195 L680,185 L660,180 L640,178 L620,175 L600,170 L580,160 L560,150 L540,140 L520,125 L500,110 L485,95 L475,80 Z"/>
                {/* Southeast Asia islands */}
                <path d="M720,200 L740,205 L755,220 L750,240 L735,248 L715,240 L708,225 Z"/>
                <path d="M730,250 L755,248 L770,260 L765,278 L750,285 L735,278 L728,265 Z"/>
                {/* Australia */}
                <path d="M750,280 L790,270 L820,280 L830,305 L820,330 L795,340 L765,335 L750,315 Z"/>
              </g>
              
              {/* Highlight regions */}
              <ellipse cx="420" cy="220" rx="85" ry="120" fill="url(#africaGrad)" stroke="#ec4899" strokeWidth="1" strokeDasharray="4,4"/>
              <ellipse cx="490" cy="125" rx="35" ry="30" fill="url(#mideastGrad)" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4,4"/>
              <ellipse cx="720" cy="230" rx="40" ry="50" fill="url(#seasiaGrad)" stroke="#3b82f6" strokeWidth="1" strokeDasharray="4,4"/>
              <ellipse cx="560" cy="80" rx="55" ry="30" fill="url(#casiaGrad)" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="4,4"/>
              
              {/* Labels */}
              <text x="420" y="340" textAnchor="middle" fill="#ec4899" fontSize="13" fontWeight="600">非洲 · Africa</text>
              <text x="490" y="170" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="600">中东</text>
              <text x="720" y="290" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="600">东南亚</text>
              <text x="560" y="120" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="600">中亚</text>
            </svg>
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
