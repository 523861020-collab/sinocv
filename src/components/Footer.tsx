export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-gray-800">
      <div className="px-6 lg:px-16 max-w-[1920px] mx-auto py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <img src="/images/logo-new.png" alt="Logo" className="h-10 w-auto" />
              <div className="text-sm text-amber-500 font-medium leading-tight">
                <div>One-stop Shop for</div>
                <div>Chinese Commercial Vehicles</div>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed mb-6">
              Authorized SINOTRUK exporter and partner of XCMG and CIMC. Products cover tractor trucks, dump trucks, mixer trucks, special vehicles, construction machinery, trailers, and light commercial vehicles.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/chintruck" target="_blank" rel="noopener" className="rounded-full bg-gray-800 p-3 text-gray-400 hover:text-blue-500 hover:bg-gray-700 transition-all">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/heavy-truck" className="text-gray-400 hover:text-amber-500 transition-colors">Heavy Duty Trucks</a></li>
              <li><a href="/machinery" className="text-gray-400 hover:text-amber-500 transition-colors">Construction Machinery</a></li>
              <li><a href="/mining" className="text-gray-400 hover:text-amber-500 transition-colors">Mining Trucks</a></li>
              <li><a href="/light" className="text-gray-400 hover:text-amber-500 transition-colors">Light Vehicles</a></li>
              <li><a href="/trailers" className="text-gray-400 hover:text-amber-500 transition-colors">Trailers</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-6">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <svg className="h-5 w-5 text-amber-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-gray-400">lishanlong@sinocv.com</span>
              </div>
              <a href="https://wa.me/8619103781257" target="_blank" rel="noopener" className="flex items-center gap-3 group">
                <svg className="h-5 w-5 text-green-400 group-hover:text-green-300 transition-colors shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span className="text-green-400 group-hover:text-green-300 transition-colors font-medium">WhatsApp: +86 19103781257</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">
            © 2025 SINOCV. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
