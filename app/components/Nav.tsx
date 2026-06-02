"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Nav() {
  const pathname = usePathname()
  const link = (href: string, label: string) => (
    <Link
      href={href}
      className={`text-base transition-colors ${
        pathname === href ? "text-zinc-100" : "text-zinc-400 hover:text-zinc-200"
      }`}
    >
      {label}
    </Link>
  )

  return (
    <nav className="sticky top-0 z-50 bg-zinc-900/95 backdrop-blur border-b border-zinc-700 px-4 py-3 font-mono">
      <div className="max-w-[1100px] mx-auto flex items-center gap-6">
        <span className="text-orange-400 font-bold text-base tracking-wide">BROTATO</span>
        <div className="flex gap-5">
          {link("/", "Weapons")}
          {link("/build", "Build")}
        </div>
      </div>
    </nav>
  )
}
