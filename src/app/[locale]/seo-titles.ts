// 2026-11-01 各分类页独立 SEO 标题/描述（搜索引擎按标题判断页面内容，原来 6 个页面共用一个标题）
// 2026-11-01 补：法语/阿语页面原来复用英文标题——谷歌会把它们当成英文页面的重复内容，
// 法语和阿拉伯语客户在谷歌搜索时也匹配不到母语词。以下三语各写一套。
export const ZONE_SEO: Record<string, Record<string, { title: string; desc: string }>> = {
  'heavy-truck': {
    en: {
      title: 'HOWO SITRAK Heavy Trucks for Sale — 6x4 Tractor, Dump, Mixer, Cargo | China Export',
      desc: 'SINOTRUK HOWO TX / NX and SITRAK heavy trucks for export: 6x4 tractor 380-480hp, dump truck, mixer, cargo, reefer, fuel tanker, 6x6 off-road. Factory price, CFR Africa & Middle East.',
    },
    fr: {
      title: 'Camions lourds HOWO SITRAK à vendre — tracteur 6x4, benne, malaxeur | Export Chine',
      desc: "Camions lourds SINOTRUK HOWO TX / NX et SITRAK pour l'export : tracteur 6x4 380-480ch, benne basculante, malaxeur, plateau, frigorifique, citerne, 6x6 tout-terrain. Prix usine, CFR Afrique et Moyen-Orient.",
    },
    ar: {
      title: 'شاحنات HOWO SITRAK الثقيلة للبيع — رأس قاطرة 6x4، قلابة، خلاطة | تصدير من الصين',
      desc: 'شاحنات SINOTRUK HOWO TX / NX و SITRAK الثقيلة للتصدير: رأس قاطرة 6x4 بقوة 380-480 حصان، قلابة، خلاطة، صندوق، مبردة، صهريج وقود، و6x6 للطرق الوعرة. سعر المصنع، CFR إلى أفريقيا والشرق الأوسط.',
    },
  },
  machinery: {
    en: {
      title: 'XCMG Excavator, Wheel Loader, Crane for Sale | China Machinery Export',
      desc: 'XCMG excavators (XE215, XE370), wheel loaders (ZL50), rollers and cranes for export. Container shipping, spare parts and technical support for Africa and Middle East projects.',
    },
    fr: {
      title: 'Pelle XCMG, chargeuse, grue à vendre | Export de machines de Chine',
      desc: "Pelles XCMG (XE215, XE370), chargeuses sur pneus (ZL50), compacteurs et grues pour l'export. Expédition en conteneur, pièces détachées et support technique pour projets en Afrique et au Moyen-Orient.",
    },
    ar: {
      title: 'حفارات XCMG، لودر، رافعة للبيع | تصدير معدات من الصين',
      desc: 'حفارات XCMG (XE215، XE370)، لودرات (ZL50)، مداحل ورافعات للتصدير. شحن بالحاويات، قطع غيار ودعم فني لمشاريع أفريقيا والشرق الأوسط.',
    },
  },
  mining: {
    en: {
      title: 'Mining Dump Trucks 70-105 Ton Wide Body | SINOTRUK Export Supplier',
      desc: 'SINOTRUK wide-body mining dump trucks 70T / 90T / 105T for coal, gold and copper mines. Reinforced chassis, CKD shipping, on-site after-sales support.',
    },
    fr: {
      title: 'Camions miniers 70-105 tonnes benne large | Fournisseur export SINOTRUK',
      desc: "Camions miniers SINOTRUK à benne large 70T / 90T / 105T pour mines de charbon, d'or et de cuivre. Châssis renforcé, expédition CKD, service après-vente sur site.",
    },
    ar: {
      title: 'شاحنات قلابة تعدين 70-105 طن هيكل عريض | مورد تصدير SINOTRUK',
      desc: 'شاحنات قلابة تعدين SINOTRUK بهيكل عريض 70 طن / 90 طن / 105 طن لمناجم الفحم والذهب والنحاس. شاسيه معزز، شحن CKD، وخدمة ما بعد البيع في الموقع.',
    },
  },
  trailers: {
    en: {
      title: 'CIMC Semi Trailers for Sale — Flatbed, Low Bed, Sidewall, Tanker | China Export',
      desc: 'CIMC semi-trailers for export: 3-axle flatbed, low-bed, sidewall, 40ft container and dump trailers. 13T axles, BPW / FUWA options, CFR to Africa and Middle East.',
    },
    fr: {
      title: 'Semi-remorques CIMC à vendre — plateau, surbaissée, ridelles, citerne | Export Chine',
      desc: "Semi-remorques CIMC pour l'export : plateau 3 essieux, surbaissée, ridelles, porte-conteneur 40 pieds et benne. Essieux 13T, options BPW / FUWA, CFR Afrique et Moyen-Orient.",
    },
    ar: {
      title: 'مقطورات CIMC للبيع — مسطحة، منخفضة، بجوانب، صهريج | تصدير من الصين',
      desc: 'مقطورات CIMC للتصدير: مسطحة 3 محاور، منخفضة، بجوانب، حاملة حاويات 40 قدم، وقلابة. محاور 13 طن، خيارات BPW / FUWA، CFR إلى أفريقيا والشرق الأوسط.',
    },
  },
  light: {
    en: {
      title: 'Light Trucks & Vans for Sale — HOWO Light, FOTON, IVECO | China Export',
      desc: 'HOWO light cargo trucks, FOTON and IVECO vans for distribution, cold chain and passenger transport. Left and right-hand drive, CKD kits available.',
    },
    fr: {
      title: 'Camions légers et fourgons à vendre — HOWO Light, FOTON, IVECO | Export Chine',
      desc: "Camions légers HOWO, fourgons FOTON et IVECO pour la distribution, la chaîne du froid et le transport de passagers. Conduite à gauche et à droite, kits CKD disponibles.",
    },
    ar: {
      title: 'شاحنات خفيفة وفانات للبيع — HOWO Light، FOTON، IVECO | تصدير من الصين',
      desc: 'شاحنات HOWO الخفيفة، فانات FOTON و IVECO للتوزيع وسلسلة التبريد ونقل الركاب. قيادة يسرى ويمنى، وأطقم CKD متوفرة.',
    },
  },
};

export const SITE = 'https://www.sinocv.com';

const OG_IMAGE = {
  url: `${SITE}/images/og-cover.jpg`,
  width: 1200,
  height: 630,
  alt: 'XINYUNTONG — Chinese trucks & machinery exporter',
};

// 每个分类页配一张真实车型图作为社交分享封面（客户转发到 WhatsApp 时能看到车）
const ZONE_OG: Record<string, string> = {
  'heavy-truck': '/images/stk-sitrak-dump-1.webp',
  machinery: '/images/xcmg-xe215-1.webp',
  mining: '/images/sinotruk-90t-mining-1.webp',
  trailers: '/images/sinotruk-3axle-cargo-1.webp',
  light: '/images/sinotruk-cargo-light-1.webp',
};

export function zoneMeta(key: string, locale: string) {
  const set = ZONE_SEO[key] || ZONE_SEO['heavy-truck'];
  const m = set[locale] || set.en;
  const img = ZONE_OG[key] ? `${SITE}${ZONE_OG[key]}` : OG_IMAGE.url;
  return {
    title: m.title,
    description: m.desc,
    alternates: {
      canonical: `${SITE}/${locale}/${key}`,
      languages: {
        en: `${SITE}/en/${key}`,
        fr: `${SITE}/fr/${key}`,
        ar: `${SITE}/ar/${key}`,
        'x-default': `${SITE}/${key}`,
      },
    },
    openGraph: {
      title: m.title,
      description: m.desc,
      url: `${SITE}/${locale}/${key}`,
      type: 'website' as const,
      locale: locale === 'fr' ? 'fr_FR' : locale === 'ar' ? 'ar_SA' : 'en_US',
      images: [{ url: img, width: 1200, height: 630, alt: m.title }],
    },
    twitter: {
      card: 'summary_large_image' as const,
      title: m.title,
      description: m.desc,
      images: [img],
    },
  };
}
