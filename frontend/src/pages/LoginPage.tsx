import { useState, type FormEvent } from "react"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ShieldCheck, Activity, Clock, Users } from "lucide-react"

const features = [
  { icon: ShieldCheck, title: "Sécurisé", desc: "Données protégées et accès contrôlés par rôle" },
  { icon: Activity, title: "Centralisé", desc: "Équipements, tickets et stock au même endroit" },
  { icon: Clock, title: "Réactif", desc: "Suivi en temps réel des délais d'intervention" },
  { icon: Users, title: "Collaboratif", desc: "Techniciens, responsables et admins coordonnés" },
]

export function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const result = await login(email, password)

    if (!result.success) {
      setError(result.message)
    }

    setIsSubmitting(false)
  }

  return (
    <div className="flex min-h-screen">
      <div className="hidden w-1/2 flex-col justify-center bg-primary px-16 py-12 text-primary-foreground lg:flex">
        <img src="/logos/logo-ocp.png" alt="OCP" className="mb-10 h-24 w-24 rounded-xl bg-white object-contain p-3" />

       <h1 className="mb-4 text-4xl font-bold leading-tight">
          Un seul outil pour<br />
          <span className="text-white/70">piloter la maintenance.</span>
        </h1>
        <p className="mb-10 max-w-md text-primary-foreground/80">
          Du ticket d'incident à la pièce de rechange consommée, PhosGuard relie
          chaque équipement, chaque intervention et chaque technicien sur une
          même plateforme.
        </p>

        <div className="grid max-w-md grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="flex gap-3">
              <f.icon className="mt-0.5 h-5 w-5 shrink-0 text-white/70" />
              <div>
                <p className="text-sm font-semibold">{f.title}</p>
                <p className="text-xs text-primary-foreground/70">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex w-full flex-col items-center justify-center bg-background px-6 lg:w-1/2">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center text-center">
            <img src="/logos/logo-phosguard.png" alt="PhosGuard" className="mb-1 h-60 w-60 object-contain" />
            <h2 className="text-xl font-bold text-foreground">PhosGuard</h2>
            <p className="text-sm text-muted-foreground">Maintenance · Sûreté · Performance</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Identifiant de connexion</Label>
              <Input
                id="email"
                type="email"
                placeholder="Ex: nom@phosguard.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" disabled={isSubmitting} className="mt-2">
              {isSubmitting ? "Connexion..." : "Se connecter"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Besoin d'aide ? Contactez votre administrateur.
          </p>
        </div>
      </div>
    </div>
  )
}