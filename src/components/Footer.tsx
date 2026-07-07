export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/images/logo.png" alt="Logo" className="h-10 w-auto" />
              <div className="text-sm text-amber-500 font-medium leading-tight">
                <div>One-stop Shop for</div>
                <div>Chinese Commercial Vehicles</div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Authorized SINOTRUK exporter and partner of XCMG, CIMC, and Foton. Products cover tractor trucks, dump trucks, mixer trucks, special vehicles, construction machinery, and more.
            </p>
            <div className="flex gap-4">
              <a href="#" className="rounded-full bg-gray-800 p-3 text-gray-400 hover:text-amber-500 hover:bg-gray-700 transition-all">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" className="rounded-full bg-gray-800 p-3 text-gray-400 hover:text-amber-500 hover:bg-gray-700 transition-all">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </a>
              <a href="#" className="rounded-full bg-gray-800 p-3 text-gray-400 hover:text-amber-500 hover:bg-gray-700 transition-all">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Products</h3>
            <ul className="space-y-4">
              <li><a href="#products" className="text-gray-400 hover:text-amber-500 transition-colors">Tractor Trucks</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-amber-500 transition-colors">Cargo Trucks</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-amber-500 transition-colors">Dump Trucks</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-amber-500 transition-colors">Mixer Trucks</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-amber-500 transition-colors">Special Vehicles</a></li>
              <li><a href="#products" className="text-gray-400 hover:text-amber-500 transition-colors">Trailers</a></li>
            </ul>
          </div>

          {/* Brands */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Brands</h3>
            <ul className="space-y-4">
              <li><span className="text-gray-400">🏭 SINOTRUK HOWO/SITRAK</span></li>
              <li><span className="text-gray-400">⚙️ XCMG Machinery</span></li>
              <li><span className="text-gray-400">🔗 CIMC Trailers</span></li>
              <li><span className="text-gray-400">🚐 Foton Motors</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="h-5 w-5 text-amber-500 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-gray-400">Licheng, Jinan, Shandong, China</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-400">info@howotruck.com</span>
              </div>
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-gray-400">+86 13001977959</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2024 HOWO Truck Export. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-500 hover:text-amber-500 text-sm transition-colors">Privacy</a>
            <a href="#" className="text-gray-500 hover:text-amber-500 text-sm transition-colors">Terms</a>
            <a href="#" className="text-gray-500 hover:text-amber-500 text-sm transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
