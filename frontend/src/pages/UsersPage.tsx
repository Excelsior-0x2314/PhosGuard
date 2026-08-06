import { useState, useEffect, type FormEvent } from "react"
import { apiFetch } from "@/lib/api"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, Plus } from "lucide-react"
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

interface UserItem {
  id: number
  name: string
  email: string
  role: string
  role_label: string
  is_active: boolean
}

export function UsersPage() {
  const [users, setUsers] = useState<UserItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [formName, setFormName] = useState("")
  const [formEmail, setFormEmail] = useState("")
  const [formPassword, setFormPassword] = useState("")
  const [formRole, setFormRole] = useState("technicien")
  const [formError, setFormError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [editingUser, setEditingUser] = useState<UserItem | null>(null)
  const [editName, setEditName] = useState("")
  const [editEmail, setEditEmail] = useState("")
  const [editRole, setEditRole] = useState("technicien")
  const [editError, setEditError] = useState("")
  const [isEditSubmitting, setIsEditSubmitting] = useState(false)

  const [resetMessage, setResetMessage] = useState<Record<number, string>>({})

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setIsLoading(true)
    setError("")

    const response = await apiFetch("/api/users")

    if (response.ok) {
      const data = await response.json()
      setUsers(data.data)
    } else {
      setError("Impossible de charger les utilisateurs.")
    }

    setIsLoading(false)
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    setFormError("")
    setIsSubmitting(true)

    const response = await apiFetch("/api/users", {
      method: "POST",
      body: JSON.stringify({
        name: formName,
        email: formEmail,
        password: formPassword,
        role: formRole,
      }),
    })

    if (response.ok) {
      setFormName("")
      setFormEmail("")
      setFormPassword("")
      setFormRole("technicien")
      setIsCreateOpen(false)
      loadUsers()
    } else {
      const data = await response.json()
      setFormError(data.message || "Erreur lors de la création.")
    }

    setIsSubmitting(false)
  }

  function openEditDialog(u: UserItem) {
    setEditingUser(u)
    setEditName(u.name)
    setEditEmail(u.email)
    setEditRole(u.role)
    setEditError("")
  }

  async function handleUpdate(e: FormEvent) {
    e.preventDefault()
    if (!editingUser) return

    setEditError("")
    setIsEditSubmitting(true)

    const response = await apiFetch(`/api/users/${editingUser.id}`, {
      method: "PUT",
      body: JSON.stringify({
        name: editName,
        email: editEmail,
        role: editRole,
      }),
    })

    if (response.ok) {
      setEditingUser(null)
      loadUsers()
    } else {
      const data = await response.json()
      setEditError(data.message || "Erreur lors de la modification.")
    }

    setIsEditSubmitting(false)
  }

  async function handleDelete(u: UserItem) {
    const confirmed = window.confirm(`Supprimer l'utilisateur "${u.name}" ?`)
    if (!confirmed) return

    const response = await apiFetch(`/api/users/${u.id}`, {
      method: "DELETE",
    })

    if (response.ok) {
      loadUsers()
    } else {
      alert("Erreur lors de la suppression.")
    }
  }

  async function handleToggleActive(u: UserItem) {
    const response = await apiFetch(`/api/users/${u.id}/toggle-active`, {
      method: "PATCH",
    })

    if (response.ok) {
      loadUsers()
    } else {
      alert("Erreur lors du changement de statut.")
    }
  }

  async function handleSendResetEmail(u: UserItem) {
    const response = await apiFetch("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email: u.email }),
    })

    const data = await response.json()
    setResetMessage((prev) => ({ ...prev, [u.id]: data.message }))

    setTimeout(() => {
      setResetMessage((prev) => {
        const next = { ...prev }
        delete next[u.id]
        return next
      })
    }, 4000)
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
            <Users className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Utilisateurs</h1>
            <p className="text-sm text-muted-foreground">Gestion des comptes et des rôles.</p>
          </div>
        </div>

        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />Nouvel utilisateur</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nouvel utilisateur</DialogTitle>
            </DialogHeader>

            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nom</Label>
                <Input id="name" value={formName} onChange={(e) => setFormName(e.target.value)} required />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} required />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">Mot de passe</Label>
                <Input id="password" type="password" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} required />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="role">Rôle</Label>
                <Select value={formRole} onValueChange={setFormRole}>
                  <SelectTrigger id="role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Administrateur</SelectItem>
                    <SelectItem value="responsable">Responsable</SelectItem>
                    <SelectItem value="technicien">Technicien</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formError && <p className="text-sm text-red-600">{formError}</p>}

              <Button type="submit" disabled={isSubmitting}>
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
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Rôle</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.role_label}</TableCell>
                  <TableCell>
                    <Badge variant={u.is_active ? "default" : "destructive"}>
                      {u.is_active ? "Actif" : "Désactivé"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => openEditDialog(u)}>
                        Modifier
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleToggleActive(u)}>
                        {u.is_active ? "Désactiver" : "Activer"}
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => handleSendResetEmail(u)}>
                        Reset mot de passe
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(u)}>
                        Supprimer
                      </Button>
                      {resetMessage[u.id] && (
                        <span className="text-xs text-green-600">{resetMessage[u.id]}</span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={editingUser !== null} onOpenChange={(open) => !open && setEditingUser(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifier l'utilisateur</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleUpdate} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-name">Nom</Label>
              <Input id="edit-name" value={editName} onChange={(e) => setEditName(e.target.value)} required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-email">Email</Label>
              <Input id="edit-email" type="email" value={editEmail} onChange={(e) => setEditEmail(e.target.value)} required />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-role">Rôle</Label>
              <Select value={editRole} onValueChange={setEditRole}>
                <SelectTrigger id="edit-role">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Administrateur</SelectItem>
                  <SelectItem value="responsable">Responsable</SelectItem>
                  <SelectItem value="technicien">Technicien</SelectItem>
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