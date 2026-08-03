import { useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { LoginPage } from "@/pages/LoginPage"
import { DashboardPage } from "@/pages/DashboardPage"
import { EquipementsPage } from "@/pages/EquipementsPage"
import { TicketsPage } from "@/pages/TicketsPage"
import { UsersPage } from "@/pages/UsersPage"
import { Layout, type Page } from "@/components/Layout"
import { MaintenancePage } from "@/pages/MaintenancePage"

function App() {
  const { user, isLoading } = useAuth()
  const [currentPage, setCurrentPage] = useState<Page>("dashboard")

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">Chargement...</p>
      </div>
    )
  }

  if (!user) {
    return <LoginPage />
  }

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {currentPage === "dashboard" && <DashboardPage />}
      {currentPage === "equipements" && <EquipementsPage />}
      {currentPage === "tickets" && <TicketsPage />}
      {currentPage === "users" && <UsersPage />}
      {currentPage === "maintenance" && <MaintenancePage />}
    </Layout>
  )
}

export default App