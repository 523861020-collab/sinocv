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
            <h3 className="text-2xl font-bold text-white mb-2">全球销售网络</h3>
            <p className="text-gray-400">以中国为核心，覆盖四大区域 30+ 国家</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <svg viewBox="0 0 900 380" className="w-full h-auto">
              {/* Clean continent outlines */}
              <g fill="none" stroke="#1f2937" strokeWidth="1.2" opacity="0.8">
                <path d="M100,60 L170,35 L250,40 L270,55 L280,75 L270,100 L250,120 L210,130 L170,125 L135,110 L115,90 Z"/>
                <path d="M180,180 L220,170 L240,180 L245,210 L235,240 L220,270 L200,290 L185,285 L175,260 Z"/>
                <path d="M320,40 L355,25 L400,22 L430,28 L450,35 L460,50 L450,60 L430,65 L400,63 L370,60 L340,55 Z"/>
                <path d="M375,85 L400,80 L420,88 L435,105 L440,135 L435,170 L430,205 L420,235 L405,265 L390,285 L375,290 L360,285 L345,265 L335,240 L325,210 L320,180 L322,145 L330,120 L345,100 Z"/>
                <path d="M460,35 L495,18 L545,8 L595,5 L645,15 L685,30 L715,50 L735,75 L745,105 L740,140 L725,165 L705,175 L685,170 L665,160 L645,155 L625,153 L605,150 L585,145 L565,135 L545,125 L525,110 L505,95 L485,80 L470,65 Z"/>
                <path d="M700,175 L720,180 L735,195 L730,215 L715,223 L695,215 L688,200 Z"/>
                <path d="M710,225 L735,223 L750,235 L745,250 L730,258 L715,253 L708,240 Z"/>
                <path d="M720,255 L760,245 L790,255 L800,280 L790,305 L765,315 L735,310 L720,290 Z"/>
              </g>
              
              {/* China - prominent node */}
              <circle cx="565" cy="100" r="36" fill="#f59e0b" fillOpacity="0.12"/>
              <circle cx="565" cy="100" r="18" fill="#f59e0b" fillOpacity="0.25"/>
              <circle cx="565" cy="100" r="6" fill="#f59e0b"/>
              <text x="565" y="155" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="700">🇨🇳 中国</text>
              
              {/* Connection lines */}
              <line x1="565" y1="100" x2="510" y2="120" stroke="#f59e0b" strokeWidth="1.8" strokeDasharray="6,4" opacity="0.6"/>
              <line x1="510" y1="120" x2="430" y2="200" stroke="#ec4899" strokeWidth="1.8" strokeDasharray="6,4" opacity="0.6"/>
              <line x1="565" y1="100" x2="650" y2="170" stroke="#3b82f6" strokeWidth="1.8" strokeDasharray="6,4" opacity="0.6"/>
              <line x1="565" y1="100" x2="540" y2="70" stroke="#8b5cf6" strokeWidth="1.8" strokeDasharray="6,4" opacity="0.6"/>
              
              {/* Destination nodes */}
              <circle cx="510" cy="120" r="5" fill="#f59e0b" fillOpacity="0.8"/>
              <circle cx="430" cy="200" r="5" fill="#ec4899" fillOpacity="0.8"/>
              <circle cx="650" cy="170" r="5" fill="#3b82f6" fillOpacity="0.8"/>
              <circle cx="540" cy="70" r="5" fill="#8b5cf6" fillOpacity="0.8"/>
              
              {/* Region labels */}
              <text x="510" y="143" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="600">中 东</text>
              <text x="500" y="170" textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="600">MIDDLE EAST</text>
              
              <text x="430" y="225" textAnchor="middle" fill="#ec4899" fontSize="12" fontWeight="600">非 洲</text>
              <text x="450" y="240" textAnchor="middle" fill="#ec4899" fontSize="12" fontWeight="600">AFRICA</text>
              
              <text x="650" y="195" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="600">东南亚</text>
              <text x="650" y="210" textAnchor="middle" fill="#3b82f6" fontSize="12" fontWeight="600">SE ASIA</text>
              
              <text x="540" y="55" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="600">中 亚</text>
              <text x="540" y="40" textAnchor="middle" fill="#8b5cf6" fontSize="12" fontWeight="600">CENTRAL ASIA</text>
              
              {/* Bottom country list */}
              <g transform="translate(0, 340)">
                <text x="450" y="0" textAnchor="middle" fill="#4b5563" fontSize="10">
                  沙特 · 阿联酋 · 伊拉克 · 约旦 · 阿尔及利亚 · 尼日利亚 · 肯尼亚 · 埃塞俄比亚 · 坦桑尼亚 · 越南 · 印尼 · 菲律宾 · 哈萨克斯坦 等
                </text>
                <text x="450" y="18" textAnchor="middle" fill="#f59e0b" fontSize="13" fontWeight="700">覆盖 30+ 国家和地区</text>
              </g>
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
