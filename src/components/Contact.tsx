'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    product: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', company: '', country: '', product: '', message: '' });
      }
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" style={{paddingTop: '1.5rem', paddingBottom: '1.5rem'}} className="bg-black">
      <div style={{maxWidth: '896px', margin: '0 auto', padding: '0 1.5rem', textAlign: 'center'}}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center"
        >
          <p className="mb-4 text-amber-500 tracking-widest text-sm">CONTACT US</p>
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Get a Quote</h2>
          <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-xl">
            Fill out the form below and our team will provide a detailed quotation within 24 hours.
          </p>

          {isSubmitted ? (
            <div className="rounded-xl bg-gray-900 border border-gray-800 p-12 text-center w-full">
              <div className="text-6xl mb-6">✅</div>
              <h3 className="text-2xl font-bold text-white mb-4">Quote Submitted!</h3>
              <p className="text-gray-400 mb-8">
                Thank you for your inquiry. Our team will contact you within 24 hours.
              </p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="rounded-md bg-amber-500 px-8 py-3 font-semibold text-black hover:bg-amber-400 transition-colors"
              >
                Submit Another
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="rounded-xl bg-gray-900 border border-gray-800 p-8 text-left w-full">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Your Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                    placeholder="+1 234 567 890"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                    placeholder="Your Country"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">Product Interest</label>
                  <select
                    value={formData.product}
                    onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                    className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">Select Product Type</option>
                    <option value="tractor">Tractor Truck</option>
                    <option value="dump">Dump Truck</option>
                    <option value="mixer">Concrete Mixer</option>
                    <option value="tanker">Tank Truck</option>
                    <option value="crane">Crane Truck</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-400 mb-2">Message</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full rounded-md bg-gray-800 border border-gray-700 px-4 py-3 text-white focus:border-amber-500 focus:outline-none"
                  placeholder="Describe your requirements..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-md bg-amber-500 py-4 text-lg font-semibold text-black transition-all hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
}
