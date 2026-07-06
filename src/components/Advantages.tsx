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
            <p className="text-gray-400">以中国为枢纽，覆盖中东、非洲、东南亚、中亚等 30+ 国家和地区</p>
          </div>
          
          <div className="max-w-5xl mx-auto">
            <svg viewBox="0 0 1000 420" className="w-full h-auto">
              <defs>
                <radialGradient id="chinaGlow" cx="50%" cy="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.6"/>
                  <stop offset="60%" stopColor="#f59e0b" stopOpacity="0.15"/>
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0"/>
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="blur"/>
                  <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                </filter>
              </defs>
              
              {/* World outline */}
              <g fill="none" stroke="#2d3748" strokeWidth="0.6">
                <path d="M140,80 L210,55 L280,60 L300,75 L310,100 L300,125 L275,145 L245,155 L200,150 L165,135 L145,115 Z"/>
                <path d="M220,210 L260,200 L280,210 L285,240 L275,270 L260,300 L240,320 L225,315 L215,290 Z"/>
                <path d="M360,60 L395,45 L440,42 L470,48 L490,55 L500,70 L490,80 L470,85 L440,83 L410,80 L380,75 Z"/>
                <path d="M415,105 L440,100 L460,108 L475,125 L480,155 L475,190 L470,225 L460,255 L445,285 L430,305 L415,310 L400,305 L385,285 L375,260 L365,230 L360,200 L362,165 L370,140 L385,120 Z"/>
                <path d="M500,55 L535,38 L585,28 L635,25 L685,35 L725,50 L755,70 L775,95 L785,125 L780,160 L765,185 L745,195 L725,190 L705,180 L685,175 L665,173 L645,170 L625,165 L605,155 L585,145 L565,130 L545,115 L525,100 L510,85 Z"/>
                <path d="M740,195 L760,200 L775,215 L770,235 L755,243 L735,235 L728,220 Z"/>
                <path d="M750,245 L775,243 L790,255 L785,270 L770,278 L755,273 L748,260 Z"/>
                <path d="M760,275 L800,265 L830,275 L840,300 L830,325 L805,335 L775,330 L760,310 Z"/>
              </g>
              
              {/* China hub glow */}
              <circle cx="590" cy="110" r="45" fill="url(#chinaGlow)"/>
              <circle cx="590" cy="110" r="8" fill="#f59e0b" filter="url(#glow)"/>
              <circle cx="590" cy="110" r="4" fill="#fff"/>
              
              {/* Connection arcs from China to regions */}
              {/* China → Middle East */}
              <path d="M560,100 Q510,70 480,130" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7"/>
              {/* China → Africa */}
              <path d="M560,115 Q500,160 430,230" fill="none" stroke="#ec4899" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7"/>
              {/* China → Central Asia */}
              <path d="M580,85 Q570,55 550,75" fill="none" stroke="#8b5cf6" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7"/>
              {/* China → Southeast Asia */}
              <path d="M610,125 Q680,150 735,210" fill="none" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.7"/>
              
              {/* Destination dots */}
              <circle cx="480" cy="130" r="5" fill="#f59e0b" opacity="0.8"/>
              <circle cx="430" cy="230" r="5" fill="#ec4899" opacity="0.8"/>
              <circle cx="550" cy="75" r="5" fill="#8b5cf6" opacity="0.8"/>
              <circle cx="735" cy="210" r="5" fill="#3b82f6" opacity="0.8"/>
              
              {/* Region labels */}
              <text x="430" y="355" textAnchor="middle" fill="#ec4899" fontSize="15" fontWeight="700">非洲 AFRICA</text>
              <text x="560" y="310" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="600">中 东</text>
              <text x="730" y="260" textAnchor="middle" fill="#3b82f6" fontSize="13" fontWeight="600">东南亚</text>
              <text x="530" y="55" textAnchor="middle" fill="#8b5cf6" fontSize="13" fontWeight="600">中 亚</text>
              <text x="615" y="132" textAnchor="start" fill="#f59e0b" fontSize="10" fontWeight="700">中 国</text>
              
              {/* Bottom country lists */}
              <text x="500" y="385" textAnchor="middle" fill="#4b5563" fontSize="10">
                沙特 · 阿联酋 · 伊拉克 · 阿尔及利亚 · 尼日利亚 · 埃塞俄比亚 · 坦桑尼亚 · 肯尼亚 · 越南 · 印尼 · 哈萨克斯坦 · 乌兹别克斯坦 等 30+ 国
              </text>
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
