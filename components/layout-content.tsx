"use client"

import type React from "react"
import { usePathname, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { AppSidebar } from "@/components/app-sidebar"
import { AppHeader } from "@/components/app-header"
import { useEffect } from "react"

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated && pathname !== "/login") {
      router.push("/login")
    } else if (isAuthenticated && pathname === "/login") {
      router.push("/")
    }
  }, [isAuthenticated, pathname, router])

  // Show loading state while redirecting
  if (!isAuthenticated && pathname !== "/login") {
    return null
  }

  if (isAuthenticated && pathname === "/login") {
    return null
  }

  // If on login page, render without sidebar and header
  if (pathname === "/login") {
    return <main className="h-screen">{children}</main>
  }

  // For authenticated pages, render with sidebar and header
  return (
    <div className="flex h-screen overflow-hidden">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <AppHeader />
        <main className="flex-1 overflow-y-auto px-8">{children}</main>
      </div>
    </div>
  )
}
