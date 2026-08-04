import type { ReactNode } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"

export type Page = "dashboard" | "equipements" | "tickets" | "maintenance" | "pieces" | "rapports" | "users"
interface LayoutProps {
  children: ReactNode
  currentPage: Page
  onNavigate: (page: Page) => void
}

export function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { user, logout } = useAuth()

 const navItems: { key: Page; label: string; adminOnly?: boolean }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "equipements", label: "Équipements" },
    { key: "tickets", label: "Tickets" },
    { key: "maintenance", label: "Maintenance" },
    { key: "pieces", label: "Pièces de rechange" },
    { key: "rapports", label: "Rapports" },
    { key: "users", label: "Utilisateurs", adminOnly: true },
  ]

  return (
    <div className="flex min-h-screen bg-slate-100">
      <aside className="flex w-56 flex-col bg-slate-900 p-4 text-white">
        <h2 className="mb-8 text-xl font-bold">PhosGuard</h2>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== "admin") return null

            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`rounded px-3 py-2 text-left text-sm transition-colors ${
                  currentPage === item.key
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800"
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="mt-auto border-t border-slate-700 pt-4">
          <p className="mb-2 text-xs text-slate-400">{user?.name}</p>
          <p className="mb-3 text-xs text-slate-500">{user?.role_label}</p>
          <Button onClick={logout} variant="outline" size="sm" className="w-full">
            Déconnexion
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8">{children}</main>
    </div>
  )
}