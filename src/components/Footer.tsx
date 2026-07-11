export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="px-6 lg:px-16 max-w-[1920px] mx-auto py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex flex-col items-start gap-2 mb-4">
              <img src="/images/logo-new.png" alt="Logo" className="h-10 w-auto" />
              <div className="text-sm text-amber-500 font-medium leading-tight">
                <div>One-Stop Sourcing for</div>
                <div>Commercial Vehicles</div>
              </div>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Your trusted partner for Chinese commercial vehicles and construction machinery export.
            </p>
            <div className="flex gap-3">
              <a href="https://www.facebook.com/chintruck" target="_blank" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-colors text-sm">f</a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-colors text-sm">in</a>
              <a href="#" className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-colors text-sm">▶</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <a href="/heavy-truck" className="text-gray-400 hover:text-amber-500">Heavy Trucks</a>
              <a href="/machinery" className="text-gray-400 hover:text-amber-500">Machinery</a>
              <a href="/mining" className="text-gray-400 hover:text-amber-500">Mining</a>
              <a href="/light" className="text-gray-400 hover:text-amber-500">Light Vehicles</a>
              <a href="/trailers" className="text-gray-400 hover:text-amber-500">Trailers</a>
            </div>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact</h4>
            <div className="space-y-2 text-sm text-gray-400">
              <p>📧 lishanlong@sinocv.com</p>
              <a href="https://wa.me/8619103781257" target="_blank" rel="noopener" className="flex items-center gap-2 text-green-400 hover:text-green-300">
                <span>💬 WhatsApp: +86 19103781257</span>
              </a>
              <a href="https://www.facebook.com/chintruck" target="_blank" rel="noopener" className="text-gray-400 hover:text-amber-500">Facebook</a>
            </div>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <span className="text-gray-500 text-sm">Partner Brands</span>
            <span className="text-gray-400 font-semibold">SINOTRUK</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400 font-semibold">XCMG</span>
            <span className="text-gray-600">|</span>
            <span className="text-gray-400 font-semibold">CIMC</span>
          </div>
          <div className="text-gray-600 text-xs">
            © 2025 XINYUNTONG CHINA LIMITED. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
