import Link from "next/link"

export default function MarketingFooter() {
  return (
    <footer className="bg-[#fff7ee] border-t border-black/8 px-6 py-14">
      <div className="max-w-5xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5e17eb] to-[#e06832] flex items-center justify-center text-xs font-bold text-white">
                F
              </div>
              <span className="font-bold text-gray-900 tracking-tight">Flarvio</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              AI-powered social media content and scheduling for ecommerce brands. Expert-level content from only $99/mo.
            </p>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">Company</p>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link href="/about" className="hover:text-[#5e17eb] transition-colors">About us</Link></li>
              <li><Link href="/contact" className="hover:text-[#5e17eb] transition-colors">Contact</Link></li>
              <li><Link href="/press" className="hover:text-[#5e17eb] transition-colors">Press</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-4">Legal</p>
            <ul className="space-y-2.5 text-sm text-gray-500">
              <li><Link href="/terms" className="hover:text-[#5e17eb] transition-colors">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy" className="hover:text-[#5e17eb] transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-black/8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>&copy; {new Date().getFullYear()} Flarvio. All rights reserved.</span>
          <span>
            <Link href="https://flarvio.com" className="hover:text-[#5e17eb] transition-colors">flarvio.com</Link>
          </span>
        </div>
      </div>
    </footer>
  )
}
