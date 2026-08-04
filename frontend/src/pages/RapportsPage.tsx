import { useState } from "react"
import { Button } from "@/components/ui/button"
import { apiFetch } from "@/lib/api"

export function RapportsPage() {
  const [isDownloadingTickets, setIsDownloadingTickets] = useState(false)
  const [isDownloadingEquipements, setIsDownloadingEquipements] = useState(false)

  async function downloadPdf(path: string, filename: string, setLoading: (v: boolean) => void) {
    setLoading(true)

    const response = await apiFetch(path)

    if (response.ok) {
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } else {
      alert("Erreur lors de la génération du rapport.")
    }

    setLoading(false)
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-slate-900">Rapports</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Rapport des tickets</h2>
          <p className="mb-4 text-sm text-slate-500">
            Liste complète des tickets avec équipement, technicien, priorité et statut.
          </p>
          <Button
            onClick={() => downloadPdf("/api/rapports/tickets", "rapport-tickets.pdf", setIsDownloadingTickets)}
            disabled={isDownloadingTickets}
          >
            {isDownloadingTickets ? "Génération..." : "Télécharger le PDF"}
          </Button>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-2 text-lg font-semibold text-slate-900">Rapport des équipements</h2>
          <p className="mb-4 text-sm text-slate-500">
            Liste complète des équipements avec référence, localisation et statut.
          </p>
          <Button
            onClick={() => downloadPdf("/api/rapports/equipements", "rapport-equipements.pdf", setIsDownloadingEquipements)}
            disabled={isDownloadingEquipements}
          >
            {isDownloadingEquipements ? "Génération..." : "Télécharger le PDF"}
          </Button>
        </div>
      </div>
    </div>
  )
}