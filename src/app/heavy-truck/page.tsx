import ZonePage from '@/components/ZonePage';
import { trucks, zones } from '@/data/trucks';

const zone = zones[0];

export default function HeavyTruckPage() {
  return (
    <ZonePage
      title={zone.title}
      titleEn={zone.titleEn}
      icon={zone.icon}
      brand={zone.brand}
      description={zone.description}
      trucks={trucks.filter(t => zone.categories.includes(t.category))}
      bannerImage="/images/hero-heavy-banner.jpg"
    />
  );
}
