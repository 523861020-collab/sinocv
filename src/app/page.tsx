import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import ProductSlider from '@/components/ProductSlider';
import Advantages from '@/components/Advantages';
import GlobalMarkets from '@/components/GlobalMarkets';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-black">
      <Navbar />
      <Hero />
      <ProductSlider />
      <Advantages />
      <GlobalMarkets />
      <Contact />
      <Footer />
    </main>
  );
}
