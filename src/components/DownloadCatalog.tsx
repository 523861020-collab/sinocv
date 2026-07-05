'use client';

import { motion } from 'framer-motion';

const catalogs = [
  {
    title: 'SINOTRUK 产品画册',
    description: '中国重汽全系列产品展示，包含牵引车、自卸车、搅拌车、罐式车等各系列车型详细信息。',
    file: '/downloads/sinotruk-catalog.pdf',
    size: '93 MB',
    icon: '📖'
  },
  {
    title: 'HOWO-TX 非洲版画册',
    description: 'HOWO-TX 系列非洲市场专属配置，针对高温、多尘、复杂路况优化设计。（请联系获取）',
    file: '#contact',
    size: '213 MB',
    icon: '🚛'
  }
];

export default function DownloadCatalog() {
  return (
    <section id="catalog" className="bg-black py-24">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <p className="mb-4 text-amber-500 tracking-widest text-sm">DOWNLOAD</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            产品画册下载
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            下载最新产品画册，了解更多车型详情和技术参数
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {catalogs.map((cat, index) => (
            <motion.a
              key={cat.file}
              href={cat.file}
              download
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="group rounded-xl bg-gray-900 border border-gray-800 p-8 transition-all hover:border-amber-500/50 hover:bg-gray-900/80"
            >
              <div className="text-5xl mb-6">{cat.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-amber-500 transition-colors">
                {cat.title}
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                {cat.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">{cat.size}</span>
                <span className="flex items-center gap-2 text-amber-500 font-semibold group-hover:gap-3 transition-all">
                  下载
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </span>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}
