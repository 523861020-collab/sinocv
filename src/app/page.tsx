import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Advantages from '@/components/Advantages';
import GlobalMarkets from '@/components/GlobalMarkets';
import ZoneSection from '@/components/ZoneSection';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import { trucks, zones } from '@/data/trucks';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      {zones.map((zone) => (
        <ZoneSection
          key={zone.id}
          zone={zone}
          trucks={trucks.filter((t) => zone.categories.includes(t.category))}
        />
      ))}
      <Advantages />
      <GlobalMarkets />
      <Contact />
      <Footer />
    </main>
  );
}
