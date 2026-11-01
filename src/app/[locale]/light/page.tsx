import type { Metadata } from 'next';
import { zoneMeta } from '../seo-titles';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return zoneMeta('light', locale);
}

import ZonePage from '@/components/ZonePage';
import { trucks, zones } from '@/data/trucks';

const zone = zones.find(z => z.id === 'light')!;

export default function LightPage() {
  return (
    <ZonePage
      title={zone.title}
      titleEn={zone.titleEn}
      icon={zone.icon}
      brand={zone.brand}
      description={zone.description}
      trucks={trucks.filter(t => zone.categories.includes(t.category))}
      zoneId="light"
      bannerImage="/images/hero-light-banner.webp"
    />
  );
}
