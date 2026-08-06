import { useState, type FormEvent } from "react"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ResetPasswordPageProps {
  token: string
  email: string
}

export function ResetPasswordPage({ token, email }: ResetPasswordPageProps) {
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    const response = await apiFetch("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({
        token,
        email,
        password,
        password_confirmation: passwordConfirmation,
      }),
    })

    const data = await response.json()

    if (response.ok) {
      setSuccess(true)
    } else {
      setError(data.message || "Erreur lors de la réinitialisation.")
    }

    setIsSubmitting(false)
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 text-center shadow-sm">
          <h2 className="mb-2 text-lg font-bold text-foreground">Mot de passe réinitialisé</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.
          </p>
          <Button onClick={() => (window.location.href = "/")}>Aller à la connexion</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        <h2 className="mb-1 text-center text-xl font-bold text-foreground">Réinitialiser le mot de passe</h2>
        <p className="mb-6 text-center text-sm text-muted-foreground">{email}</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password_confirmation">Confirmer le mot de passe</Label>
            <Input
              id="password_confirmation"
              type="password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Réinitialisation..." : "Réinitialiser"}
          </Button>
        </form>
      </div>
    </div>
  )
}