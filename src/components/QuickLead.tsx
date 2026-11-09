'use client';

// 快速询盘弹窗：两个入口合一
// ① ⚡ 5 分钟报价（原有）
// ② 📄 2026 报价清单 FOB/CIF（2026-11-09 从首页大卡片搬进来）
// 李总反馈：首页那块「Get the 2026 Price List」直接摆在内容中间太突兀、影响整体美感。
// 现在页面上不再出现大块留资表单，客户点右下角「询价 / WhatsApp」入口后才在弹窗里看到。
import { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { OPEN_LEAD_EVENT, type LeadMode } from '@/lib/leadModal';

const TXT: Record<string, Record<string, string>> = {
  en: {
    fab: 'Get a quote in 5 min',
    tabQuote: '⚡ Price in 5 min',
    tabList: '📄 2026 Price List',
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
    listTitle: 'Get the 2026 Price List (FOB / CIF)',
    listSub: '22 models · CIF prices to Mombasa, Lagos, Djibouti, Jeddah · Delivery schedule',
    listPhone: 'Your WhatsApp number *',
    listPort: 'Destination port / country',
    listBtn: 'Send me the price list',
    listOk: '✅ Sent! Our manager will WhatsApp you the full price list within 1 hour.',
    listWa: 'Faster? Get it instantly on WhatsApp →',
    privacy: 'We only use it to send prices. No spam.',
  },
  fr: {
    fab: 'Devis en 5 min',
    tabQuote: '⚡ Devis en 5 min',
    tabList: '📄 Liste de prix 2026',
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
    listTitle: 'Recevez la liste de prix 2026 (FOB / CIF)',
    listSub: '22 modèles · prix CIF Mombasa, Lagos, Djibouti, Djeddah · délais de livraison',
    listPhone: 'Votre numéro WhatsApp *',
    listPort: 'Port de destination / pays',
    listBtn: 'Recevoir la liste de prix',
    listOk: '✅ Envoyé ! Notre responsable vous contacte sous 1 heure sur WhatsApp.',
    listWa: 'Plus rapide ? Recevez-la tout de suite sur WhatsApp →',
    privacy: 'Utilisé uniquement pour vous envoyer les prix. Aucun spam.',
  },
  ar: {
    fab: 'عرض سعر خلال 5 دقائق',
    tabQuote: '⚡ سعر خلال 5 دقائق',
    tabList: '📄 قائمة أسعار 2026',
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
    listTitle: 'احصل على قائمة أسعار 2026 (FOB / CIF)',
    listSub: '22 طرازًا · أسعار CIF إلى مومباسا، لاغوس، جيبوتي، جدة · مواعيد التسليم',
    listPhone: 'رقم واتساب الخاص بك *',
    listPort: 'ميناء الوصول / الدولة',
    listBtn: 'أرسل لي قائمة الأسعار',
    listOk: '✅ تم الإرسال! سيتواصل مدير المبيعات معك على واتساب خلال ساعة.',
    listWa: 'مستعجل؟ استلمها فورًا على واتساب ←',
    privacy: 'نستخدمه لإرسال الأسعار فقط. لا رسائل مزعجة.',
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

const PRICE_LIST_WA = 'https://wa.me/8619103781257?text=' +
  encodeURIComponent('Hi, please send me the 2026 price list (FOB / CIF)');

export default function QuickLead() {
  const locale = useLocale();
  const t = TXT[locale] || TXT.en;
  const vehicles = VEHICLES[locale] || VEHICLES.en;

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<LeadMode>('quote');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [qty, setQty] = useState('');
  const [listContact, setListContact] = useState('');
  const [listPort, setListPort] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  // 页面其他按钮（如 Contact 区「2026 Price List」小链接）通过事件打开，并直接选中对应 tab
  useEffect(() => {
    const onOpen = (e: Event) => {
      const detail = (e as CustomEvent<LeadMode>).detail;
      setMode(detail === 'pricelist' ? 'pricelist' : 'quote');
      setState('idle');
      setOpen(true);
    };
    window.addEventListener(OPEN_LEAD_EVENT, onOpen as EventListener);
    return () => window.removeEventListener(OPEN_LEAD_EVENT, onOpen as EventListener);
  }, []);

  const switchMode = (m: LeadMode) => {
    setMode(m);
    setState('idle');
  };

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

  const submitList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listContact.trim() || state === 'sending') return;
    const isPhone = /^[+\d][\d\s\-()]{6,}$/.test(listContact.trim());
    setState('sending');
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: '',
          phone: isPhone ? listContact.trim() : '',
          email: isPhone ? '' : listContact.trim(),
          country: listPort.trim(),
          company: '',
          product: 'PRICE LIST 2026 (FOB/CIF)',
          message: 'Lead magnet: price list request from ' + (listPort.trim() || 'unknown port'),
          page: 'PRICE_LIST',
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
      {/* 右下角悬浮按钮：询价入口（价格清单也在这里面） */}
      <button
        onClick={() => { setMode('quote'); setState('idle'); setOpen(true); }}
        className="fixed bottom-24 right-4 z-40 rounded-full bg-amber-500 px-3.5 py-2.5 text-xs font-bold md:px-5 md:py-3 md:text-sm text-black shadow-lg shadow-amber-500/30 transition hover:bg-amber-400 md:bottom-28 md:right-6"
      >
        ⚡ {t.fab}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-0 md:items-center md:p-4">
          <div className="w-full max-w-md rounded-t-2xl bg-gray-900 p-5 md:rounded-2xl md:p-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              {/* 两个入口：报价 / 2026 报价清单 */}
              <div className="flex rounded-full bg-black/60 p-1">
                <button
                  type="button"
                  onClick={() => switchMode('quote')}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    mode === 'quote' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t.tabQuote}
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('pricelist')}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    mode === 'pricelist' ? 'bg-amber-500 text-black' : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {t.tabList}
                </button>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="close"
                className="-mt-1 text-2xl leading-none text-gray-500 hover:text-white"
              >
                ×
              </button>
            </div>

            <h3 className="mb-1 text-lg font-bold text-white">
              {mode === 'quote' ? t.title : t.listTitle}
            </h3>
            <p className="mb-4 text-xs text-gray-400">
              {mode === 'quote' ? t.sub : t.listSub}
            </p>

            {state === 'done' ? (
              mode === 'quote' ? (
                <p className="rounded-lg border border-green-600/60 bg-green-950/50 px-4 py-4 text-center font-semibold text-green-300">
                  {t.ok}
                </p>
              ) : (
                <div className="space-y-3">
                  <p className="rounded-lg border border-green-600/60 bg-green-950/50 px-4 py-4 text-center font-semibold text-green-300">
                    {t.listOk}
                  </p>
                  <a
                    href={PRICE_LIST_WA}
                    target="_blank"
                    rel="noreferrer"
                    className="block rounded-lg bg-green-600 px-4 py-3 text-center text-sm font-bold text-white hover:bg-green-500"
                  >
                    {t.listWa}
                  </a>
                </div>
              )
            ) : mode === 'quote' ? (
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
            ) : (
              <form onSubmit={submitList} className="space-y-3">
                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t.listPhone}
                  </label>
                  <input
                    required
                    value={listContact}
                    onChange={(e) => setListContact(e.target.value)}
                    placeholder="+254 7XX XXX XXX / you@company.com"
                    className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2.5 text-white placeholder-gray-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-gray-500">
                    {t.listPort}
                  </label>
                  <input
                    value={listPort}
                    onChange={(e) => setListPort(e.target.value)}
                    placeholder="Mombasa / Lagos / Jeddah…"
                    className="w-full rounded-lg border border-gray-700 bg-black px-3 py-2.5 text-white placeholder-gray-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={state === 'sending'}
                  className="w-full rounded-lg bg-amber-500 py-3 font-bold text-black hover:bg-amber-400 disabled:opacity-60"
                >
                  {state === 'sending' ? t.sending : t.listBtn}
                </button>

                {state === 'error' && (
                  <p className="text-xs text-red-400">
                    {t.err}{' '}
                    <a href="https://wa.me/8619103781257" target="_blank" rel="noreferrer" dir="ltr" className="inline-block underline">
                      +86 191 0378 1257
                    </a>
                  </p>
                )}

                <p className="text-[10px] leading-relaxed text-gray-600">🔒 {t.privacy}</p>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
