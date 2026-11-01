import type { Metadata } from 'next';
import Link from 'next/link';

// 2026-11-01 新增：信任页。
// 非洲/中东客户下单前最怕「你到底是不是真公司、是不是骗子」。
// 这一页把能核验的硬证据全摊开：香港公司注册证书、中国营业执照、实体 4S 店照片、
// 出口版图。所有信息都是可核对的真实资料，不写任何无法验证的数字。

const SITE = 'https://www.sinocv.com';

const T = {
  en: {
    nav: 'About Us',
    h1: 'We are a licensed dealer and exporter — not a middleman',
    sub: 'Registered in Hong Kong, operating a real SINOTRUK dealership in China. You can verify both before you send us a single dollar.',
    verify: 'Verify us before you pay',
    verifySub: 'Every document below is a scan of the original. Ask us for the company details and check them yourself.',
    docs: [
      { title: 'Hong Kong Certificate of Incorporation', body: 'Xin Yuntong China Limited · Certificate No. 76875554 · issued 30 July 2024 by the Hong Kong Companies Registry.', img: '/images/cert-hk-1.webp' },
      { title: 'China Business Licence', body: 'Henan Xinyuntong Automobile Sales Co., Ltd. · Unified Social Credit Code 91410105MA9H1B2U2B · established 18 June 2021 · registered capital CNY 1,000,000.', img: '/images/license-cn.webp' },
      { title: 'Our own dealership, not an office', body: 'SINOTRUK HOWO authorised showroom and service centre with trucks in stock. Customers walk in and drive out every week.', img: '/images/4s-store.webp' },
    ],
    who: 'Who we are',
    facts: [
      ['Export entity', 'Xin Yuntong China Limited (Hong Kong)'],
      ['China operation', 'Henan Xinyuntong Automobile Sales Co., Ltd.'],
      ['Business licence', '91410105MA9H1B2U2B'],
      ['Established', '2021 (China) · 2024 (Hong Kong)'],
      ['Showroom', 'Zhengzhou, Henan — SINOTRUK HOWO authorised'],
      ['Export office', 'No. 17668 Panwang Road, Zhangqiu, Jinan, Shandong'],
    ],
    do: 'What we actually do for you',
    services: [
      ['Factory price, no layers', 'We buy directly from SINOTRUK, SHACMAN, XCMG and CIMC. You see the factory invoice, we add one transparent margin.'],
      ['Right-hand or left-hand drive', 'Built to your country spec — RHD for Kenya, Tanzania, Uganda; LHD for Algeria, Nigeria, the Gulf.'],
      ['Shipping we arrange', 'FOB, CFR or CIF to your port. We handle booking, loading, and the documents your customs broker needs.'],
      ['Spare parts and CKD', 'Container of spare parts with your first order. Full CKD kits for assembly if you want to build locally.'],
    ],
    mapTitle: 'Where our trucks go',
    mapBody: 'Africa, the Middle East and Southeast Asia. Tell us your port and we will quote CFR within one working day.',
    ctaTitle: 'Send us your requirement',
    ctaBody: 'Leave your WhatsApp — a manager replies within 5 minutes during Beijing working hours.',
    ctaBtn: 'Get a price now',
    trust: 'You can also ask us for: bank account in the company name, past bill of lading, or a video call from the showroom.',
  },
  fr: {
    nav: 'À propos',
    h1: "Nous sommes un concessionnaire et exportateur agréé — pas un intermédiaire",
    sub: "Enregistrés à Hong Kong, avec une vraie concession SINOTRUK en Chine. Vous pouvez vérifier les deux avant de nous envoyer le moindre dollar.",
    verify: 'Vérifiez-nous avant de payer',
    verifySub: 'Chaque document ci-dessous est la copie de l’original. Demandez-nous les informations et vérifiez par vous-même.',
    docs: [
      { title: "Certificat de constitution (Hong Kong)", body: "Xin Yuntong China Limited · Certificat n° 76875554 · délivré le 30 juillet 2024 par le registre des sociétés de Hong Kong.", img: '/images/cert-hk-1.webp' },
      { title: "Licence commerciale chinoise", body: "Henan Xinyuntong Automobile Sales Co., Ltd. · Code de crédit social 91410105MA9H1B2U2B · créée le 18 juin 2021 · capital 1 000 000 CNY.", img: '/images/license-cn.webp' },
      { title: "Notre propre concession", body: "Showroom et centre de service agréés SINOTRUK HOWO, avec des camions en stock. Des clients repartent au volant chaque semaine.", img: '/images/4s-store.webp' },
    ],
    who: 'Qui nous sommes',
    facts: [
      ['Entité export', 'Xin Yuntong China Limited (Hong Kong)'],
      ['Opération en Chine', 'Henan Xinyuntong Automobile Sales Co., Ltd.'],
      ['Licence commerciale', '91410105MA9H1B2U2B'],
      ['Création', '2021 (Chine) · 2024 (Hong Kong)'],
      ['Showroom', 'Zhengzhou, Henan — agréé SINOTRUK HOWO'],
      ['Bureau export', 'No. 17668 Panwang Road, Zhangqiu, Jinan, Shandong'],
    ],
    do: 'Ce que nous faisons concrètement',
    services: [
      ['Prix usine, sans intermédiaire', "Nous achetons directement à SINOTRUK, SHACMAN, XCMG et CIMC. Vous voyez la facture usine, nous ajoutons une marge transparente."],
      ['Conduite à droite ou à gauche', "Construit selon le standard de votre pays — RHD pour le Kenya, la Tanzanie, l'Ouganda ; LHD pour l'Algérie, le Nigeria, le Golfe."],
      ["Nous organisons l'expédition", 'FOB, CFR ou CIF jusqu’à votre port. Réservation, chargement et documents pour votre transitaire.'],
      ['Pièces détachées et CKD', "Un conteneur de pièces avec votre première commande. Kits CKD complets si vous voulez assembler localement."],
    ],
    mapTitle: 'Où vont nos camions',
    mapBody: "Afrique, Moyen-Orient et Asie du Sud-Est. Donnez-nous votre port et nous chiffrons CFR en un jour ouvré.",
    ctaTitle: 'Envoyez-nous votre besoin',
    ctaBody: 'Laissez votre WhatsApp — un responsable répond sous 5 minutes pendant les heures ouvrables de Pékin.',
    ctaBtn: 'Obtenir un prix',
    trust: 'Vous pouvez aussi nous demander : un compte bancaire au nom de la société, une connaissance de transport maritime passée, ou un appel vidéo depuis le showroom.',
  },
  ar: {
    nav: 'من نحن',
    h1: 'نحن وكيل ومصدّر مرخّص — لسنا وسيطًا',
    sub: 'مسجّلون في هونغ كونغ، ونُشغّل وكالة SINOTRUK حقيقية في الصين. يمكنك التحقق من الاثنين قبل أن ترسل لنا دولارًا واحدًا.',
    verify: 'تحقق منا قبل الدفع',
    verifySub: 'كل مستند أدناه نسخة عن الأصل. اطلب منا بيانات الشركة وتحقق منها بنفسك.',
    docs: [
      { title: 'شهادة تسجيل شركة هونغ كونغ', body: 'Xin Yuntong China Limited · رقم الشهادة 76875554 · صادرة في 30 يوليو 2024 من سجل الشركات في هونغ كونغ.', img: '/images/cert-hk-1.webp' },
      { title: 'رخصة تجارية صينية', body: 'Henan Xinyuntong Automobile Sales Co., Ltd. · رمز الائتمان الموحد 91410105MA9H1B2U2B · تأسست 18 يونيو 2021 · رأس المال 1,000,000 يوان.', img: '/images/license-cn.webp' },
      { title: 'معرضنا الخاص وليس مكتبًا', body: 'معرض ومركز خدمة معتمد من SINOTRUK HOWO مع شاحنات في المخزون. عملاء يستلمون شاحناتهم كل أسبوع.', img: '/images/4s-store.webp' },
    ],
    who: 'من نحن',
    facts: [
      ['كيان التصدير', 'Xin Yuntong China Limited (هونغ كونغ)'],
      ['العملية في الصين', 'Henan Xinyuntong Automobile Sales Co., Ltd.'],
      ['الرخصة التجارية', '91410105MA9H1B2U2B'],
      ['التأسيس', '2021 (الصين) · 2024 (هونغ كونغ)'],
      ['المعرض', 'تشنغتشو، خنان — معتمد من SINOTRUK HOWO'],
      ['مكتب التصدير', 'رقم 17668 طريق بانوانغ، جانغتشيو، جينان، شاندونغ'],
    ],
    do: 'ما نقدمه لك فعليًا',
    services: [
      ['سعر المصنع بدون وسطاء', 'نشتري مباشرة من SINOTRUK و SHACMAN و XCMG و CIMC. ترى فاتورة المصنع، ونضيف هامشًا واحدًا واضحًا.'],
      ['قيادة يمين أو يسار', 'مصنّعة حسب مواصفات بلدك — يمين لكينيا وتنزانيا وأوغندا، ويسار للجزائر ونيجيريا والخليج.'],
      ['نتولى الشحن', 'FOB أو CFR أو CIF إلى مينائك. نحجز ونُحمّل ونجهّز المستندات التي يحتاجها مخلّصك الجمركي.'],
      ['قطع غيار و CKD', 'حاوية قطع غيار مع طلبك الأول. أطقم CKD كاملة للتجميع المحلي إن أردت.'],
    ],
    mapTitle: 'إلى أين تذهب شاحناتنا',
    mapBody: 'أفريقيا والشرق الأوسط وجنوب شرق آسيا. أخبرنا بمينائك وسنقدم عرض CFR خلال يوم عمل واحد.',
    ctaTitle: 'أرسل لنا متطلباتك',
    ctaBody: 'اترك رقم واتساب — يرد مدير المبيعات خلال 5 دقائق في ساعات عمل بكين.',
    ctaBtn: 'احصل على السعر الآن',
    trust: 'يمكنك أيضًا أن تطلب منا: حسابًا بنكيًا باسم الشركة، أو بوليصة شحن سابقة، أو مكالمة فيديو من المعرض.',
  },
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const t = (T as any)[locale] || T.en;
  return {
    title: t.h1,
    description: t.sub,
    alternates: {
      canonical: `${SITE}/${locale}/about`,
      languages: { en: `${SITE}/en/about`, fr: `${SITE}/fr/about`, ar: `${SITE}/ar/about`, 'x-default': `${SITE}/about` },
    },
    openGraph: {
      title: t.h1,
      description: t.sub,
      url: `${SITE}/${locale}/about`,
      type: 'website',
      images: [{ url: `${SITE}/images/4s-store.webp`, width: 1200, height: 630, alt: t.h1 }],
    },
  };
}

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = (T as any)[locale] || T.en;
  const isRTL = locale === 'ar';

  return (
    <div className="min-h-screen bg-black" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gray-800 pt-28 pb-16">
        <div className="absolute inset-0">
          <img src="/images/4s-store.webp" alt="SINOTRUK HOWO dealership" className="h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-black/40" />
        </div>
        <div className="relative mx-auto max-w-5xl px-6">
          <h1 className="max-w-3xl text-3xl font-bold leading-tight text-white md:text-5xl">{t.h1}</h1>
          <p className="mt-5 max-w-2xl text-base text-gray-300 md:text-lg">{t.sub}</p>
        </div>
      </section>

      {/* 三张硬证据 */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold text-white md:text-3xl">{t.verify}</h2>
        <p className="mt-2 max-w-2xl text-sm text-gray-400">{t.verifySub}</p>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {t.docs.map((d: any) => (
            <div key={d.title} className="overflow-hidden rounded-2xl border border-gray-800 bg-gray-950">
              <a href={d.img} target="_blank" rel="noopener" className="block bg-white">
                <img src={d.img} alt={d.title} className="h-56 w-full object-cover object-top" loading="lazy" />
              </a>
              <div className="p-5">
                <h3 className="font-semibold text-amber-500">{d.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-400">{d.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 公司信息表 */}
      <section className="border-y border-gray-800 bg-gray-950">
        <div className="mx-auto max-w-5xl px-6 py-16">
          <h2 className="text-2xl font-bold text-white md:text-3xl">{t.who}</h2>
          <dl className="mt-6 divide-y divide-gray-800">
            {t.facts.map(([k, v]: any) => (
              <div key={k} className="flex flex-col gap-1 py-3 sm:flex-row sm:gap-6">
                <dt className="w-48 shrink-0 text-sm uppercase tracking-wide text-gray-500">{k}</dt>
                <dd className="text-sm text-gray-200">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* 我们做什么 */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <h2 className="text-2xl font-bold text-white md:text-3xl">{t.do}</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {t.services.map(([h, b]: any) => (
            <div key={h} className="rounded-2xl border border-gray-800 bg-gray-950 p-6">
              <h3 className="font-semibold text-white">{h}</h3>
              <p className="mt-2 text-sm leading-relaxed text-gray-400">{b}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 出口版图 */}
      <section className="border-t border-gray-800 bg-gray-950">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-6 py-16 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold text-white md:text-3xl">{t.mapTitle}</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">{t.mapBody}</p>
            <p className="mt-6 rounded-xl border border-amber-600/40 bg-amber-950/20 p-4 text-sm text-amber-200/90">
              💡 {t.trust}
            </p>
          </div>
          <img src="/images/export-map-2026.webp" alt="Export map" className="w-full rounded-xl border border-gray-800" loading="lazy" />
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-3xl px-6 py-20 text-center">
        <h2 className="text-2xl font-bold text-white md:text-3xl">{t.ctaTitle}</h2>
        <p className="mt-3 text-sm text-gray-400">{t.ctaBody}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <a href="https://wa.me/8619103781257" target="_blank" rel="noopener" className="rounded-lg bg-green-500 px-7 py-3.5 font-bold text-white hover:bg-green-400">
            💬 WhatsApp
          </a>
          <Link href={`/${locale}/heavy-truck`} className="rounded-lg bg-amber-500 px-7 py-3.5 font-bold text-black hover:bg-amber-400">
            {t.ctaBtn}
          </Link>
        </div>
      </section>
    </div>
  );
}
