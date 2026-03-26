"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: "▪" },
  { href: "/onboarding", label: "Setup", icon: "◈" },
  { href: "/brand", label: "Brand Profile", icon: "◇" },
  { href: "/generate", label: "Generate", icon: "✦" },
  { href: "/posts", label: "My Posts", icon: "≡" },
  { href: "/schedule", label: "Schedule", icon: "◷" },
]

export default function Sidebar({ userName }: { userName: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-56 flex flex-col bg-white border-r border-gray-200 shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">S</span>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 leading-none">SocialAI</div>
            <div className="text-xs text-gray-400 mt-0.5">Content Engine</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map((item) => {
          const active = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                active
                  ? "bg-indigo-50 text-indigo-600 font-medium"
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <span className={`text-[10px] ${active ? "text-indigo-500" : "text-gray-400"}`}>
                {item.icon}
              </span>
              {item.label}
            </Link>
          )
        })}
      </nav>

      {/* User footer */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-2.5 px-3 py-2 mb-1">
          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-semibold text-indigo-600 shrink-0">
            {userName[0]?.toUpperCase()}
          </div>
          <span className="text-xs text-gray-700 font-medium truncate flex-1">{userName}</span>
        </div>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full px-3 py-1.5 text-xs text-gray-400 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-colors text-left"
        >
          Sign out
        </button>
      </div>
    </aside>
  )
}
