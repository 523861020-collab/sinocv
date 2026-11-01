'use client';

// 报价包索取（Lead Magnet）：客户留下 WhatsApp/邮箱，立刻拿到车型报价清单。
// 2026-11-01 新增（李总要求：让访客主动留联系方式）。
// 逻辑：不强制留联系方式也能看清单 → 但想看「到港价 + 交期」，必须留下 WhatsApp。
import { useState } from 'react';
import { useLocale } from 'next-intl';

const TXT: Record<string, Record<string, string>> = {
  en: {
    badge: 'FREE',
    h: 'Get the 2026 Price List (FOB / CIF)',
    sub: '22 models · CIF prices to Mombasa, Lagos, Djibouti, Jeddah · Delivery schedule',
    ph: 'Your WhatsApp number',
    ph2: 'Destination port / country',
    btn: 'Send me the price list',
    sending: 'Sending…',
    ok: '✅ Sent! Our manager will WhatsApp you the full price list within 1 hour.',
    okwa: 'Faster? Get it instantly on WhatsApp →',
    err: 'Failed. Please WhatsApp us:',
    privacy: 'We only use it to send prices. No spam.',
    lock: 'Unlock prices',
    locked: 'Prices hidden — leave your number to see FOB & CIF prices',
  },
  fr: {
    badge: 'GRATUIT',
    h: 'Recevez la liste de prix 2026 (FOB / CIF)',
    sub: '22 modèles · prix CIF Mombasa, Lagos, Djibouti, Djeddah · délais de livraison',
    ph: 'Votre numéro WhatsApp',
    ph2: 'Port de destination / pays',
    btn: "Recevoir la liste de prix",
    sending: 'Envoi…',
    ok: '✅ Envoyé ! Notre responsable vous contacte sous 1 heure sur WhatsApp.',
    okwa: 'Plus rapide ? Recevez-la tout de suite sur WhatsApp →',
    err: "Échec. Contactez-nous sur WhatsApp :",
    privacy: 'Utilisé uniquement pour vous envoyer les prix. Aucun spam.',
    lock: 'Voir les prix',
    locked: 'Prix masqués — laissez votre numéro pour voir les prix FOB et CIF',
  },
  ar: {
    badge: 'مجاني',
    h: 'احصل على قائمة أسعار 2026 (FOB / CIF)',
    sub: '22 طرازًا · أسعار CIF إلى مومباسا، لاغوس، جيبوتي، جدة · مواعيد التسليم',
    ph: 'رقم واتساب الخاص بك',
    ph2: 'ميناء الوصول / الدولة',
    btn: 'أرسل لي قائمة الأسعار',
    sending: 'جارٍ الإرسال…',
    ok: '✅ تم الإرسال! سيتواصل مدير المبيعات معك على واتساب خلال ساعة.',
    okwa: 'مستعجل؟ استلمها فورًا على واتساب ←',
    err: 'لم يتم الإرسال. راسلنا على واتساب:',
    privacy: 'نستخدمه لإرسال الأسعار فقط. لا رسائل مزعجة.',
    lock: 'اعرض الأسعار',
    locked: 'الأسعار مخفية — اترك رقمك لعرض أسعار FOB و CIF',
  },
};

export default function PriceListCTA() {
  const locale = useLocale();
  const t = TXT[locale] || TXT.en;
  const [contact, setContact] = useState('');
  const [dest, setDest] = useState('');
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
          country: dest.trim(),
          product: 'PRICE LIST 2026 (FOB/CIF)',
          message: 'Lead magnet: price list request from ' + (dest.trim() || 'unknown port'),
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
      <div className="rounded-2xl border border-green-600/60 bg-green-950/50 px-6 py-8 text-center">
        <p className="text-lg font-bold text-green-300">{t.ok}</p>
        <a
          href="https://wa.me/8619103781257?text=Hi%2C%20please%20send%20me%20the%202026%20price%20list"
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-block rounded-lg bg-green-600 px-6 py-3 font-bold text-white hover:bg-green-500"
        >
          {t.okwa}
        </a>
      </div>
    );
  }

  return (
    <section className="bg-gradient-to-br from-gray-900 to-black px-4 py-10 md:px-6">
      <div className="mx-auto max-w-3xl rounded-2xl border border-amber-500/50 bg-gray-900/90 p-6 md:p-8">
        <div className="mb-1 flex items-center gap-2">
          <span className="rounded bg-amber-500 px-2 py-0.5 text-xs font-bold text-black">{t.badge}</span>
          <h2 className="text-xl font-bold text-white md:text-2xl">{t.h}</h2>
        </div>
        <p className="mb-5 text-sm text-gray-400">{t.sub}</p>

        <form onSubmit={submit} className="flex flex-col gap-2 md:flex-row">
          <input
            required
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder={t.ph}
            className="flex-1 rounded-lg border border-gray-700 bg-black px-4 py-3 text-white placeholder-gray-500 focus:border-amber-500 focus:outline-none"
          />
          <input
            value={dest}
            onChange={(e) => setDest(e.target.value)}
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
        </form>

        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
          <span>🔒 {t.privacy}</span>
          <a
            href="https://wa.me/8619103781257?text=Hi%2C%20please%20send%20me%20the%202026%20price%20list"
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-green-400 hover:text-green-300"
          >
            WhatsApp →
          </a>
        </div>

        {state === 'error' && (
          <p className="mt-2 text-sm text-red-400">
            {t.err}{' '}
            <a href="https://wa.me/8619103781257" target="_blank" rel="noreferrer" className="underline">
              +86 191 0378 1257
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
