'use client';

import { motion } from 'framer-motion';

const faqs = [
  {
    q: 'How do I get a quotation?',
    a: 'Send us your requirements via WhatsApp or email — vehicle type, quantity, destination port and configuration. Our specialists reply within 24 hours with factory-direct pricing and full specifications.',
  },
  {
    q: 'What are the payment terms?',
    a: 'We accept T/T (bank transfer) and L/C (letter of credit). Typical terms are a 30% deposit with the balance paid before shipment — flexible options are available for repeat clients.',
  },
  {
    q: 'How long does production and shipping take?',
    a: 'Production typically takes 20–45 days depending on the model and configuration. Sea freight to most African and Middle East ports takes 20–35 days.',
  },
  {
    q: 'Do you provide a warranty?',
    a: 'Yes. Warranty terms vary by model and market (typically 1–3 years). Full warranty documentation is provided with every order, and we supply genuine OEM spare parts.',
  },
  {
    q: 'What is the minimum order quantity?',
    a: 'We support both single-unit and bulk orders. For container shipments, we help you maximize load efficiency to reduce per-unit freight cost.',
  },
  {
    q: 'Can I customize my vehicles?',
    a: 'Yes. We customize configuration, color and branding to meet your market requirements — including both left-hand and right-hand drive.',
  },
];

export default function FAQ() {
  return (
    <section style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }} className="bg-gray-950">
      <div className="px-6 lg:px-16 max-w-[1920px] mx-auto">
        <div className="mb-16 text-center">
          <p className="mb-4 text-amber-500 tracking-widest text-sm">FAQ</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Everything you need to know before buying — answered upfront.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {faqs.map((f, i) => (
            <motion.div
              key={f.q}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-xl bg-gray-900 border border-gray-800 p-8 hover:border-amber-500/50 transition-all"
            >
              <h3 className="text-lg font-bold text-white mb-3 flex items-start gap-3">
                <span className="text-amber-500 shrink-0">Q:</span>
                {f.q}
              </h3>
              <p className="text-sm text-gray-400 leading-relaxed flex items-start gap-3">
                <span className="text-gray-600 shrink-0">A:</span>
                {f.a}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
