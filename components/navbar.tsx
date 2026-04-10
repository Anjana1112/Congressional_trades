"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"

const NAV_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Trade Filings", href: "/trades" },
  { label: "Stocks", href: "/stocks" },
  { label: "Congress Members", href: "/members" },
]

export const Navbar = () => {
    const pathname = usePathname()
    return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
        <div className="flex h-14 items-center gap-4 px-6">
            <div className="text-xl font-bold text-foreground">
                Congress Stock Trades
            </div>
            <nav className="flex items-center gap-1 ml-auto">
                {NAV_LINKS.map(({ label, href }) => (
                    <Link
                    key={href}
                    href={href}
                    className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors
                        ${
                        pathname === href
                            ? "bg-gray-300 text-gray-500"
                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                        }`}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
        </div>
    </header>

    )
}