const API_BASE_URL = "http://localhost:8000"

function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(";").shift()!)
  }
  return null
}

async function getCsrfCookie(): Promise<void> {
  await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
    credentials: "include",
  })
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  await getCsrfCookie()

  const xsrfToken = getCookie("XSRF-TOKEN")

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(xsrfToken ? { "X-XSRF-TOKEN": xsrfToken } : {}),
      ...options.headers,
    },
  })

  return response
}