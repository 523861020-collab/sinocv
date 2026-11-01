'use client';

// 首页快速定位条：手机/桌面首屏之后第一眼就能看到"我们要卖什么"，点了直接到对应图片卡片区。
// 2026-11-01 新增（李总要求：首页留客）。纯导航，不新增产品信息。
import Link from 'next/link';
import { useLocale } from 'next-intl';

// 三种语言各一份，避免英文站/阿语站出现中文按钮
const ITEMS: Record<string, { key: string; label: string; href: string }[]> = {
  en: [
    { key: 'promo', label: '🔥 In Stock', href: '#promo' },
    { key: 'truck', label: '🚛 Trucks', href: '#truck' },
    { key: 'machine', label: '⚙️ Machinery', href: '#machine' },
    { key: 'trailer', label: '🚚 Trailers', href: '#trailer' },
    { key: 'light', label: '🚐 Light Vehicles', href: '#light' },
    { key: 'contact', label: '💬 Get Quote', href: '#contact' },
  ],
  fr: [
    { key: 'promo', label: '🔥 En stock', href: '#promo' },
    { key: 'truck', label: '🚛 Camions', href: '#truck' },
    { key: 'machine', label: '⚙️ Engins', href: '#machine' },
    { key: 'trailer', label: '🚚 Remorques', href: '#trailer' },
    { key: 'light', label: '🚐 Utilitaires', href: '#light' },
    { key: 'contact', label: '💬 Devis', href: '#contact' },
  ],
  ar: [
    { key: 'promo', label: '🔥 متوفر', href: '#promo' },
    { key: 'truck', label: '🚛 الشاحنات', href: '#truck' },
    { key: 'machine', label: '⚙️ المعدات', href: '#machine' },
    { key: 'trailer', label: '🚚 المقطورات', href: '#trailer' },
    { key: 'light', label: '🚐 المركبات الخفيفة', href: '#light' },
    { key: 'contact', label: '💬 اطلب عرض سعر', href: '#contact' },
  ],
};

export default function QuickNav() {
  const locale = useLocale();
  const items = ITEMS[locale] || ITEMS.en;
  return (
    <div className="bg-gray-950 border-y border-gray-800/80">
    <div className="mx-auto max-w-7xl px-3 py-3 flex gap-2 overflow-x-auto md:justify-center no-scrollbar">
      {items.map((it) => (
        <Link
          key={it.key}
          href={it.href}
          className="shrink-0 rounded-full border border-gray-700 bg-gray-900 px-4 py-2 text-sm md:text-base font-medium text-gray-200 hover:border-amber-500 hover:text-amber-400 transition-colors"
        >
          {it.label}
        </Link>
      ))}
    </div>
    </div>
  );
}
