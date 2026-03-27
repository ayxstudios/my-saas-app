import Link from "next/link"

export default function MarketingNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 border-b border-black/5 bg-[#fff7ee]/90 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#5e17eb] to-[#e06832] flex items-center justify-center text-xs font-bold text-white">
          F
        </div>
        <span className="font-bold text-gray-900 tracking-tight">Flarvio</span>
      </Link>

      <div className="hidden sm:flex items-center gap-6 text-sm text-gray-600">
        <Link href="/about" className="hover:text-[#5e17eb] transition-colors">About</Link>
        <Link href="/contact" className="hover:text-[#5e17eb] transition-colors">Contact</Link>
        <Link href="/press" className="hover:text-[#5e17eb] transition-colors">Press</Link>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/login"
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors px-3 py-1.5"
        >
          Log in
        </Link>
        <Link
          href="/register"
          className="text-sm font-semibold bg-[#5e17eb] hover:bg-[#4c12c0] transition-colors text-white px-4 py-1.5 rounded-lg"
        >
          Start free
        </Link>
      </div>
    </nav>
  )
}
