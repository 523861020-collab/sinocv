// 新闻/文章数据 —— 新文章往数组前面加即可(官网 News 栏目 + 谷歌收录用)
export interface ArticleContent {
  title: string;
  summary: string;
  body: string[];
  bulletsTitle: string;
  bullets: string[];
  specsTitle: string;
  specs: [string, string][];
  ctaTitle: string;
  ctaNote: string;
  backLabel: string;
  dateLabel: string;
}

export interface NewsArticle {
  slug: string;
  date: string; // ISO date
  hero: string;
  heroAlt: string;
  photos: { src: string; alt: string }[];
  content: { en: ArticleContent; fr: ArticleContent };
  metaTitle: { en: string; fr: string };
  metaDesc: { en: string; fr: string };
}

export const newsArticles: NewsArticle[] = [
  {
    slug: 'howo-6x4-400hp-dump-truck-in-stock',
    date: '2026-09-11',
    hero: '/images/news-howo-dump-1.jpg',
    heroAlt: 'HOWO 6x4 400HP dump truck in stock — ready for immediate shipment from China',
    photos: [
      { src: '/images/news-howo-dump-2.jpg', alt: 'HOWO 6x4 dump truck 400HP — front view (in stock for Africa export)' },
      { src: '/images/news-howo-dump-3.jpg', alt: 'HOWO 6x4 dump truck 400HP — side view (reinforced dump body)' },
      { src: '/images/news-howo-dump-4.jpg', alt: 'HOWO 6x4 dump truck 400HP — rear view (EURO 2, ready to ship)' },
    ],
    content: {
      en: {
        title: 'In Stock: HOWO 6x4 400HP Dump Truck — Only 3 Units, Ready to Ship',
        summary:
          'Brand-new HOWO 6x4 dump trucks — identical configuration, only 3 units — now available in our yard in Jinan, China. Ready for immediate shipment to West Africa: first come, first served.',
        body: [
          'Only 3 units (identical configuration) of brand-new HOWO 6x4 dump trucks are available immediately in our yard, ready to be shipped — first come, first served. If you are looking for a powerful tipper at the lowest price on the market, this truck is for you.',
          'This configuration is especially suited to sand, gravel and construction hauling in West Africa: WP12 400HP engine, 6x4 drive, EURO 2 (simple and reliable, adapted to African fuel quality) and a reinforced dump body built for the toughest job sites. Contact us for the exact price and shipping cost to your port.',
        ],
        bulletsTitle: 'Why This Truck',
        bullets: [
          'WP12 400HP engine + 6x4 drive: ideal for sand, gravel and construction hauling',
          'EURO 2: simple and reliable, adapted to African fuel quality — easy maintenance',
          'Reinforced dump body: built for the toughest West African job sites',
          'Brand new, fully inspected — ships immediately upon payment, no factory waiting time',
        ],
        specsTitle: 'Specifications',
        specs: [
          ['Model (nameplate & certificate)', 'ZZ3257V3847B1'],
          ['Cabin', 'HW76 new-face, one bed, A/C'],
          ['Engine', 'WP12S400E201 — 400HP, EURO 2'],
          ['Steering', 'Bosch'],
          ['Transmission', 'HW19710 + HW50 direct-mounted PTO'],
          ['Front axle', 'VGD95 (drum)'],
          ['Rear axle', 'MCP16ZG double (drum), ratio 5.26'],
          ['Tires', '12R22.5 (mixed pattern, 18PR)'],
          ['Others', '400L fuel tank, front & rear lamp guards'],
          ['Dump body', '5600 × 2300 × 1500 mm, floor 8mm / side 6mm, middle-lift, fully waxed'],
        ],
        ctaTitle: 'Only 3 Units — First Come, First Served',
        ctaNote: 'Contact us today for the exact price and shipping cost to your port. Fast reply on WhatsApp.',
        backLabel: 'All News',
        dateLabel: 'September 11, 2026',
      },
      fr: {
        title: 'En stock : camion-benne HOWO 6x4 400CV — seulement 3 unités, prêtes à partir',
        summary:
          "Des camions-bennes HOWO 6x4 neufs (configuration identique, seulement 3 unités) sont disponibles immédiatement dans notre parc à Jinan, en Chine. Prêts à être expédiés vers l'Afrique de l'Ouest — premier arrivé, premier servi.",
        body: [
          "Seulement 3 unités (configuration identique) de camions-bennes HOWO 6x4 neufs sont disponibles immédiatement dans notre parc, prêts à être expédiés — premier arrivé, premier servi. Si vous cherchez une benne puissante au prix le plus bas du marché, ce camion est fait pour vous.",
          "Ce modèle est particulièrement adapté au transport de sable, de gravier et aux chantiers de construction en Afrique de l'Ouest : moteur WP12 400CV, transmission 6x4, norme EURO 2 (simple, fiable, adaptée à la qualité du carburant africain) et benne renforcée pour les chantiers les plus exigeants. Contactez-nous pour le prix exact et le coût du transport vers votre port.",
        ],
        bulletsTitle: 'Pourquoi ce camion',
        bullets: [
          'Moteur WP12 400CV + transmission 6x4 : idéal pour sable, gravier et chantiers',
          'EURO 2 : simple et fiable, adapté au carburant africain — entretien facile',
          "Benne renforcée : conçue pour les chantiers les plus durs d'Afrique de l'Ouest",
          "Neuf, entièrement inspecté — expédition immédiate dès réception du paiement, pas d'attente à l'usine",
        ],
        specsTitle: 'Fiche technique',
        specs: [
          ['Modèle (plaque & certificat)', 'ZZ3257V3847B1'],
          ['Cabine', 'HW76 nouveau visage, un lit, climatisation'],
          ['Moteur', 'WP12S400E201 — 400CV, EURO 2'],
          ['Direction', 'Bosch'],
          ['Boîte de vitesses', 'HW19710 + prise de force HW50'],
          ['Essieu avant', 'VGD95 (tambour)'],
          ['Essieu arrière', 'MCP16ZG double (tambour), rapport 5.26'],
          ['Pneus', '12R22.5 (dessin mixte, 18PR)'],
          ['Autres', 'réservoir 400L, protège-phares AV/AR'],
          ['Benne', '5600 × 2300 × 1500 mm, fond 8 mm / côtés 6 mm, vérin central, traitement cire'],
        ],
        ctaTitle: 'Seulement 3 unités — premier arrivé, premier servi',
        ctaNote: 'Contactez-nous aujourd’hui pour le prix exact et le coût du transport vers votre port. Réponse rapide sur WhatsApp.',
        backLabel: 'Toutes les actualités',
        dateLabel: '11 septembre 2026',
      },
    },
    metaTitle: {
      en: 'HOWO 6x4 400HP Dump Truck In Stock — Only 3 Units, Ready to Ship | XINYUNTONG',
      fr: 'Camion-benne HOWO 6x4 400CV en stock — 3 unités, expédition immédiate | XINYUNTONG',
    },
    metaDesc: {
      en: 'Brand-new HOWO 6x4 400HP dump trucks (EURO 2, reinforced dump body) in stock in China. Only 3 units — ready for immediate shipment to Africa & the Middle East. Get the price on WhatsApp.',
      fr: "Camions-bennes HOWO 6x4 neufs (EURO 2, benne renforcée) en stock en Chine. Seulement 3 unités — expédition immédiate vers l'Afrique. Prix sur WhatsApp.",
    },
  },
];

export function getNewsArticle(slug: string): NewsArticle | undefined {
  return newsArticles.find((a) => a.slug === slug);
}
