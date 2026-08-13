'use client';

import { motion } from 'framer-motion';

const reviews = [
  {
    text: 'Factory-direct pricing saved us significantly compared to local dealers. The trucks arrived exactly as specified and passed inspection on first delivery.',
    name: 'Fleet Operator',
    region: 'Africa',
    rating: 5,
  },
  {
    text: 'Clear communication from inquiry to delivery. They handled all export documentation, and the vehicles arrived in excellent condition.',
    name: 'Truck Dealer',
    region: 'Middle East',
    rating: 5,
  },
  {
    text: 'The after-sales support is what sets them apart — genuine spare parts shipped fast, and their team responds within hours.',
    name: 'Construction Company',
    region: 'Southeast Asia',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section style={{ paddingTop: '1.5rem', paddingBottom: '1.5rem' }} className="bg-gray-950">
      <div className="px-6 lg:px-16 max-w-[1920px] mx-auto">
        <div className="mb-16 text-center">
          <p className="mb-4 text-amber-500 tracking-widest text-sm">TESTIMONIALS</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">What Our Clients Say</h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Trusted by fleet operators, dealers and construction companies across 50+ countries.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="rounded-xl bg-gray-900 border border-gray-800 p-8 flex flex-col hover:border-amber-500/50 transition-all"
            >
              <div className="mb-4 text-amber-500">
                {'★'.repeat(r.rating)}
              </div>
              <p className="text-gray-300 leading-relaxed flex-1 mb-6">
                &ldquo;{r.text}&rdquo;
              </p>
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 font-bold text-lg">
                  {r.name.charAt(0)}
                </div>
                <div>
                  <div className="text-white font-semibold text-sm">{r.name}</div>
                  <div className="text-gray-500 text-xs">{r.region}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
