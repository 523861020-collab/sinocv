'use client';

// 快速询价条：首屏之后紧跟一条"留 WhatsApp 马上给你报价"的输入框。
// 2026-11-01 新增（李总要求：首页留客）。提交走已有的 /api/inquiry（不新增接口）。
import { useState } from 'react';
import { useLocale } from 'next-intl';

// 三语言文案（英文站/阿语站不能出现中文）
const TXT: Record<string, Record<string, string>> = {
  en: {
    title: 'Leave your WhatsApp / email — ', within: 'price within 1 hour',
    ph: 'WhatsApp number / email', ph2: 'What do you need? (optional)',
    btn: 'Get Price', sending: 'Sending…',
    ok1: '✅ Received! Our sales team will contact you within 5 minutes.',
    ok2: 'In a hurry? Chat with us on WhatsApp →',
    err: 'Submission failed. Please WhatsApp us:',
  },
  fr: {
    title: 'Laissez votre WhatsApp / e-mail — ', within: 'devis en 1 heure',
    ph: 'Numéro WhatsApp / e-mail', ph2: 'Quel véhicule ? (facultatif)',
    btn: 'Obtenir le prix', sending: 'Envoi…',
    ok1: '✅ Bien reçu ! Notre équipe vous contacte sous 1 heure.',
    ok2: 'Pressé ? Écrivez-nous sur WhatsApp →',
    err: "Échec de l'envoi. Contactez-nous sur WhatsApp :",
  },
  ar: {
    title: 'اترك رقم واتساب أو بريدك — ', within: 'عرض سعر خلال ساعة',
    ph: 'رقم واتساب / البريد الإلكتروني', ph2: 'ما الذي تريده؟ (اختياري)',
    btn: 'اطلب السعر', sending: 'جارٍ الإرسال…',
    ok1: '✅ تم الاستلام! سيتواصل فريق المبيعات معك خلال ساعة.',
    ok2: 'مستعجل؟ راسلنا على واتساب ←',
    err: 'لم يتم الإرسال. راسلنا على واتساب:',
  },
};

export default function QuickInquiry() {
  const locale = useLocale();
  const t = TXT[locale] || TXT.en;
  const [contact, setContact] = useState('');
  const [product, setProduct] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.trim() || state === 'sending') return;
    const isPhone = /^[+\d][\d\s\-()]{6,}$/.test(contact.trim());
    setState('sending');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
          email: isPhone ? '' : contact.trim(),
          phone: isPhone ? contact.trim() : '',
          company: '',
          country: '',
          product: product.trim(),
          message: 'Quick inquiry from homepage bar',
        }),
      });
      if (!res.ok) throw new Error('bad status');
      setState('done');
    } catch {
      setState('error');
    }
  };

  if (state === 'done') {
    return (
      <div className="rounded-xl border border-green-600/60 bg-green-950/40 px-5 py-4 text-center">
        <p className="text-green-300 font-semibold">{t.ok1}</p>
        <a href="https://wa.me/8619103781257" target="_blank" rel="noreferrer" className="mt-2 inline-block text-sm text-green-200 underline">
          {t.ok2}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-amber-500/40 bg-gray-900/80 p-4 md:p-5">
      <p className="mb-3 text-center text-base md:text-lg font-semibold text-white">
        {t.title}<span className="text-amber-400">{t.within}</span>
      </p>
      <div className="flex flex-col gap-2 md:flex-row">
        <input
          required
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder={t.ph}
          inputMode="text"
          className="flex-1 rounded-lg border border-gray-700 bg-black px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
        />
        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder={t.ph2}
          className="flex-1 rounded-lg border border-gray-700 bg-black px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === 'sending'}
          className="shrink-0 rounded-lg bg-amber-500 px-6 py-3 font-bold text-black hover:bg-amber-400 disabled:opacity-60"
        >
          {state === 'sending' ? t.sending : t.btn}
        </button>
      </div>
      {state === 'error' && (
        <p className="mt-2 text-sm text-red-400">
          {t.err}{" "}
          <a href="https://wa.me/8619103781257" target="_blank" rel="noreferrer" className="underline">+86 191 0378 1257</a>
        </p>
      )}
    </form>
  );
}
