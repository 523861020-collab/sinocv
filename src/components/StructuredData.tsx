// 结构化数据（JSON-LD）：让谷歌/必应准确理解「我们是谁、卖什么、在哪、运到哪」。
// 2026-11-01 新增。这是自然搜索能不能出「富摘要」的关键，也是 AI 搜索引用的依据。
// 三语言通用：Organization + WebSite + 主要产品线。
export default function StructuredData({ locale }: { locale: string }) {
  const base = 'https://www.sinocv.com';
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${base}/#org`,
        name: 'XINYUNTONG CHINA Co., Ltd.',
        alternateName: ['鑫运通中国有限公司', 'HENAN XINYUNTONG AUTOMOBILE SALES CO., LTD.'],
        url: `${base}/${locale}`,
        logo: `${base}/images/logo-nav.webp`,
        description:
          'Chinese heavy duty trucks and construction machinery exporter. SINOTRUK HOWO, SITRAK, SHACMAN, XCMG. FOB and CIF shipping to Africa, Middle East, Southeast Asia, South America.',
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Panwang Road 17668, Zhangqiu District',
          addressLocality: 'Jinan',
          addressRegion: 'Shandong',
          addressCountry: 'CN',
        },
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: '+86-130-0197-7959',
            contactType: 'sales',
            availableLanguage: ['en', 'fr', 'ar', 'zh'],
            areaServed: ['Africa', 'Middle East', 'Southeast Asia', 'South America'],
          },
        ],
        sameAs: [`${base}/en`],
      },
      {
        '@type': 'WebSite',
        '@id': `${base}/#website`,
        url: `${base}/${locale}`,
        name: 'SINOCV — Chinese Trucks & Machinery Export',
        publisher: { '@id': `${base}/#org` },
        inLanguage: locale,
      },
      {
        '@type': 'ItemList',
        name: 'Main product lines',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'SINOTRUK HOWO / SITRAK heavy duty trucks (tractor, dump, mixer, cargo)' },
          { '@type': 'ListItem', position: 2, name: 'XCMG construction machinery (excavator, wheel loader, crane, roller)' },
          { '@type': 'ListItem', position: 3, name: 'CIMC semi trailers (flatbed, low bed, sidewall, tanker)' },
          { '@type': 'ListItem', position: 4, name: 'Wide-body mining dump trucks 70-105 tons' },
          { '@type': 'ListItem', position: 5, name: 'Light vehicles and vans (FOTON, IVECO Daily)' },
        ],
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // 结构化数据是纯静态常量，无用户输入，安全
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
