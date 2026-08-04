import { useState, useEffect, type FormEvent } from "react"
import { useAuth } from "@/context/AuthContext"
import { apiFetch } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface Ticket {
  id: number
  titre: string
  description: string
  statut: string
  statut_label: string
  priorite: string
  priorite_label: string
  equipement: { id: number; nom: string; reference: string } | [] | null
  technicien: { id: number; name: string } | [] | null
  gti_cible_heures: number
  gtr_cible_heures: number
  gti_respecte?: boolean
  gtr_respecte?: boolean
}

interface EquipementOption {
  id: number
  nom: string
  reference: string
}

interface UserOption {
  id: number
  name: string
  role: string
}

interface PieceOption {
  id: number
  nom: string
  reference: string
  quantite: number
}

const statutVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ouvert: "outline",
  en_cours: "secondary",
  resolu: "default",
  ferme: "default",
}

const prioriteVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  basse: "outline",
  moyenne: "secondary",
  haute: "destructive",
  critique: "destructive",
}

const statutOptions = [
  { value: "ouvert", label: "Ouvert" },
  { value: "en_cours", label: "En cours" },
  { value: "resolu", label: "Résolu" },
  { value: "ferme", label: "Fermé" },
]

export function TicketsPage() {
  const { user } = useAuth()
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [equipementsOptions, setEquipementsOptions] = useState<EquipementOption[]>([])
  const [techniciensOptions, setTechniciensOptions] = useState<UserOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formTitre, setFormTitre] = useState("")
  const [formDescription, setFormDescription] = useState("")
  const [formEquipementId, setFormEquipementId] = useState("")
  const [formPriorite, setFormPriorite] = useState("moyenne")
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [manageTicket, setManageTicket] = useState<Ticket | null>(null)
  const [manageTechnicienId, setManageTechnicienId] = useState("")
  const [manageStatut, setManageStatut] = useState("")
  const [manageError, setManageError] = useState("")
  const [isManageSubmitting, setIsManageSubmitting] = useState(false)

  const [piecesOptions, setPiecesOptions] = useState<PieceOption[]>([])
  const [consumePieceId, setConsumePieceId] = useState("")
  const [consumeQuantite, setConsumeQuantite] = useState("1")
  const [consumeError, setConsumeError] = useState("")
  const [consumeSuccess, setConsumeSuccess] = useState("")

  const isAdminOrResponsable = user?.role === "admin" || user?.role === "responsable"

  useEffect(() => {
    loadTickets()
    loadEquipementsOptions()
    loadPiecesOptions()
    if (isAdminOrResponsable) {
      loadTechniciensOptions()
    }
  }, [])

  async function loadTickets() {
    setIsLoading(true)
    setError("")

    const response = await apiFetch("/api/tickets")

    if (response.ok) {
      const data = await response.json()
      setTickets(data.data)
    } else {
      setError("Impossible de charger les tickets.")
    }

    setIsLoading(false)
  }

  async function loadEquipementsOptions() {
    const response = await apiFetch("/api/equipements")
    if (response.ok) {
      const data = await response.json()
      setEquipementsOptions(data.data)
    }
  }

  async function loadTechniciensOptions() {
    const response = await apiFetch("/api/users")
    if (response.ok) {
      const data = await response.json()
      setTechniciensOptions(data.data.filter((u: UserOption) => u.role === "technicien"))
    }
  }

  async function loadPiecesOptions() {
    const response = await apiFetch("/api/pieces")
    if (response.ok) {
      const data = await response.json()
      setPiecesOptions(data.data)
    }
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setFormError("")
    setIsSubmitting(true)

    const response = await apiFetch("/api/tickets", {
      method: "POST",
      body: JSON.stringify({
        titre: formTitre,
        description: formDescription,
        equipement_id: Number(formEquipementId),
        priorite: formPriorite,
      }),
    })

    if (response.ok) {
      setFormTitre("")
      setFormDescription("")
      setFormEquipementId("")
      setFormPriorite("moyenne")
      setIsCreateOpen(false)
      loadTickets()
    } else {
      const data = await response.json()
      setFormError(data.message || "Erreur lors de la création.")
    }

    setIsSubmitting(false)
  }

  function openManageDialog(ticket: Ticket) {
    setManageTicket(ticket)
    setManageTechnicienId(
      ticket.technicien && !Array.isArray(ticket.technicien) ? String(ticket.technicien.id) : ""
    )
    setManageStatut(ticket.statut)
    setManageError("")
    setConsumeError("")
    setConsumeSuccess("")
  }

  function canChangeStatus(ticket: Ticket): boolean {
    if (isAdminOrResponsable) return true
    return !!(ticket.technicien && !Array.isArray(ticket.technicien) && ticket.technicien.id === user?.id)
  }

  async function handleManageSubmit(e: FormEvent) {
    e.preventDefault()
    if (!manageTicket) return

    setManageError("")
    setIsManageSubmitting(true)

    const currentTechnicienId =
      manageTicket.technicien && !Array.isArray(manageTicket.technicien)
        ? String(manageTicket.technicien.id)
        : ""

    if (isAdminOrResponsable && manageTechnicienId && manageTechnicienId !== currentTechnicienId) {
      const assignResponse = await apiFetch(`/api/tickets/${manageTicket.id}/assign`, {
        method: "PATCH",
        body: JSON.stringify({ technicien_id: Number(manageTechnicienId) }),
      })

      if (!assignResponse.ok) {
        const data = await assignResponse.json()
        setManageError(data.message || "Erreur lors de l'affectation.")
        setIsManageSubmitting(false)
        return
      }
    }

    if (manageStatut !== manageTicket.statut) {
      const statusResponse = await apiFetch(`/api/tickets/${manageTicket.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ statut: manageStatut }),
      })

      if (!statusResponse.ok) {
        const data = await statusResponse.json()
        setManageError(data.message || "Erreur lors du changement de statut.")
        setIsManageSubmitting(false)
        return
      }
    }

    setManageTicket(null)
    loadTickets()
    setIsManageSubmitting(false)
  }

  async function handleConsumePieces() {
    if (!manageTicket || !consumePieceId) return

    setConsumeError("")
    setConsumeSuccess("")

    const response = await apiFetch(`/api/tickets/${manageTicket.id}/consume-pieces`, {
      method: "POST",
      body: JSON.stringify({
        pieces: [{ piece_id: Number(consumePieceId), quantite: Number(consumeQuantite) }],
      }),
    })

    if (response.ok) {
      setConsumeSuccess("Pièce consommée avec succès.")
      setConsumePieceId("")
      setConsumeQuantite("1")
      loadPiecesOptions()
    } else {
      const data = await response.json()
      setConsumeError(data.message || "Erreur lors de la consommation.")
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Tickets</h1>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button>Nouveau ticket</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouveau ticket</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="titre">Titre</Label>
                <Input id="titre" value={formTitre} onChange={(e) => setFormTitre(e.target.value)} required />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="description">Description</Label>
                <Input id="description" value={formDescription} onChange={(e) => setFormDescription(e.target.value)} required />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="equipement">Équipement</Label>
                <Select value={formEquipementId} onValueChange={setFormEquipementId}>
                  <SelectTrigger id="equipement">
                    <SelectValue placeholder="Choisir un équipement" />
                  </SelectTrigger>
                  <SelectContent>
                    {equipementsOptions.map((eq) => (
                      <SelectItem key={eq.id} value={String(eq.id)}>
                        {eq.nom} ({eq.reference})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="priorite">Priorité</Label>
                <Select value={formPriorite} onValueChange={setFormPriorite}>
                  <SelectTrigger id="priorite">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basse">Basse</SelectItem>
                    <SelectItem value="moyenne">Moyenne</SelectItem>
                    <SelectItem value="haute">Haute</SelectItem>
                    <SelectItem value="critique">Critique</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <Button type="submit" disabled={isSubmitting || !formEquipementId}>
                {isSubmitting ? "Création..." : "Créer"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && <p className="text-slate-500">Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!isLoading && !error && (
        <div className="rounded-lg bg-white shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Titre</TableHead>
                <TableHead>Équipement</TableHead>
                <TableHead>Technicien</TableHead>
                <TableHead>Priorité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tickets.map((ticket) => (
                <TableRow key={ticket.id}>
                  <TableCell>{ticket.titre}</TableCell>
                  <TableCell>
                    {ticket.equipement && !Array.isArray(ticket.equipement) ? ticket.equipement.nom : "—"}
                  </TableCell>
                  <TableCell>
                    {ticket.technicien && !Array.isArray(ticket.technicien) ? ticket.technicien.name : "Non assigné"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={prioriteVariant[ticket.priorite]}>
                      {ticket.priorite_label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statutVariant[ticket.statut]}>
                      {ticket.statut_label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {(isAdminOrResponsable || canChangeStatus(ticket)) && (
                      <Button size="sm" variant="outline" onClick={() => openManageDialog(ticket)}>
                        Gérer
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={manageTicket !== null} onOpenChange={(open) => !open && setManageTicket(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gérer le ticket</DialogTitle>
          </DialogHeader>

          {manageTicket && (
            <form onSubmit={handleManageSubmit} className="flex flex-col gap-4">
              <p className="text-sm font-medium text-slate-700">{manageTicket.titre}</p>

              {isAdminOrResponsable && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="manage-technicien">Technicien assigné</Label>
                  <Select value={manageTechnicienId} onValueChange={setManageTechnicienId}>
                    <SelectTrigger id="manage-technicien">
                      <SelectValue placeholder="Choisir un technicien" />
                    </SelectTrigger>
                    <SelectContent>
                      {techniciensOptions.map((tech) => (
                        <SelectItem key={tech.id} value={String(tech.id)}>
                          {tech.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {canChangeStatus(manageTicket) && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="manage-statut">Statut</Label>
                  <Select value={manageStatut} onValueChange={setManageStatut}>
                    <SelectTrigger id="manage-statut">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statutOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {canChangeStatus(manageTicket) && (
                <div className="flex flex-col gap-2 border-t pt-4">
                  <Label>Consommer une pièce</Label>
                  <div className="flex gap-2">
                    <Select value={consumePieceId} onValueChange={setConsumePieceId}>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Choisir une pièce" />
                      </SelectTrigger>
                      <SelectContent>
                        {piecesOptions.map((p) => (
                          <SelectItem key={p.id} value={String(p.id)}>
                            {p.nom} (stock: {p.quantite})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      type="number"
                      min="1"
                      value={consumeQuantite}
                      onChange={(e) => setConsumeQuantite(e.target.value)}
                      className="w-20"
                    />
                    <Button type="button" size="sm" onClick={handleConsumePieces} disabled={!consumePieceId}>
                      Consommer
                    </Button>
                  </div>
                  {consumeError && <p className="text-sm text-red-600">{consumeError}</p>}
                  {consumeSuccess && <p className="text-sm text-green-600">{consumeSuccess}</p>}
                </div>
              )}

              {manageError && <p className="text-sm text-red-600">{manageError}</p>}

              <Button type="submit" disabled={isManageSubmitting}>
                {isManageSubmitting ? "Enregistrement..." : "Enregistrer"}
              </Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}