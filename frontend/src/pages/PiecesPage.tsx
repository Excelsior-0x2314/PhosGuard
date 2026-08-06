import { useState, useEffect, type FormEvent } from "react"
import { useAuth } from "@/context/AuthContext"
import { apiFetch } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Package, Plus, AlertTriangle } from "lucide-react"
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

interface Piece {
  id: number
  nom: string
  reference: string
  localisation: string
  quantite: number
  seuil_minimum: number
  alerte_stock_bas: boolean
}

export function PiecesPage() {
  const { user } = useAuth()
  const [pieces, setPieces] = useState<Piece[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formNom, setFormNom] = useState("")
  const [formReference, setFormReference] = useState("")
  const [formLocalisation, setFormLocalisation] = useState("")
  const [formQuantite, setFormQuantite] = useState("0")
  const [formSeuil, setFormSeuil] = useState("0")
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [mouvementPiece, setMouvementPiece] = useState<Piece | null>(null)
  const [mouvementType, setMouvementType] = useState("entree")
  const [mouvementQuantite, setMouvementQuantite] = useState("1")
  const [mouvementMotif, setMouvementMotif] = useState("")
  const [mouvementError, setMouvementError] = useState("")
  const [isMouvementSubmitting, setIsMouvementSubmitting] = useState(false)

  const isAdmin = user?.role === "admin"

  useEffect(() => {
    loadPieces()
  }, [])

  async function loadPieces() {
    setIsLoading(true)
    setError("")

    const response = await apiFetch("/api/pieces")

    if (response.ok) {
      const data = await response.json()
      setPieces(data.data)
    } else {
      setError("Impossible de charger les pièces.")
    }

    setIsLoading(false)
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setFormError("")
    setIsSubmitting(true)

    const response = await apiFetch("/api/pieces", {
      method: "POST",
      body: JSON.stringify({
        nom: formNom,
        reference: formReference,
        localisation: formLocalisation,
        quantite: Number(formQuantite),
        seuil_minimum: Number(formSeuil),
      }),
    })

    if (response.ok) {
      setFormNom("")
      setFormReference("")
      setFormLocalisation("")
      setFormQuantite("0")
      setFormSeuil("0")
      setIsCreateOpen(false)
      loadPieces()
    } else {
      const data = await response.json()
      setFormError(data.message || "Erreur lors de la création.")
    }

    setIsSubmitting(false)
  }

  function openMouvementDialog(piece: Piece) {
    setMouvementPiece(piece)
    setMouvementType("entree")
    setMouvementQuantite("1")
    setMouvementMotif("")
    setMouvementError("")
  }

  async function handleMouvement(e: FormEvent) {
    e.preventDefault()
    if (!mouvementPiece) return

    setMouvementError("")
    setIsMouvementSubmitting(true)

    const response = await apiFetch(`/api/pieces/${mouvementPiece.id}/mouvement`, {
      method: "POST",
      body: JSON.stringify({
        type: mouvementType,
        quantite: Number(mouvementQuantite),
        motif: mouvementMotif || undefined,
      }),
    })

    if (response.ok) {
      setMouvementPiece(null)
      loadPieces()
    } else {
      const data = await response.json()
      setMouvementError(data.message || "Erreur lors du mouvement.")
    }

    setIsMouvementSubmitting(false)
  }

  async function handleDelete(piece: Piece) {
    const confirmed = window.confirm(`Supprimer la pièce "${piece.nom}" ?`)
    if (!confirmed) return

    const response = await apiFetch(`/api/pieces/${piece.id}`, { method: "DELETE" })

    if (response.ok) {
      loadPieces()
    } else {
      alert("Erreur lors de la suppression.")
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Package className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Pièces de rechange</h1>
            <p className="text-sm text-muted-foreground">Inventaire et mouvements de stock.</p>
          </div>
        </div>

        {isAdmin && (
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2"><Plus className="h-4 w-4" />Nouvelle pièce</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle pièce</DialogTitle>
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
                <div className="flex flex-col gap-2">
                  <Label htmlFor="quantite">Quantité initiale</Label>
                  <Input id="quantite" type="number" min="0" value={formQuantite} onChange={(e) => setFormQuantite(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="seuil">Seuil minimum</Label>
                  <Input id="seuil" type="number" min="0" value={formSeuil} onChange={(e) => setFormSeuil(e.target.value)} />
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

      {isLoading && <p className="text-slate-500">Chargement...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {!isLoading && !error && (
        <div className="rounded-lg bg-white shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Référence</TableHead>
                <TableHead>Localisation</TableHead>
                <TableHead>Quantité</TableHead>
                <TableHead>Seuil min.</TableHead>
                <TableHead>Alerte</TableHead>
                {isAdmin && <TableHead>Actions</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {pieces.map((piece) => (
                <TableRow key={piece.id}>
                  <TableCell>{piece.nom}</TableCell>
                  <TableCell>{piece.reference}</TableCell>
                  <TableCell>{piece.localisation}</TableCell>
                  <TableCell>{piece.quantite}</TableCell>
                  <TableCell>{piece.seuil_minimum}</TableCell>
                  <TableCell>
                    {piece.alerte_stock_bas && <Badge variant="destructive" className="gap-1"><AlertTriangle className="h-3 w-3" />Stock bas</Badge>}
                  </TableCell>
                  {isAdmin && (
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => openMouvementDialog(piece)}>
                          Mouvement
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(piece)}>
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

      <Dialog open={mouvementPiece !== null} onOpenChange={(open) => !open && setMouvementPiece(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mouvement de stock — {mouvementPiece?.nom}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleMouvement} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="mvt-type">Type</Label>
              <Select value={mouvementType} onValueChange={setMouvementType}>
                <SelectTrigger id="mvt-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="entree">Entrée</SelectItem>
                  <SelectItem value="sortie">Sortie</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="mvt-quantite">Quantité</Label>
              <Input
                id="mvt-quantite"
                type="number"
                min="1"
                value={mouvementQuantite}
                onChange={(e) => setMouvementQuantite(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="mvt-motif">Motif (optionnel)</Label>
              <Input id="mvt-motif" value={mouvementMotif} onChange={(e) => setMouvementMotif(e.target.value)} />
            </div>

            {mouvementError && <p className="text-sm text-red-600">{mouvementError}</p>}

            <Button type="submit" disabled={isMouvementSubmitting}>
              {isMouvementSubmitting ? "Enregistrement..." : "Valider"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}