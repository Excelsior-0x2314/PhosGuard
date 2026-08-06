import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { LayoutGrid, Wrench, Ticket, CircleAlert, CircleCheck, AlertTriangle } from "lucide-react"

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

function StatCard({
  label,
  value,
  icon: Icon,
  tone = "default",
}: {
  label: string
  value: number | string
  icon: React.ElementType
  tone?: "default" | "warning" | "success" | "danger"
}) {
  const toneStyles = {
    default: "bg-accent text-accent-foreground",
    warning: "bg-amber-100 text-amber-700",
    success: "bg-emerald-100 text-emerald-700",
    danger: "bg-red-100 text-red-700",
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
        <div className={`flex h-8 w-8 items-center justify-center rounded-md ${toneStyles[tone]}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="text-3xl font-bold text-foreground">{value}</p>
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

  if (isLoading) return <p className="text-muted-foreground">Chargement...</p>
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
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
          <LayoutGrid className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">Tableau de bord</h1>
          <p className="text-sm text-muted-foreground">Statistiques de maintenance curative et préventive en temps réel.</p>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-5">
        <StatCard label="Équipements" value={stats.nombre_equipements} icon={Wrench} />
        <StatCard label="Total tickets" value={stats.nombre_tickets} icon={Ticket} />
        <StatCard label="Tickets ouverts" value={stats.tickets_ouverts} icon={CircleAlert} tone="warning" />
        <StatCard label="Tickets fermés" value={stats.tickets_fermes} icon={CircleCheck} tone="success" />
        <StatCard
          label="En retard"
          value={stats.tickets_en_retard}
          icon={AlertTriangle}
          tone={stats.tickets_en_retard > 0 ? "danger" : "default"}
        />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Répartition par statut</h2>
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
            <p className="text-sm text-muted-foreground">Aucun ticket pour le moment.</p>
          )}
        </div>

        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-foreground">Répartition par priorité</h2>
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
            <p className="text-sm text-muted-foreground">Aucun ticket pour le moment.</p>
          )}
        </div>
      </div>
    </div>
  )
}