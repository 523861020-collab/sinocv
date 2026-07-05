'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { trucks, categories } from '@/data/trucks';

export default function ProductSlider() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -400 : 400;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section id="products" className="bg-gray-950 py-24">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-amber-500 tracking-widest text-sm">OUR PRODUCTS</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            产品中心
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            牵引车 · 载货车 · 冷藏车 · 自卸车 · 搅拌车 · 专用车 · 挂车 · 工程机械 · 轻型商用车
          </p>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className="flex items-center gap-2 rounded-full border border-gray-700 px-6 py-3 text-gray-300 transition-all hover:border-amber-500 hover:text-amber-500"
            >
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
              <span className="text-sm text-gray-500">({cat.nameEn})</span>
            </button>
          ))}
        </div>

        {/* Product Cards Slider */}
        <div className="relative">
          {/* Navigation Buttons */}
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white backdrop-blur-sm transition-all hover:bg-white/20"
          >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Cards Container */}
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {trucks.map((truck, index) => (
              <motion.div
                key={truck.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="min-w-[350px] flex-shrink-0 rounded-xl bg-gray-900 border border-gray-800 overflow-hidden group hover:border-amber-500/50 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden bg-gray-800">
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent z-10" />
                  <img
                    src={truck.image}
                    alt={truck.name}
                    className="h-full w-full object-cover"
                  />
                  {/* Category Badge */}
                  <div className="absolute top-4 left-4 z-20 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-black">
                    {categories.find(c => c.id === truck.category)?.name}
                  </div>
                  {truck.horsepower > 0 && (
                    <div className="absolute top-4 right-4 z-20 rounded-full bg-white/20 backdrop-blur-sm px-3 py-1 text-xs font-semibold text-white">
                      {truck.horsepower}HP
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-1 group-hover:text-amber-500 transition-colors">
                    {truck.name}
                  </h3>
                  <p className="text-amber-500 text-sm mb-3">{truck.brand}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">驱动</span>
                      <span className="text-gray-300">{truck.driveType}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">发动机</span>
                      <span className="text-gray-300">{truck.engine}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">价格</span>
                      <span className="text-amber-500 font-semibold">{truck.price}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {truck.features.slice(0, 3).map((feature, i) => (
                      <span key={i} className="rounded-full bg-gray-800 px-3 py-1 text-xs text-gray-400">
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <a
                    href="#contact"
                    className="block w-full rounded-md bg-amber-500/10 py-3 text-center text-amber-500 font-semibold transition-all hover:bg-amber-500 hover:text-black"
                  >
                    获取报价
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
