import { useState, useEffect } from "react"
import { apiFetch } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface NotificationItem {
  id: number
  type: string
  message: string
  lien: string | null
  lu: boolean
  created_at: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    loadNotifications()
    const interval = setInterval(loadNotifications, 30000)
    return () => clearInterval(interval)
  }, [])

  async function loadNotifications() {
    const response = await apiFetch("/api/notifications")
    if (response.ok) {
      const data = await response.json()
      setNotifications(data.data)
      setUnreadCount(data.unread_count)
    }
  }

  async function handleMarkAsRead(id: number) {
    await apiFetch(`/api/notifications/${id}/read`, { method: "PATCH" })
    loadNotifications()
  }

  async function handleMarkAllAsRead() {
    await apiFetch("/api/notifications/mark-all-read", { method: "PATCH" })
    loadNotifications()
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="relative">
          🔔
          {unreadCount > 0 && (
            <Badge variant="destructive" className="absolute -right-2 -top-2 h-5 min-w-5 justify-center rounded-full px-1 text-xs">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="flex items-center justify-between border-b p-3">
          <p className="font-semibold text-sm">Notifications</p>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllAsRead} className="text-xs text-blue-600 hover:underline">
              Tout marquer comme lu
            </button>
          )}
        </div>

        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 && (
            <p className="p-4 text-center text-sm text-slate-400">Aucune notification.</p>
          )}

          {notifications.map((notif) => (
            <div
              key={notif.id}
              onClick={() => !notif.lu && handleMarkAsRead(notif.id)}
              className={`cursor-pointer border-b p-3 text-sm hover:bg-slate-50 ${
                notif.lu ? "text-slate-500" : "bg-blue-50 font-medium text-slate-900"
              }`}
            >
              <p>{notif.message}</p>
              <p className="mt-1 text-xs text-slate-400">
                {new Date(notif.created_at).toLocaleString("fr-FR")}
              </p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}