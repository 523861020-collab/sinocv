'use client';

import { motion } from 'framer-motion';

const steps = [
  { icon: '📋', title: 'Inquiry & Needs Analysis', desc: 'Tell us your requirements — vehicle type, quantity, destination port and configuration. Our export specialists respond within 24 hours.' },
  { icon: '💰', title: 'Quotation & Configuration', desc: 'Receive a detailed quotation with factory-direct pricing and full specifications tailored to your market.' },
  { icon: '🏭', title: 'Order & Production', desc: 'Confirm your order with a formal contract. We arrange production directly with the factory and keep you updated on progress.' },
  { icon: '🔍', title: 'Quality Inspection', desc: 'Every unit passes factory inspection and a Pre-Delivery Inspection (PDI) before shipment — photos and reports shared with you.' },
  { icon: '🚢', title: 'Shipping & Logistics', desc: 'We handle export documentation, container booking and freight forwarding to your destination port.' },
  { icon: '🛠️', title: 'After-Sales Support', desc: 'Warranty coverage, genuine spare parts and remote technical support keep your fleet running long after delivery.' },
];

const guarantees = [
  { icon: '🏭', title: 'Factory-Direct Sourcing', desc: 'Direct partnerships with SINOTRUK, SHACMAN, XCMG, CIMC, FOTON and IVECO factories — genuine products, no middlemen.' },
  { icon: '🛡️', title: '1–3 Year Warranty', desc: 'Warranty terms vary by model and market. Full warranty documentation is provided with every order.' },
  { icon: '✅', title: 'Pre-Delivery Inspection', desc: 'Every vehicle is inspected and test-driven before container loading. You receive photo and video proof.' },
  { icon: '🔧', title: 'Genuine Spare Parts', desc: 'Fast supply of OEM spare parts shipped with your vehicles or couriered whenever you need them.' },
];

export default function Process() {
  return (
    <>
      {/* ===== HOW WE WORK ===== */}
      <section style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }} className="bg-gray-950">
        <div className="px-6 lg:px-16 max-w-[1920px] mx-auto">
          <div className="mb-16 text-center">
            <p className="mb-4 text-amber-500 tracking-widest text-sm">HOW WE WORK</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">From Inquiry to Delivery</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              A streamlined 6-step process — transparent, documented and supported at every stage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="relative rounded-xl bg-gray-900 border border-gray-800 p-8 hover:border-amber-500/50 transition-all"
              >
                <div className="absolute top-4 right-5 text-5xl font-black text-gray-800">{String(i + 1).padStart(2, '0')}</div>
                <div className="text-4xl mb-5">{step.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">{step.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== QUALITY & WARRANTY ===== */}
      <section style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }} className="bg-black">
        <div className="px-6 lg:px-16 max-w-[1920px] mx-auto">
          <div className="mb-16 text-center">
            <p className="mb-4 text-amber-500 tracking-widest text-sm">QUALITY & WARRANTY</p>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Built on Trust, Backed by Warranty</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Every vehicle is factory-sourced, inspected and covered — so you buy with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {guarantees.map((g, i) => (
              <motion.div
                key={g.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl bg-gray-900/50 border border-gray-800 p-8 text-center hover:border-amber-500/50 transition-all"
              >
                <div className="text-4xl mb-5">{g.icon}</div>
                <h3 className="text-lg font-bold text-white mb-3">{g.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{g.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
