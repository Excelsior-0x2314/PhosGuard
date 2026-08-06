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
import { Wrench, Plus, Pencil, Trash2, MapPin } from "lucide-react"

interface Equipement {
  id: number
  nom: string
  reference: string
  localisation: string
  statut: string
  statut_label: string
}

export function EquipementsPage() {
  const { user } = useAuth()
  const [equipements, setEquipements] = useState<Equipement[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formNom, setFormNom] = useState("")
  const [formReference, setFormReference] = useState("")
  const [formLocalisation, setFormLocalisation] = useState("")
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [editingEquipement, setEditingEquipement] = useState<Equipement | null>(null)
  const [editNom, setEditNom] = useState("")
  const [editReference, setEditReference] = useState("")
  const [editLocalisation, setEditLocalisation] = useState("")
  const [editStatut, setEditStatut] = useState("fonctionnel")
  const [editError, setEditError] = useState("")
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)

  const canManage = user?.role === "admin"

  useEffect(() => {
    loadEquipements()
  }, [])

  async function loadEquipements() {
    setIsLoading(true)
    setError("")

    const response = await apiFetch("/api/equipements")

    if (response.ok) {
      const data = await response.json()
      setEquipements(data.data)
    } else {
      setError("Impossible de charger les équipements.")
    }

    setIsLoading(false)
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setFormError("")
    setIsSubmitting(true)

    const response = await apiFetch("/api/equipements", {
      method: "POST",
      body: JSON.stringify({
        nom: formNom,
        reference: formReference,
        localisation: formLocalisation,
      }),
    })

    if (response.ok) {
      setFormNom("")
      setFormReference("")
      setFormLocalisation("")
      setIsCreateOpen(false)
      loadEquipements()
    } else {
      const data = await response.json()
      setFormError(data.message || "Erreur lors de la création.")
    }

    setIsSubmitting(false)
  }

  function openEditDialog(eq: Equipement) {
    setEditingEquipement(eq)
    setEditNom(eq.nom)
    setEditReference(eq.reference)
    setEditLocalisation(eq.localisation)
    setEditStatut(eq.statut)
    setEditError("")
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault()
    if (!editingEquipement) return

    setEditError("")
    setIsEditSubmitting(true)

    const response = await apiFetch(`/api/equipements/${editingEquipement.id}`, {
      method: "PUT",
      body: JSON.stringify({
        nom: editNom,
        reference: editReference,
        localisation: editLocalisation,
        statut: editStatut,
      }),
    })

    if (response.ok) {
      setEditingEquipement(null)
      loadEquipements()
    } else {
      const data = await response.json()
      setEditError(data.message || "Erreur lors de la modification.")
    }

    setIsEditSubmitting(false)
  }

  async function handleDelete(eq: Equipement) {
    const confirmed = window.confirm(`Supprimer l'équipement "${eq.nom}" (${eq.reference}) ?`)
    if (!confirmed) return

    const response = await apiFetch(`/api/equipements/${eq.id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      loadEquipements()
    } else {
      alert("Erreur lors de la suppression.")
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Wrench className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestion des Équipements</h1>
            <p className="text-sm text-muted-foreground">Consultez et gérez tous les équipements enregistrés dans le système.</p>
          </div>
        </div>

        {canManage && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nouvel équipement
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvel équipement</DialogTitle>
              </DialogHeader>

              <form onSubmit={handleCreate} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nom">Nom</Label>
                  <Input id="nom" value={formNom} onChange={(e) => setFormNom(e.target.value)} required />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="reference">Référence</Label>
                  <Input id="reference" value={formReference} onChange={(e) => setFormReference(e.target.value)} required />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="localisation">Localisation</Label>
                  <Input id="localisation" value={formLocalisation} onChange={(e) => setFormLocalisation(e.target.value)} required />
                </div>

                {formError && <p className="text-sm text-red-600">{formError}</p>}

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Création..." : "Créer"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading && <p className="text-muted-foreground">Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!isLoading && !error && (
        <div className="rounded-lg bg-card shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Statut</TableHead>
                {canManage && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {equipements.map((eq) => (
                <TableRow key={eq.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 text-muted-foreground" />
                      {eq.nom}
                    </div>
                  </TableCell>
                  <TableCell>{eq.reference}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {eq.localisation}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={eq.statut === "fonctionnel" ? "default" : "destructive"}>
                      {eq.statut === "fonctionnel" ? "● " : "● "}{eq.statut_label}
                    </Badge>
                  </TableCell>
                  {canManage && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openEditDialog(eq)}>
                          <Pencil className="h-3.5 w-3.5" />
                          Modifier
                        </Button>
                        <Button size="sm" variant="destructive" className="gap-1.5" onClick={() => handleDelete(eq)}>
                          <Trash2 className="h-3.5 w-3.5" />
                          Supprimer
                        </Button>
                      </div>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={editingEquipement !== null} onOpenChange={(open) => !open && setEditingEquipement(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'équipement</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-nom">Nom</Label>
              <Input id="edit-nom" value={editNom} onChange={(e) => setEditNom(e.target.value)} required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-reference">Référence</Label>
              <Input id="edit-reference" value={editReference} onChange={(e) => setEditReference(e.target.value)} required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-localisation">Localisation</Label>
              <Input id="edit-localisation" value={editLocalisation} onChange={(e) => setEditLocalisation(e.target.value)} required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-statut">Statut</Label>
              <Select value={editStatut} onValueChange={setEditStatut}>
                <SelectTrigger id="edit-statut">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fonctionnel">Fonctionnel</SelectItem>
                  <SelectItem value="en_panne">En panne</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {editError && <p className="text-sm text-red-600">{editError}</p>}

            <Button type="submit" disabled={isEditSubmitting}>
              {isEditSubmitting ? "Modification..." : "Enregistrer"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}