'use client';

// 快速询盘弹窗（替换原来的 AI 聊天窗口）
// 2026-11-01 李总要求：不要 AI 聊天，客户留下信息就立刻转给员工，员工 5 分钟内联系。
// 设计原则：一屏填完，不追问、不聊天。国家用下拉（非洲/中东/东南亚/南美常用国家），
// 车型用按钮点选，WhatsApp 是唯一必填项。
import { useState } from 'react';
import { useLocale } from 'next-intl';

const TXT: Record<string, Record<string, string>> = {
  en: {
    fab: 'Get a quote in 5 min',
    title: 'Get your price in 5 minutes',
    sub: 'Leave your WhatsApp — our manager calls you back within 5 minutes.',
    phone: 'Your WhatsApp number *',
    country: 'Your country',
    vehicle: 'What do you need?',
    qty: 'Quantity',
    btn: 'Send — get called back in 5 min',
    sending: 'Sending…',
    ok: '✅ Got it! Our manager will WhatsApp you within 5 minutes.',
    err: 'Failed. Please WhatsApp us directly:',
    note: 'Working hours: 8:00–22:00 Beijing time. Outside that, first thing next morning.',
  },
  fr: {
    fab: 'Devis en 5 min',
    title: 'Votre prix en 5 minutes',
    sub: 'Laissez votre WhatsApp — notre responsable vous rappelle sous 5 minutes.',
    phone: 'Votre numéro WhatsApp *',
    country: 'Votre pays',
    vehicle: 'De quoi avez-vous besoin ?',
    qty: 'Quantité',
    btn: 'Envoyer — rappel sous 5 min',
    sending: 'Envoi…',
    ok: '✅ Reçu ! Notre responsable vous contacte sur WhatsApp sous 5 minutes.',
    err: 'Échec. Écrivez-nous sur WhatsApp :',
    note: "Heures d'ouverture : 8h–22h (heure de Pékin). Hors horaires : dès le lendemain matin.",
  },
  ar: {
    fab: 'عرض سعر خلال 5 دقائق',
    title: 'احصل على سعرك في 5 دقائق',
    sub: 'اترك رقم واتساب — سيتصل بك مدير المبيعات خلال 5 دقائق.',
    phone: 'رقم واتساب الخاص بك *',
    country: 'دولتك',
    vehicle: 'ماذا تحتاج؟',
    qty: 'الكمية',
    btn: 'أرسل — سيتم الاتصال بك خلال 5 دقائق',
    sending: 'جارٍ الإرسال…',
    ok: '✅ تم! سيتواصل معك مدير المبيعات على واتساب خلال 5 دقائق.',
    err: 'لم يتم الإرسال. راسلنا مباشرة على واتساب:',
    note: 'ساعات العمل: 8:00–22:00 بتوقيت بكين. خارج هذه الأوقات: صباح اليوم التالي.',
  },
};

const VEHICLES: Record<string, string[]> = {
  en: ['Tractor truck', 'Dump truck', 'Cargo truck', 'Mixer', 'Excavator', 'Loader', 'Trailer', 'Van', 'Other'],
  fr: ['Tracteur', 'Benne', 'Camion plateau', 'Malaxeur', 'Pelle', 'Chargeuse', 'Remorque', 'Fourgon', 'Autre'],
  ar: ['رأس قاطرة', 'قلابة', 'شاحنة صندوق', 'خلاطة', 'حفارة', 'لودر', 'مقطورة', 'فان', 'أخرى'],
};

const COUNTRIES = [
  'Kenya', 'Nigeria', 'Tanzania', 'Uganda', 'Ghana', 'Ethiopia', 'Sudan', 'South Sudan',
  'Zambia', 'Zimbabwe', 'Angola', 'Mozambique', 'DR Congo', 'South Africa', 'Egypt', 'Libya',
  'Algeria', 'Morocco', 'Tunisia', 'Saudi Arabia', 'UAE', 'Iraq', 'Yemen', 'Oman', 'Kuwait',
  'Djibouti', 'Somalia', 'Pakistan', 'Bangladesh', 'Philippines', 'Peru', 'Bolivia', 'Other',
];

export default function QuickLead() {
  const locale = useLocale();
  const t = TXT[locale] || TXT.en;
  const vehicles = VEHICLES[locale] || VEHICLES.en;

  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [qty, setQty] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || state === 'sending') return;
    setState('sending');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
          phone: phone.trim(),
          email: '',
          country,
          company: '',
          product: vehicle + (qty ? ' x' + qty : ''),
          message: '快速询价（5分钟内回电）',
          page: 'QUICK_LEAD',
        }),
      });
      if (!res.ok) throw new Error('bad status');
      setState('done');
    } catch {
      setState('error');
    }
  };

  return (
    <>
      {/* 右下角悬浮按钮 */}
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 right-4 z-40 rounded-full bg-amber-500 px-3.5 py-2.5 text-xs font-bold md:px-5 md:py-3 md:text-sm text-black shadow-lg shadow-amber-500/30 transition hover:bg-amber-400 md:bottom-28 md:right-6"
      >
        ⚡ {t.fab}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 md:items-center md:p-4">
          <div className="w-full max-w-md rounded-t-2xl bg-gray-900 p-5 md:rounded-2xl md:p-6">
            <div className="mb-1 flex items-start justify-between">
              <h3 className="text-lg font-bold text-white">{t.title}</h3>
              <button
                onClick={() => setOpen(false)}
                aria-label="close"
                className="-mt-1 ml-2 text-2xl leading-none text-gray-500 hover:text-white"
              >
                ×
              </button>
            </div>
            <p className="mb-4 text-xs text-gray-400">{t.sub}</p>

            {state === 'done' ? (
              <p className="rounded-lg border border-green-600/60 bg-green-950/50 px-4 py-4 text-center font-semibold text-green-300">
                {t.ok}
              </p>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t.phone}
                  </label>
                  <input
                    required
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+254 7XX XXX XXX"
                    className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2.5 text-white placeholder-gray-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t.country}
                  </label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="">—</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t.vehicle}
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {vehicles.map((v) => (
                      <button
                        key={v}
                        type="button"
                        onClick={() => setVehicle(vehicle === v ? '' : v)}
                        className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                          vehicle === v
                            ? 'border-amber-500 bg-amber-500 text-black'
                            : 'border-gray-700 text-gray-300 hover:border-amber-500/60'
                        }`}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t.qty}
                  </label>
                  <div className="flex gap-1.5">
                    {['1', '2', '3', '5', '10+'].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setQty(qty === n ? '' : n)}
                        className={`h-9 w-10 rounded-lg border text-xs font-bold transition ${
                          qty === n
                            ? 'border-amber-500 bg-amber-500 text-black'
                            : 'border-gray-700 text-gray-300 hover:border-amber-500/60'
                        }`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={state === 'sending'}
                  className="w-full rounded-lg bg-amber-500 py-3 font-bold text-black hover:bg-amber-400 disabled:opacity-60"
                >
                  {state === 'sending' ? t.sending : t.btn}
                </button>

                {state === 'error' && (
                  <p className="text-xs text-red-400">
                    {t.err}{' '}
                    <a href="https://wa.me/8619103781257" target="_blank" rel="noreferrer" dir="ltr" className="inline-block underline">
                      +86 191 0378 1257
                    </a>
                  </p>
                )}

                <p className="text-[10px] leading-relaxed text-gray-600">{t.note}</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
