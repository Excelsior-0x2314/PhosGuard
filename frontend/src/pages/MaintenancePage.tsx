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

interface Visite {
  id: number
  date_planifiee: string
  date_realisation: string | null
  statut: string
  statut_label: string
  checklist: string | null
  compte_rendu: string | null
  equipement: { id: number; nom: string; reference: string } | [] | null
  technicien: { id: number; name: string } | [] | null
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

const statutVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  planifiee: "outline",
  effectuee: "default",
  annulee: "destructive",
}

export function MaintenancePage() {
  const { user } = useAuth()
  const [visites, setVisites] = useState<Visite[]>([])
  const [equipementsOptions, setEquipementsOptions] = useState<EquipementOption[]>([])
  const [techniciensOptions, setTechniciensOptions] = useState<UserOption[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formEquipementId, setFormEquipementId] = useState("")
  const [formDatePlanifiee, setFormDatePlanifiee] = useState("")
  const [formChecklist, setFormChecklist] = useState("")
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [manageVisite, setManageVisite] = useState<Visite | null>(null)
  const [manageTechnicienId, setManageTechnicienId] = useState("")
  const [manageCompteRendu, setManageCompteRendu] = useState("")
  const [manageError, setManageError] = useState("")
  const [isManageSubmitting, setIsManageSubmitting] = useState(false)

  const isAdminOrResponsable = user?.role === "admin" || user?.role === "responsable"

  useEffect(() => {
    loadVisites()
    loadEquipementsOptions()
    if (isAdminOrResponsable) {
      loadTechniciensOptions()
    }
  }, [])

  async function loadVisites() {
    setIsLoading(true)
    setError("")

    const response = await apiFetch("/api/visites")

    if (response.ok) {
      const data = await response.json()
      setVisites(data.data)
    } else {
      setError("Impossible de charger les visites.")
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

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setFormError("")
    setIsSubmitting(true)

    const response = await apiFetch("/api/visites", {
      method: "POST",
      body: JSON.stringify({
        equipement_id: Number(formEquipementId),
        date_planifiee: formDatePlanifiee,
        checklist: formChecklist,
      }),
    })

    if (response.ok) {
      setFormEquipementId("")
      setFormDatePlanifiee("")
      setFormChecklist("")
      setIsCreateOpen(false)
      loadVisites()
    } else {
      const data = await response.json()
      setFormError(data.message || "Erreur lors de la création.")
    }

    setIsSubmitting(false)
  }

  function openManageDialog(visite: Visite) {
    setManageVisite(visite)
    setManageTechnicienId(
      visite.technicien && !Array.isArray(visite.technicien) ? String(visite.technicien.id) : ""
    )
    setManageCompteRendu("")
    setManageError("")
  }

  function canComplete(visite: Visite): boolean {
    if (visite.statut !== "planifiee") return false
    if (isAdminOrResponsable) return true
    return !!(visite.technicien && !Array.isArray(visite.technicien) && visite.technicien.id === user?.id)
  }

  async function handleAssign(e: FormEvent) {
    e.preventDefault()
    if (!manageVisite || !manageTechnicienId) return

    setManageError("")
    setIsManageSubmitting(true)

    const response = await apiFetch(`/api/visites/${manageVisite.id}/assign`, {
      method: "PATCH",
      body: JSON.stringify({ technicien_id: Number(manageTechnicienId) }),
    })

    if (response.ok) {
      setManageVisite(null)
      loadVisites()
    } else {
      const data = await response.json()
      setManageError(data.message || "Erreur lors de l'affectation.")
    }

    setIsManageSubmitting(false)
  }

  async function handleComplete(e: FormEvent) {
    e.preventDefault()
    if (!manageVisite) return

    setManageError("")
    setIsManageSubmitting(true)

    const response = await apiFetch(`/api/visites/${manageVisite.id}/complete`, {
      method: "PATCH",
      body: JSON.stringify({ compte_rendu: manageCompteRendu }),
    })

    if (response.ok) {
      setManageVisite(null)
      loadVisites()
    } else {
      const data = await response.json()
      setManageError(data.message || "Erreur lors de la complétion.")
    }

    setIsManageSubmitting(false)
  }

  async function handleCancel(visite: Visite) {
    const confirmed = window.confirm("Annuler cette visite ?")
    if (!confirmed) return

    const response = await apiFetch(`/api/visites/${visite.id}/cancel`, { method: "PATCH" })

    if (response.ok) {
      loadVisites()
    } else {
      alert("Erreur lors de l'annulation.")
    }
  }

  async function handleDelete(visite: Visite) {
    const confirmed = window.confirm("Supprimer définitivement cette visite ?")
    if (!confirmed) return

    const response = await apiFetch(`/api/visites/${visite.id}`, { method: "DELETE" })

    if (response.ok) {
      loadVisites()
    } else {
      alert("Erreur lors de la suppression.")
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Maintenance préventive</h1>

        {isAdminOrResponsable && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button>Planifier une visite</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle visite de maintenance</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreate} className="flex flex-col gap-4">
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
                  <Label htmlFor="date">Date planifiée</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formDatePlanifiee}
                    onChange={(e) => setFormDatePlanifiee(e.target.value)}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="checklist">Checklist</Label>
                  <Input
                    id="checklist"
                    value={formChecklist}
                    onChange={(e) => setFormChecklist(e.target.value)}
                    placeholder="Ex: Vérifier huile, joints, pression..."
                  />
                </div>

                {formError && <p className="text-sm text-red-600">{formError}</p>}

                <Button type="submit" disabled={isSubmitting || !formEquipementId}>
                  {isSubmitting ? "Création..." : "Planifier"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading && <p className="text-slate-500">Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!isLoading && !error && (
        <div className="rounded-lg bg-white shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Équipement</TableHead>
                <TableHead>Date planifiée</TableHead>
                <TableHead>Technicien</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visites.map((visite) => (
                <TableRow key={visite.id}>
                  <TableCell>
                    {visite.equipement && !Array.isArray(visite.equipement) ? visite.equipement.nom : "—"}
                  </TableCell>
                  <TableCell>{visite.date_planifiee.split("T")[0]}</TableCell>
                  <TableCell>
                    {visite.technicien && !Array.isArray(visite.technicien) ? visite.technicien.name : "Non assigné"}
                  </TableCell>
                  <TableCell>
                    <Badge variant={statutVariant[visite.statut]}>{visite.statut_label}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {visite.statut === "planifiee" && (isAdminOrResponsable || canComplete(visite)) && (
                        <Button size="sm" variant="outline" onClick={() => openManageDialog(visite)}>
                          Gérer
                        </Button>
                      )}
                      {isAdminOrResponsable && visite.statut === "planifiee" && (
                        <Button size="sm" variant="outline" onClick={() => handleCancel(visite)}>
                          Annuler
                        </Button>
                      )}
                      {isAdminOrResponsable && (
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(visite)}>
                          Supprimer
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={manageVisite !== null} onOpenChange={(open) => !open && setManageVisite(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gérer la visite</DialogTitle>
          </DialogHeader>

          {manageVisite && (
            <div className="flex flex-col gap-4">
              {manageVisite.checklist && (
                <div className="rounded bg-slate-50 p-3 text-sm text-slate-700">
                  <p className="mb-1 font-medium">Checklist :</p>
                  <p>{manageVisite.checklist}</p>
                </div>
              )}

              {isAdminOrResponsable && (
                <form onSubmit={handleAssign} className="flex flex-col gap-2 border-b pb-4">
                  <Label htmlFor="manage-technicien">Affecter un technicien</Label>
                  <div className="flex gap-2">
                    <Select value={manageTechnicienId} onValueChange={setManageTechnicienId}>
                      <SelectTrigger id="manage-technicien" className="flex-1">
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
                    <Button type="submit" size="sm" disabled={isManageSubmitting || !manageTechnicienId}>
                      Affecter
                    </Button>
                  </div>
                </form>
              )}

              {canComplete(manageVisite) && (
                <form onSubmit={handleComplete} className="flex flex-col gap-2">
                  <Label htmlFor="compte-rendu">Compte rendu (marque la visite comme effectuée)</Label>
                  <Input
                    id="compte-rendu"
                    value={manageCompteRendu}
                    onChange={(e) => setManageCompteRendu(e.target.value)}
                    placeholder="Résumé de l'intervention..."
                  />
                  <Button type="submit" disabled={isManageSubmitting || !manageCompteRendu}>
                    {isManageSubmitting ? "Enregistrement..." : "Marquer comme effectuée"}
                  </Button>
                </form>
              )}

              {manageError && <p className="text-sm text-red-600">{manageError}</p>}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}