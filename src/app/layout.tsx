import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'XINYUNTONG | Chinese Commercial Vehicles Export - Trucks, Machinery, Trailers',
  description: 'XINYUNTONG China Co., Ltd. — Professional Chinese commercial vehicles exporter. Heavy trucks, construction machinery, mining equipment, light vehicles, and semi-trailers. HOWO, SITRAK, SHACMAN, XCMG direct factory supply with competitive FOB/CFR prices. Export to Africa, Middle East, Southeast Asia.',
  keywords: 'Chinese trucks export, HOWO, SITRAK, SHACMAN, XCMG, heavy trucks, dump trucks, tractor trucks, commercial vehicles China, construction machinery export, semi-trailers, FOB price, CFR price, Africa truck supplier, sinocv',
  metadataBase: new URL('https://sinocv.com'),
  alternates: {
    canonical: 'https://sinocv.com',
  },
  openGraph: {
    title: 'XINYUNTONG | Chinese Commercial Vehicles Export',
    description: 'Professional Chinese commercial vehicles exporter — HOWO, SITRAK, SHACMAN, XCMG direct factory supply.',
    url: 'https://sinocv.com',
    siteName: 'XINYUNTONG China',
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
