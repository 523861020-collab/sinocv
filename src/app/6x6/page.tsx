import ZonePage from '@/components/ZonePage';
import { trucks } from '@/data/trucks';

export default function SixBySixPage() {
  return (
    <ZonePage
      title="6×6 Off-Road"
      titleEn="6×6 Off-Road Vehicles"
      icon="🧭"
      brand="SINOTRUK"
      description="AWD Desert Spec · Dump · Chassis · Fuel Tanker"
      trucks={trucks.filter(t => t.category === '6x6')}
      bannerImage="/images/howo-6x6-dump-1.jpg"
    />
  );
}
