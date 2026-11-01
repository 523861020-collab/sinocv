// 2026-11-01 各分类页独立 SEO 标题/描述（搜索引擎按标题判断页面内容，原来 6 个页面共用一个标题）
export const ZONE_SEO: Record<string, { title: string; desc: string }> = {
  'heavy-truck': {
    title: 'HOWO SITRAK Heavy Trucks for Sale — 6x4 Tractor, Dump, Mixer, Cargo | China Export',
    desc: 'SINOTRUK HOWO TX / NX and SITRAK heavy trucks for export: 6x4 tractor 380-480hp, dump truck, mixer, cargo, reefer, fuel tanker, 6x6 off-road. Factory price, CFR Africa & Middle East.',
  },
  machinery: {
    title: 'XCMG Excavator, Wheel Loader, Crane for Sale | China Machinery Export',
    desc: 'XCMG excavators (XE215, XE370), wheel loaders (ZL50), rollers and cranes for export. Container shipping, spare parts and technical support for Africa and Middle East projects.',
  },
  mining: {
    title: 'Mining Dump Trucks 70-105 Ton Wide Body | SINOTRUK Export Supplier',
    desc: 'SINOTRUK wide-body mining dump trucks 70T / 90T / 105T for coal, gold and copper mines. Reinforced chassis, CKD shipping, on-site after-sales support.',
  },
  trailers: {
    title: 'CIMC Semi Trailers for Sale — Flatbed, Low Bed, Sidewall, Tanker | China Export',
    desc: 'CIMC semi-trailers for export: 3-axle flatbed, low-bed, sidewall, 40ft container and dump trailers. 13T axles, BPW / FUWA options, CFR to Africa and Middle East.',
  },
  light: {
    title: 'Light Trucks & Vans for Sale — HOWO Light, FOTON, IVECO | China Export',
    desc: 'HOWO light cargo trucks, FOTON and IVECO vans for distribution, cold chain and passenger transport. Left and right-hand drive, CKD kits available.',
  },
};

export const SITE = 'https://www.sinocv.com';

export function zoneMeta(key: string, locale: string) {
  const m = ZONE_SEO[key];
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
    openGraph: { title: m.title, description: m.desc, url: `${SITE}/${locale}/${key}`, type: 'website' as const },
  };
}
