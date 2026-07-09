import ZonePage from '@/components/ZonePage';
import { trucks } from '@/data/trucks';

export default function SixBySixPage() {
  return (
    <ZonePage
      title="6×6 专区"
      titleEn="6×6 Off-Road Vehicles"
      icon="🧭"
      brand="中国重汽"
      description="全驱沙漠专用 · 自卸车 · 油罐车 · 底盘"
      trucks={trucks.filter(t => t.category === '6x6')}
      bannerImage="/images/howo-6x6-dump-1.jpg"
    />
  );
}
