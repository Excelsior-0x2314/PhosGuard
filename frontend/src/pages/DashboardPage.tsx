import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"

interface DashboardStats {
  nombre_equipements: number
  nombre_tickets: number
  tickets_ouverts: number
  tickets_fermes: number
  tickets_en_retard: number
  repartition_par_statut: Record<string, number>
  repartition_par_priorite: Record<string, number>
}

const statutLabels: Record<string, string> = {
  ouvert: "Ouvert",
  en_cours: "En cours",
  resolu: "Résolu",
  ferme: "Fermé",
}

const prioriteLabels: Record<string, string> = {
  basse: "Basse",
  moyenne: "Moyenne",
  haute: "Haute",
  critique: "Critique",
}

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#64748b", "#ef4444"]

function StatCard({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-bold ${highlight ? "text-red-600" : "text-slate-900"}`}>
        {value}
      </p>
    </div>
  )
}

export function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    setIsLoading(true)
    setError("")

    const response = await apiFetch("/api/dashboard")

    if (response.ok) {
      const data = await response.json()
      setStats(data.data)
    } else {
      setError("Impossible de charger les statistiques.")
    }

    setIsLoading(false)
  }

  if (isLoading) return <p className="text-slate-500">Chargement...</p>
  if (error) return <p className="text-red-600">{error}</p>
  if (!stats) return null

  const statutData = Object.entries(stats.repartition_par_statut).map(([key, value]) => ({
    name: statutLabels[key] || key,
    value,
  }))

  const prioriteData = Object.entries(stats.repartition_par_priorite).map(([key, value]) => ({
    name: prioriteLabels[key] || key,
    value,
  }))

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Dashboard</h1>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Équipements" value={stats.nombre_equipements} />
        <StatCard label="Total tickets" value={stats.nombre_tickets} />
        <StatCard label="Tickets ouverts" value={stats.tickets_ouverts} />
        <StatCard label="Tickets fermés" value={stats.tickets_fermes} />
        <StatCard label="En retard" value={stats.tickets_en_retard} highlight={stats.tickets_en_retard > 0} />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Répartition par statut</h2>
          {statutData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statutData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {statutData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400">Aucun ticket pour le moment.</p>
          )}
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-semibold text-slate-900">Répartition par priorité</h2>
          {prioriteData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={prioriteData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                  {prioriteData.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-slate-400">Aucun ticket pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  )
}