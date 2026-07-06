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
          
          {/* SVG World Map */}
          <div className="max-w-3xl mx-auto">
            <svg viewBox="0 0 800 400" className="w-full h-auto">
              {/* Africa */}
              <path d="M380,80 L410,75 L430,78 L440,90 L445,110 L440,130 L435,150 L440,170 L445,190 L440,210 L435,230 L430,250 L420,270 L410,290 L400,310 L390,320 L380,325 L370,320 L360,310 L350,295 L340,275 L335,255 L330,235 L325,215 L320,195 L325,175 L330,155 L340,135 L350,115 L360,100 L370,88 Z"
                fill="#ec4899" fillOpacity="0.3" stroke="#ec4899" strokeWidth="1.5"/>
              {/* Middle East */}
              <path d="M445,110 L455,105 L465,108 L475,112 L480,120 L478,130 L472,140 L465,148 L458,150 L450,148 L445,140 L442,128 Z"
                fill="#f59e0b" fillOpacity="0.4" stroke="#f59e0b" strokeWidth="1.5"/>
              {/* Southeast Asia */}
              <path d="M640,180 L655,175 L670,178 L680,188 L685,200 L678,212 L665,220 L650,215 L642,205 L638,192 Z"
                fill="#3b82f6" fillOpacity="0.3" stroke="#3b82f6" strokeWidth="1.5"/>
              {/* Central Asia */}
              <path d="M500,75 L520,70 L540,68 L560,72 L570,80 L565,90 L555,95 L540,98 L520,96 L505,90 Z"
                fill="#8b5cf6" fillOpacity="0.3" stroke="#8b5cf6" strokeWidth="1.5"/>
              {/* Europe (faded) */}
              <path d="M370,60 L390,50 L410,45 L430,48 L440,55 L435,65 L425,70 L410,72 L395,70 L380,65 Z"
                fill="#6b7280" fillOpacity="0.15" stroke="#6b7280" strokeWidth="0.5"/>
              {/* Asia (faded) */}
              <path d="M445,55 L480,40 L520,35 L560,32 L600,38 L630,50 L650,65 L660,85 L665,110 L660,135 L650,155 L640,170 L620,165 L600,155 L580,145 L560,138 L540,135 L520,130 L500,120 L480,110 L460,100 L445,85 L440,70 Z"
                fill="#6b7280" fillOpacity="0.1" stroke="#6b7280" strokeWidth="0.5"/>
              {/* South America (faded) */}
              <path d="M240,240 L260,235 L275,240 L280,260 L275,280 L265,300 L250,315 L240,320 L230,310 L225,290 L228,270 L232,255 Z"
                fill="#6b7280" fillOpacity="0.15" stroke="#6b7280" strokeWidth="0.5"/>
              {/* North America (faded) */}
              <path d="M150,80 L180,65 L210,60 L240,62 L260,70 L265,85 L260,100 L250,110 L230,115 L205,112 L180,105 L160,95 Z"
                fill="#6b7280" fillOpacity="0.15" stroke="#6b7280" strokeWidth="0.5"/>
              {/* Australia (faded) */}
              <path d="M680,250 L705,245 L720,255 L718,270 L705,280 L685,278 L672,268 Z"
                fill="#6b7280" fillOpacity="0.15" stroke="#6b7280" strokeWidth="0.5"/>
              
              {/* Legend */}
              <rect x="30" y="340" width="12" height="12" rx="2" fill="#ec4899" fillOpacity="0.5"/>
              <text x="48" y="351" fill="#9ca3af" fontSize="11">非洲</text>
              <rect x="100" y="340" width="12" height="12" rx="2" fill="#f59e0b" fillOpacity="0.5"/>
              <text x="118" y="351" fill="#9ca3af" fontSize="11">中东</text>
              <rect x="170" y="340" width="12" height="12" rx="2" fill="#3b82f6" fillOpacity="0.5"/>
              <text x="188" y="351" fill="#9ca3af" fontSize="11">东南亚</text>
              <rect x="250" y="340" width="12" height="12" rx="2" fill="#8b5cf6" fillOpacity="0.5"/>
              <text x="268" y="351" fill="#9ca3af" fontSize="11">中亚</text>
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
