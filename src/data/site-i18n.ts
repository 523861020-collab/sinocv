// 首页主体文案三语表（2026-11-01）
// 背景：原来 Hero / 优势卡 / 公司介绍 / 促销区 全部硬编码英文，
// 导致 /fr 和 /ar 页面框架是法语阿语、正文是英文（统计约 78% 为英文）。
// 品牌名与车型型号（SINOTRUK / HOWO / XCMG / ZL50 / 6×4）保持英文不译——
// 客户在谷歌和 WhatsApp 上就是用这些英文型号搜车。

export type Locale = 'en' | 'fr' | 'ar';

export const SITE_CONTENT = {
  en: {
    navTagline: ['One-Stop Sourcing for', 'Commercial Vehicles'],
    waLabel: 'Chat on WhatsApp',
    hero: {
      ctaProducts: 'View Products',
      ctaQuote: 'Get Quote',
      slides: [
        { title: 'SINOTRUK Tractor Truck', subtitle: 'HOWO / SITRAK · German MAN Technology', desc: 'Weichai engine, 6×4 drive, 30 years of heavy truck export experience' },
        { title: 'XCMG Excavator', subtitle: 'XCMG · China\'s #1 Construction Machinery', desc: 'XE215 Excavator, ZL50 Loader — mining, infrastructure, municipal projects' },
        { title: 'Mining Dump Truck', subtitle: 'SINOTRUK · 70-105T Wide-body Mining Trucks', desc: '40-45 ton payload, reinforced chassis, built for harsh mining conditions' },
        { title: 'CIMC Trailer', subtitle: 'CIMC · Global #1 Trailer Manufacturer', desc: 'Flatbed trailers, dump trailers — 13-ton axles, durable and dependable' },
        { title: 'SINOTRUK Light Vehicles', subtitle: 'SINOTRUK · Urban Logistics Expert', desc: 'Light Vehicles — fuel-efficient, spacious, and reliable for cargo delivery' }
      ]
    },
    why: { kicker: 'WHY CHOOSE US', title: 'Our Advantages', sub: '6 Major Brands · One-Stop Sourcing — SINOTRUK + SHACMAN + XCMG + CIMC + FOTON + IVECO' },
    advantages: [
      { title: 'Full Brand Portfolio', desc: 'SINOTRUK + XCMG + CIMC — Three major brands, one-stop sourcing' },
      { title: 'Competitive Price', desc: 'Factory-direct supply, no middlemen, competitive export pricing' },
      { title: 'After-sales Service', desc: '1-3 year warranty (model-dependent), overseas service network, fast parts supply, remote technical support' },
      { title: 'Customization', desc: 'Custom configuration, color, and branding to meet specific market requirements' }
    ],
    promo: { title: 'Promotions', sub: 'In-Stock · Ready to Ship · No Production Wait', hot: 'Hot', cta: 'Inquire Now →' },
    products: { title: 'Products', sub: '5 Categories · One-Stop Sourcing' },
    about: {
      title: 'About Us',
      h3: 'About HENAN XINYUNTONG AUTOMOBILE SALES CO., LTD.',
      p1: 'HENAN XINYUNTONG AUTOMOBILE SALES CO., LTD. is dedicated to providing superior services to global truck users. As a professional commercial vehicle export enterprise, we specialize in exporting Chinese heavy-duty trucks and construction machinery. Backed by a comprehensive supply chain and complete export qualifications, we deliver high-quality, smart manufacturing from China to the world.',
      p2: 'We offer not only one-stop procurement services covering complete vehicles and spare parts but also a robust after-sales support system, ensuring a hassle-free, efficient, and seamless cross-border purchasing experience for every client.',
      mission: 'Customer-focused, quality-driven — to provide the finest Chinese commercial vehicles and construction machinery to global customers and become a trusted long-term partner.',
      missionLabel: 'Our Mission:'
    },
    zones: {
      'heavy-truck': { title: 'Heavy Duty Trucks', desc: 'Tractors · Cargo · Dump · Mixer · Reefer · Crane · Water · Fuel · 6×6' },
      'machinery': { title: 'Construction Machinery', desc: 'Excavators · Loaders · Cranes · Bulldozers · Rollers' },
      'mining': { title: 'Mining Trucks', desc: '70-105T wide-body mining dump trucks, reinforced for harsh sites' },
      'trailers': { title: 'Trailers', desc: 'Flatbed · Lowbed · Dump · Skeleton · Fuel tanker' },
      'light': { title: 'Light Vehicles', desc: 'Light trucks · Vans · Pickups for urban logistics' }
    }
  },

  fr: {
    navTagline: ['Approvisionnement centralisé', 'véhicules utilitaires'],
    waLabel: 'Discuter sur WhatsApp',
    hero: {
      ctaProducts: 'Voir les produits',
      ctaQuote: 'Demander un devis',
      slides: [
        { title: 'Tracteur routier SINOTRUK', subtitle: 'HOWO / SITRAK · Technologie MAN allemande', desc: 'Moteur Weichai, transmission 6×4, 30 ans d\'expérience à l\'export de poids lourds' },
        { title: 'Pelle hydraulique XCMG', subtitle: 'XCMG · N°1 chinois des engins de construction', desc: 'Pelle XE215, chargeuse ZL50 — mines, infrastructures, projets municipaux' },
        { title: 'Camion minier benne', subtitle: 'SINOTRUK · Camions miniers wide-body 70-105T', desc: 'Charge utile 40-45 tonnes, châssis renforcé, conçu pour les mines difficiles' },
        { title: 'Remorque CIMC', subtitle: 'CIMC · N°1 mondial de la remorque', desc: 'Remorques plateau et bennes — essieux 13 tonnes, robustes et fiables' },
        { title: 'Véhicules légers SINOTRUK', subtitle: 'SINOTRUK · Expert de la logistique urbaine', desc: 'Véhicules légers — économes en carburant, spacieux et fiables pour la livraison' }
      ]
    },
    why: { kicker: 'POURQUOI NOUS CHOISIR', title: 'Nos avantages', sub: '6 grandes marques · Approvisionnement centralisé — SINOTRUK + SHACMAN + XCMG + CIMC + FOTON + IVECO' },
    advantages: [
      { title: 'Portefeuille complet de marques', desc: 'SINOTRUK + XCMG + CIMC — trois grandes marques, approvisionnement centralisé' },
      { title: 'Prix compétitifs', desc: 'Approvisionnement direct usine, sans intermédiaires, tarifs export compétitifs' },
      { title: 'Service après-vente', desc: 'Garantie 1 à 3 ans (selon modèle), réseau de service à l\'étranger, pièces disponibles rapidement, assistance technique à distance' },
      { title: 'Personnalisation', desc: 'Configuration, couleur et marquage sur mesure selon les exigences du marché' }
    ],
    promo: { title: 'Promotions', sub: 'En stock · Prêt à expédier · Sans délai de production', hot: 'Offre', cta: 'Demander maintenant →' },
    products: { title: 'Produits', sub: '5 catégories · Approvisionnement centralisé' },
    about: {
      title: 'À propos',
      h3: 'À propos de HENAN XINYUNTONG AUTOMOBILE SALES CO., LTD.',
      p1: 'HENAN XINYUNTONG AUTOMOBILE SALES CO., LTD. s\'engage à offrir des services de premier ordre aux utilisateurs de camions dans le monde entier. En tant qu\'entreprise professionnelle d\'exportation de véhicules utilitaires, nous sommes spécialisés dans l\'exportation de poids lourds et d\'engins de construction chinois. Forts d\'une chaîne d\'approvisionnement complète et de toutes les qualifications à l\'export, nous livrons une fabrication chinoise de haute qualité et intelligente partout dans le monde.',
      p2: 'Nous proposons non seulement des services d\'achat centralisés couvrant véhicules complets et pièces détachées, mais aussi un solide système d\'après-vente, garantissant à chaque client une expérience d\'achat transfrontalière simple, efficace et sans tracas.',
      mission: 'Centrés sur le client, guidés par la qualité — fournir les meilleurs véhicules utilitaires et engins de construction chinois aux clients du monde entier et devenir un partenaire de confiance sur le long terme.',
      missionLabel: 'Notre mission :'
    },
    zones: {
      'heavy-truck': { title: 'Poids lourds', desc: 'Tracteurs · Porteurs · Bennes · Malaxeurs · Frigorifiques · Grues · Citernes · 6×6' },
      'machinery': { title: 'Engins de construction', desc: 'Pelles · Chargeuses · Grues · Bulldozers · Compacteurs' },
      'mining': { title: 'Camions miniers', desc: 'Camions bennes miniers wide-body 70-105T, renforcés pour sites difficiles' },
      'trailers': { title: 'Remorques', desc: 'Plateau · Surbaissée · Benne · Squelette · Citerne' },
      'light': { title: 'Véhicules légers', desc: 'Camions légers · Fourgons · Pick-up pour la logistique urbaine' }
    }
  },

  ar: {
    navTagline: ['توريد من مصدر واحد', 'للمركبات التجارية'],
    waLabel: 'تواصل عبر واتساب',
    hero: {
      ctaProducts: 'عرض المنتجات',
      ctaQuote: 'اطلب عرض سعر',
      slides: [
        { title: 'شاحنة رأس جرار SINOTRUK', subtitle: 'HOWO / SITRAK · تقنية MAN الألمانية', desc: 'محرك Weichai، دفع 6×4، 30 عامًا من الخبرة في تصدير الشاحنات الثقيلة' },
        { title: 'حفارة XCMG', subtitle: 'XCMG · الأولى في الصين في معدات البناء', desc: 'حفارة XE215، لودر ZL50 — التعدين والبنية التحتية والمشاريع البلدية' },
        { title: 'شاحنة قلابة للتعدين', subtitle: 'SINOTRUK · شاحنات تعدين عريضة 70-105 طن', desc: 'حمولة 40-45 طنًا، هيكل معزز، مصممة لظروف التعدين القاسية' },
        { title: 'مقطورة CIMC', subtitle: 'CIMC · الأولى عالميًا في صناعة المقطورات', desc: 'مقطورات مسطحة وقلابة — محاور 13 طنًا، متينة وموثوقة' },
        { title: 'مركبات SINOTRUK الخفيفة', subtitle: 'SINOTRUK · خبير اللوجستيات الحضرية', desc: 'مركبات خفيفة — اقتصادية في الوقود، واسعة وموثوقة لتوصيل البضائع' }
      ]
    },
    why: { kicker: 'لماذا تختارنا', title: 'مزايانا', sub: '6 علامات تجارية كبرى · توريد من مصدر واحد — SINOTRUK + SHACMAN + XCMG + CIMC + FOTON + IVECO' },
    advantages: [
      { title: 'تشكيلة علامات تجارية كاملة', desc: 'SINOTRUK + XCMG + CIMC — ثلاث علامات كبرى، توريد من مصدر واحد' },
      { title: 'أسعار تنافسية', desc: 'توريد مباشر من المصنع، بدون وسطاء، أسعار تصدير تنافسية' },
      { title: 'خدمة ما بعد البيع', desc: 'ضمان من سنة إلى 3 سنوات (حسب الطراز)، شبكة خدمة في الخارج، توفير سريع لقطع الغيار، دعم فني عن بُعد' },
      { title: 'تخصيص حسب الطلب', desc: 'تكوين ولون وعلامة تجارية مخصصة وفقًا لمتطلبات السوق' }
    ],
    promo: { title: 'عروض خاصة', sub: 'متوفر في المخزون · جاهز للشحن · بدون انتظار للإنتاج', hot: 'الأكثر طلبًا', cta: 'استفسر الآن ←' },
    products: { title: 'المنتجات', sub: '5 فئات · توريد من مصدر واحد' },
    about: {
      title: 'من نحن',
      h3: 'عن شركة HENAN XINYUNTONG AUTOMOBILE SALES CO., LTD.',
      p1: 'تلتزم شركة HENAN XINYUNTONG AUTOMOBILE SALES CO., LTD. بتقديم خدمات متميزة لمستخدمي الشاحنات حول العالم. وبصفتنا شركة متخصصة في تصدير المركبات التجارية، نتخصص في تصدير الشاحنات الثقيلة الصينية ومعدات البناء. وبفضل سلسلة توريد متكاملة ومؤهلات تصدير كاملة، نوصل التصنيع الصيني الذكي عالي الجودة إلى العالم.',
      p2: 'لا نقدم فقط خدمات شراء متكاملة تشمل المركبات الكاملة وقطع الغيار، بل أيضًا نظام دعم قوي لما بعد البيع، بما يضمن لكل عميل تجربة شراء عابرة للحدود سهلة وفعالة ودون متاعب.',
      mission: 'التركيز على العميل والجودة أولًا — تقديم أفضل المركبات التجارية ومعدات البناء الصينية للعملاء حول العالم وأن نكون شريكًا موثوقًا على المدى الطويل.',
      missionLabel: 'مهمتنا:'
    },
    zones: {
      'heavy-truck': { title: 'الشاحنات الثقيلة', desc: 'رؤوس جرارة · شاحنات نقل · قلابة · خلاطة · مبردة · رافعة · صهريج ماء · صهريج وقود · 6×6' },
      'machinery': { title: 'معدات البناء', desc: 'حفارات · لودرات · رافعات · جرافات · مداحل' },
      'mining': { title: 'شاحنات التعدين', desc: 'شاحنات قلابة تعدين عريضة 70-105 طن، معززة للمواقع القاسية' },
      'trailers': { title: 'المقطورات', desc: 'مسطحة · منخفضة · قلابة · هيكلية · صهريج وقود' },
      'light': { title: 'المركبات الخفيفة', desc: 'شاحنات خفيفة · فان · بيك أب للوجستيات الحضرية' }
    }
  }
} as const;

export function content(locale: string) {
  return SITE_CONTENT[(locale === 'fr' || locale === 'ar' ? locale : 'en') as Locale];
}
