'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Hero from '@/components/Hero';
import Advantages from '@/components/Advantages';
import Contact from '@/components/Contact';
import { zones } from '@/data/trucks';

const categoryCards = [
  { zone: zones[0], href: '/heavy-truck', bg: 'from-amber-600/30' },
  { zone: zones[1], href: '/machinery', bg: 'from-orange-600/30' },
  { zone: zones[2], href: '/mining', bg: 'from-red-600/30' },
  { zone: zones[3], href: '/light', bg: 'from-green-600/30' },
  { zone: zones[4], href: '/trailers', bg: 'from-blue-600/30' },
];

export default function Home() {
  return (
    <>
      <Hero />

      {/* Category Cards */}
      <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              产品中心
            </h2>
            <p className="text-gray-400 text-lg">选择品类，查看详细产品</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 max-w-6xl mx-auto">
            {categoryCards.map(({ zone, href, bg }, i) => (
              <motion.div
                key={zone.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={href}
                  className="group relative block rounded-2xl bg-gray-900 border border-gray-800 p-8 h-full transition-all duration-300 hover:border-amber-500/50 hover:-translate-y-1"
                >
                  <div className={`absolute inset-0 bg-gradient-to-b ${bg} to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity`} />
                  <div className="relative z-10">
                    <span className="text-5xl block mb-6">{zone.icon}</span>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                      {zone.title}
                    </h3>
                    <p className="text-gray-500 text-sm mb-4">{zone.titleEn}</p>
                    <p className="text-gray-400 text-sm leading-relaxed mb-6">{zone.brand}</p>
                    <span className="inline-flex items-center gap-1 text-amber-500 text-sm font-semibold group-hover:gap-2 transition-all">
                      查看产品 →
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Advantages />
      <Contact />
    </>
  );
}
