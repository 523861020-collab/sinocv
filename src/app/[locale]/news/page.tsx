import type { Metadata } from 'next';
import Link from 'next/link';
import { newsArticles } from '@/data/news';

type Params = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  return {
    title: isFr ? 'Actualités & offres en stock | XINYUNTONG China' : 'News & In-Stock Offers | XINYUNTONG China',
    description: isFr
      ? "Dernières nouveautés, offres de stock et départs immédiats de XINYUNTONG China — camions, engins et remorques."
      : 'Latest stock offers, ready-to-ship trucks, machinery and trailers from XINYUNTONG China.',
    alternates: { canonical: `https://sinocv.com/${locale}/news` },
  };
}

export default async function NewsListPage({ params }: { params: Params }) {
  const { locale } = await params;
  const isFr = locale === 'fr';
  const heading = isFr ? 'Actualités & Offres en stock' : 'News & In-Stock Offers';
  const sub = isFr
    ? 'Dernières nouveautés et offres de stock de XINYUNTONG China.'
    : 'Latest stock offers and updates from XINYUNTONG China.';
  const readMore = isFr ? 'Lire la suite' : 'Read more';

  return (
    <div className="bg-black" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div className="px-6 lg:px-16 max-w-[1920px] mx-auto">
        <div className="text-center" style={{ marginBottom: '2.5rem' }}>
          <h1 className="text-4xl md:text-5xl font-bold text-white">{heading}</h1>
          <p className="text-gray-400 text-lg" style={{ marginTop: '0.75rem' }}>
            {sub}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {newsArticles.map((a) => {
            const c = isFr ? a.content.fr : a.content.en;
            return (
              <Link
                key={a.slug}
                href={`/${locale}/news/${a.slug}`}
                className="rounded-2xl overflow-hidden bg-gray-900 border border-gray-800 hover:border-amber-500/40 transition-colors group"
              >
                <div className="relative h-52 overflow-hidden bg-gray-800">
                  <img
                    src={a.hero}
                    alt={a.heroAlt}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    loading="lazy"
                  />
                </div>
                <div style={{ padding: '1rem' }}>
                  <div className="text-gray-500 text-xs">{c.dateLabel}</div>
                  <h2 className="text-white font-bold text-lg" style={{ marginTop: '0.5rem', lineHeight: 1.4 }}>
                    {c.title}
                  </h2>
                  <p className="text-gray-400 text-sm" style={{ marginTop: '0.5rem', lineHeight: 1.6 }}>
                    {c.summary}
                  </p>
                  <div className="text-amber-500 text-sm font-medium" style={{ marginTop: '0.75rem' }}>
                    {readMore} →
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
