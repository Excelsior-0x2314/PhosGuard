import type { ReactNode } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/NotificationBell"

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
    <div className="flex min-h-screen bg-background">
      <aside className="flex w-64 flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex items-center justify-center border-b border-sidebar-border px-5 py-6">
          <img src="/logos/logo-phosguard.png" alt="PhosGuard" className="h-33 w-33 object-contain" />
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {navItems.map((item) => {
            if (item.adminOnly && user?.role !== "admin") return null

            const isActive = currentPage === item.key

            return (
              <button
                key={item.key}
                onClick={() => onNavigate(item.key)}
                className={`rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 flex justify-center">
            <img src="/logos/logo-ocp.png" alt="OCP" className="h-20 w-20 object-contain" />
          </div>

          <p className="mb-0.5 text-sm font-medium">{user?.name}</p>
          <p className="mb-3 text-xs text-sidebar-foreground/60">{user?.role_label}</p>
          <Button onClick={logout} variant="outline" size="sm" className="w-full border-sidebar-border bg-transparent text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
            Déconnexion
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-8">
        <div className="mb-4 flex justify-end">
          <NotificationBell />
        </div>
        {children}
      </main>
    </div>
  )
}