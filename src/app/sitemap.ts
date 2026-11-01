import type { MetadataRoute } from 'next'
import { newsArticles } from '@/data/news'

// 2026-11-01: 原来只有 8 条，而且分类页写的是会被 307 跳转的短地址；
// 现在把 3 个语言 × 7 个栏目全部列出，并带上三语言 alternate，方便谷歌收录。
export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.sinocv.com'
  const locales = ['en', 'fr', 'ar']
  const paths = ['', '/heavy-truck', '/machinery', '/mining', '/trailers', '/light', '/news']

  const pages: MetadataRoute.Sitemap = []
  for (const p of paths) {
    for (const l of locales) {
      pages.push({
        url: `${baseUrl}/${l}${p}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: p === '' ? 1 : 0.8,
        alternates: {
          languages: Object.fromEntries(locales.map((x) => [x, `${baseUrl}/${x}${p}`])),
        },
      })
    }
  }

  const newsEntries: MetadataRoute.Sitemap = newsArticles.flatMap((a) =>
    locales.map((l) => ({
      url: `${baseUrl}/${l}/news/${a.slug}`,
      lastModified: new Date(a.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  )

  return [...pages, ...newsEntries]
}
