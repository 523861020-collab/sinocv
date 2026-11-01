'use client';

// 车型选配器（报价计算器）：选车型 + 数量 + 目的港 → 立刻出「估算到港价区间」，
// 但精确报价和交期必须留 WhatsApp。2026-11-01 新增（李总要求：让访客主动留联系方式）。
// 价格口径：不报死价，只给区间 + 明确“最终以报价单为准”，避免与话术库指导价冲突。
import { useMemo, useState } from 'react';
import { useLocale } from 'next-intl';

type Model = { key: string; label: string; fob: [number, number] };
type Port = { key: string; label: string; freight: number };

const MODELS: Record<string, Model[]> = {
  en: [
    { key: 'howo-6x4', label: 'HOWO 6×4 Tractor 371hp', fob: [31000, 36000] },
    { key: 'sitrak-g7', label: 'SITRAK G7 6×4 Tractor 540hp', fob: [52000, 59000] },
    { key: 'howo-dump', label: 'HOWO 6×4 Dump Truck 10 wheels', fob: [38000, 44000] },
    { key: 'howo-mixer', label: 'HOWO 8×4 Concrete Mixer 14m³', fob: [46000, 53000] },
    { key: 'howo-cargo', label: 'HOWO 6×4 Cargo Truck with body', fob: [34000, 40000] },
    { key: 'mining-70', label: '70T Wide-body Mining Dump', fob: [58000, 68000] },
    { key: 'xcavator', label: 'XCMG Wheel Loader 5T (ZL50)', fob: [33000, 39000] },
    { key: 'trailer-flat', label: '3-Axle Flatbed Trailer 40ft', fob: [9500, 13000] },
  ],
  fr: [
    { key: 'howo-6x4', label: 'HOWO 6×4 Tracteur 371ch', fob: [31000, 36000] },
    { key: 'sitrak-g7', label: 'SITRAK G7 6×4 Tracteur 540ch', fob: [52000, 59000] },
    { key: 'howo-dump', label: 'HOWO 6×4 Benne basculante', fob: [38000, 44000] },
    { key: 'howo-mixer', label: 'HOWO 8×4 Malaxeur 14m³', fob: [46000, 53000] },
    { key: 'howo-cargo', label: 'HOWO 6×4 Camion plateau', fob: [34000, 40000] },
    { key: 'mining-70', label: 'Benne minière 70T', fob: [58000, 68000] },
    { key: 'xcavator', label: 'Chargeuse XCMG 5T (ZL50)', fob: [33000, 39000] },
    { key: 'trailer-flat', label: 'Semi-remorque plateau 40ft', fob: [9500, 13000] },
  ],
  ar: [
    { key: 'howo-6x4', label: 'HOWO 6×4 رأس قاطرة 371 حصان', fob: [31000, 36000] },
    { key: 'sitrak-g7', label: 'SITRAK G7 6×4 رأس قاطرة 540 حصان', fob: [52000, 59000] },
    { key: 'howo-dump', label: 'HOWO 6×4 شاحنة قلابة', fob: [38000, 44000] },
    { key: 'howo-mixer', label: 'HOWO 8×4 خلاطة خرسانة 14م³', fob: [46000, 53000] },
    { key: 'howo-cargo', label: 'HOWO 6×4 شاحنة صندوق', fob: [34000, 40000] },
    { key: 'mining-70', label: 'شاحنة تعدين 70 طن', fob: [58000, 68000] },
    { key: 'xcavator', label: 'لودر XCMG 5 طن', fob: [33000, 39000] },
    { key: 'trailer-flat', label: 'مقطورة مسطحة 40 قدم', fob: [9500, 13000] },
  ],
};

const PORTS: Port[] = [
  { key: 'mombasa', label: 'Mombasa, Kenya', freight: 2800 },
  { key: 'dar', label: 'Dar es Salaam, Tanzania', freight: 2700 },
  { key: 'lagos', label: 'Lagos, Nigeria', freight: 3400 },
  { key: 'tema', label: 'Tema, Ghana', freight: 3300 },
  { key: 'djibouti', label: 'Djibouti', freight: 2200 },
  { key: 'port-sudan', label: 'Port Sudan', freight: 2400 },
  { key: 'jeddah', label: 'Jeddah, Saudi Arabia', freight: 1900 },
  { key: 'dubai', label: 'Jebel Ali, UAE', freight: 1500 },
  { key: 'algiers', label: 'Algiers, Algeria', freight: 3600 },
  { key: 'luanda', label: 'Luanda, Angola', freight: 4200 },
];

const TXT: Record<string, Record<string, string>> = {
  en: {
    h: 'Instant CIF Price Estimator',
    sub: 'Pick a model and destination port — see the estimated landed price range right away.',
    model: 'Vehicle', qty: 'Quantity', port: 'Destination port',
    est: 'Estimated CIF price (total)', unit: 'per unit, CIF', note: 'Estimate only — final offer confirmed after configuration & inspection.',
    unlock: 'Get exact price + delivery date',
    ph: 'Your WhatsApp number', btn: 'Get exact quote',
    sending: 'Sending…',
    ok: '✅ Got it! Our manager will send the exact quotation on WhatsApp within 1 hour.',
    err: 'Failed. Please WhatsApp us:',
  },
  fr: {
    h: 'Estimateur de prix CIF instantané',
    sub: 'Choisissez un modèle et un port — voyez tout de suite la fourchette de prix rendu.',
    model: 'Véhicule', qty: 'Quantité', port: "Port d'arrivée",
    est: 'Prix CIF estimé (total)', unit: 'par unité, CIF', note: 'Estimation indicative — offre finale après configuration et inspection.',
    unlock: 'Obtenir le prix exact + délai',
    ph: 'Votre numéro WhatsApp', btn: 'Obtenir un devis exact',
    sending: 'Envoi…',
    ok: '✅ Reçu ! Notre responsable vous envoie le devis exact sur WhatsApp sous 1 heure.',
    err: "Échec. Contactez-nous sur WhatsApp :",
  },
  ar: {
    h: 'حاسبة سعر CIF الفورية',
    sub: 'اختر الطراز وميناء الوصول — شاهد نطاق السعر التقديري فورًا.',
    model: 'المركبة', qty: 'الكمية', port: 'ميناء الوصول',
    est: 'السعر التقديري CIF (الإجمالي)', unit: 'للوحدة، CIF', note: 'تقدير فقط — العرض النهائي بعد تحديد المواصفات والفحص.',
    unlock: 'احصل على السعر الدقيق + موعد التسليم',
    ph: 'رقم واتساب الخاص بك', btn: 'اطلب عرضًا دقيقًا',
    sending: 'جارٍ الإرسال…',
    ok: '✅ تم! سيرسل مدير المبيعات العرض الدقيق على واتساب خلال ساعة.',
    err: 'لم يتم الإرسال. راسلنا على واتساب:',
  },
};

const money = (n: number) => '$' + n.toLocaleString('en-US');

export default function PriceEstimator() {
  const locale = useLocale();
  const t = TXT[locale] || TXT.en;
  const models = MODELS[locale] || MODELS.en;

  const [modelKey, setModelKey] = useState(models[0].key);
  const [qty, setQty] = useState(1);
  const [portKey, setPortKey] = useState(PORTS[0].key);
  const [contact, setContact] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle');

  const calc = useMemo(() => {
    const m = models.find((x) => x.key === modelKey) || models[0];
    const p = PORTS.find((x) => x.key === portKey) || PORTS[0];
    const lo = (m.fob[0] + p.freight) * qty;
    const hi = (m.fob[1] + p.freight + 800) * qty;
    return { m, p, lo, hi };
  }, [modelKey, portKey, qty, models]);

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
          country: calc.p.label,
          product: calc.m.label + ' x' + qty,
          message:
            'PRICE ESTIMATOR: ' + calc.m.label + ' | qty ' + qty + ' | port ' + calc.p.label +
            ' | estimate ' + money(calc.lo) + '-' + money(calc.hi) + ' CIF',
        }),
      });
      if (!res.ok) throw new Error('bad status');
      setState('done');
    } catch {
      setState('error');
    }
  };

  const qtyBtn = (n: number) => (
    <button
      key={n}
      type="button"
      onClick={() => setQty(n)}
      className={`h-10 w-10 rounded-lg border text-sm font-bold transition-colors ${
        qty === n
          ? 'border-amber-500 bg-amber-500 text-black'
          : 'border-gray-700 bg-black text-gray-300 hover:border-amber-500/60'
      }`}
    >
      {n}
    </button>
  );

  return (
    <section id="estimator" className="bg-black px-4 py-10 md:px-6">
      <div className="mx-auto max-w-4xl rounded-2xl border border-gray-800 bg-gray-900/70 p-6 md:p-8">
        <h2 className="text-xl font-bold text-white md:text-2xl">🧮 {t.h}</h2>
        <p className="mb-5 text-sm text-gray-400">{t.sub}</p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t.model}</span>
            <select
              value={modelKey}
              onChange={(e) => setModelKey(e.target.value)}
              className="rounded-lg border border-gray-700 bg-black px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
            >
              {models.map((m) => (
                <option key={m.key} value={m.key}>{m.label}</option>
              ))}
            </select>
          </label>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t.qty}</span>
            <div className="flex gap-2">{[1, 2, 3, 5, 10].map(qtyBtn)}</div>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500">{t.port}</span>
            <select
              value={portKey}
              onChange={(e) => setPortKey(e.target.value)}
              className="rounded-lg border border-gray-700 bg-black px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
            >
              {PORTS.map((p) => (
                <option key={p.key} value={p.key}>{p.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-5 rounded-xl border border-amber-500/40 bg-black/60 p-5 text-center">
          <p className="text-xs uppercase tracking-widest text-gray-500">{t.est}</p>
          <p className="mt-1 whitespace-nowrap text-2xl font-extrabold text-amber-400 sm:text-3xl md:text-4xl">
            {money(calc.lo)} – {money(calc.hi)}
          </p>
          <p className="mt-1 text-xs text-gray-500">{qty} × {t.unit} · {calc.p.label}</p>
          <p className="mt-2 text-[11px] text-gray-600">{t.note}</p>
        </div>

        {state === 'done' ? (
          <p className="mt-5 rounded-lg border border-green-600/60 bg-green-950/50 px-4 py-3 text-center font-semibold text-green-300">
            {t.ok}
          </p>
        ) : (
          <form onSubmit={submit} className="mt-5 flex flex-col gap-2 md:flex-row">
            <input
              required
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder={t.ph}
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
        )}

        {state === 'error' && (
          <p className="mt-2 text-sm text-red-400">
            {t.err}{' '}
            <a href="https://wa.me/8619103781257" target="_blank" rel="noreferrer" dir="ltr" className="inline-block underline">
              +86 191 0378 1257
            </a>
          </p>
        )}
      </div>
    </section>
  );
}
