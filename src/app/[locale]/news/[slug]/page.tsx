import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getNewsArticle, newsArticles } from '@/data/news';

type Params = Promise<{ locale: string; slug: string }>;

export function generateStaticParams() {
  return newsArticles.flatMap((a) => [
    { locale: 'en', slug: a.slug },
    { locale: 'fr', slug: a.slug },
    { locale: 'ar', slug: a.slug },
  ]);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = getNewsArticle(slug);
  if (!article) return {};
  const isFr = locale === 'fr';
  return {
    title: article.metaTitle[isFr ? 'fr' : 'en'],
    description: article.metaDesc[isFr ? 'fr' : 'en'],
    alternates: { canonical: `https://sinocv.com/${locale}/news/${slug}` },
  };
}

export default async function NewsArticlePage({ params }: { params: Params }) {
  const { locale, slug } = await params;
  const article = getNewsArticle(slug);
  if (!article) notFound();
  const isFr = locale === 'fr';
  const c = isFr ? article.content.fr : article.content.en;

  return (
    <article className="bg-black" style={{ paddingTop: '2.5rem', paddingBottom: '3rem' }}>
      <div className="px-6 lg:px-16 max-w-[1920px] mx-auto">
        <div style={{ maxWidth: '920px', margin: '0 auto' }}>
          <Link href={`/${locale}/news`} className="text-amber-500 hover:text-amber-400 text-sm">
            ← {c.backLabel}
          </Link>
          <div className="text-gray-500 text-sm" style={{ marginTop: '1.5rem' }}>
            {c.dateLabel}
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white" style={{ marginTop: '0.5rem', lineHeight: 1.3 }}>
            {c.title}
          </h1>
          <p className="text-gray-400 text-lg" style={{ marginTop: '1rem', lineHeight: 1.7 }}>
            {c.summary}
          </p>

          <div className="rounded-2xl overflow-hidden border border-gray-800" style={{ marginTop: '1.5rem' }}>
            <img src={article.hero} alt={article.heroAlt} className="w-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3" style={{ marginTop: '0.75rem' }}>
            {article.photos.map((p) => (
              <div key={p.src} className="rounded-xl overflow-hidden border border-gray-800">
                <img src={p.src} alt={p.alt} className="w-full" loading="lazy" />
              </div>
            ))}
          </div>

          {c.body.map((para, i) => (
            <p key={i} className="text-gray-300" style={{ marginTop: '1.25rem', lineHeight: 1.8 }}>
              {para}
            </p>
          ))}

          <h2 className="text-2xl font-bold text-white" style={{ marginTop: '2.5rem' }}>
            {c.bulletsTitle}
          </h2>
          <ul style={{ marginTop: '1rem' }}>
            {c.bullets.map((b, i) => (
              <li key={i} className="text-gray-300" style={{ marginTop: '0.6rem', lineHeight: 1.7 }}>
                <span className="text-green-400 font-bold">✓</span> {b}
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold text-white" style={{ marginTop: '2.5rem' }}>
            {c.specsTitle}
          </h2>
          <div className="rounded-xl border border-gray-800 overflow-hidden" style={{ marginTop: '1rem' }}>
            {c.specs.map(([k, v], i) => (
              <div
                key={k}
                className={i % 2 === 0 ? 'bg-gray-900' : 'bg-gray-900/40'}
                style={{ display: 'flex', flexWrap: 'wrap' }}
              >
                <div className="text-amber-500/90 text-sm font-medium px-4 py-3" style={{ minWidth: '200px', maxWidth: '240px', flex: '0 0 auto' }}>
                  {k}
                </div>
                <div className="text-gray-300 text-sm px-4 py-3" style={{ flex: 1, minWidth: '240px' }}>
                  {v}
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl border border-amber-500/30 bg-gray-900" style={{ marginTop: '2.5rem', padding: '1.5rem' }}>
            <div className="text-white text-xl font-bold">{c.ctaTitle}</div>
            <p className="text-gray-400" style={{ marginTop: '0.5rem', lineHeight: 1.7 }}>
              {c.ctaNote}
            </p>
            <div className="flex flex-wrap gap-3" style={{ marginTop: '1.25rem' }}>
              <a
                href="https://wa.me/8619103781257"
                target="_blank"
                className="rounded-md bg-green-500 px-6 py-3 font-semibold text-white hover:bg-green-400 transition-colors"
              >
                💬 WhatsApp: +86 191 0378 1257
              </a>
              <a
                href="mailto:lishanlong@sinocv.com"
                className="rounded-md border border-gray-700 px-6 py-3 font-semibold text-gray-200 hover:border-amber-500 transition-colors"
              >
                ✉️ lishanlong@sinocv.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
