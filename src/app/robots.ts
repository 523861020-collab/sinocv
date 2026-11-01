import type { MetadataRoute } from 'next';

// 2026-11-01: 加一层爬虫过滤。
// 谷歌/必应等主流搜索照常抓（需要真实买家），
// 但把「AI 训练爬虫 + 垃圾采集器 + 机房批量扫描器」挡在外面：
// 近30天 252 个访客里有 115 个来自荷兰/爱尔兰机房，几乎没有目标国买家，属于这类噪音。
const BLOCKED = [
  'GPTBot', 'CCBot', 'ClaudeBot', 'anthropic-ai', 'Claude-Web', 'Google-Extended',
  'Amazonbot', 'Applebot-Extended', 'Bytespider', 'meta-externalagent', 'Diffbot',
  'omgili', 'cohere-ai', 'MistralAI-Training', 'GoogleOther', 'PetalBot',
  'AhrefsBot', 'SemrushBot', 'MJ12bot', 'DotBot', 'DataForSeoBot', 'BLEXBot',
  'SerpstatBot', 'SeznamBot', 'MegaIndex', 'ZoominfoBot', 'AwarioSmartBot',
  'QualifiedBot', 'ICC-Crawler', 'atlassian-bot', 'CensysInspect', 'Nuclei',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...BLOCKED.map((ua) => ({ userAgent: ua, disallow: '/' })),
    ],
    sitemap: 'https://www.sinocv.com/sitemap.xml',
  };
}
