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

  const onLoginPage = pathname === "/login"

  // Client-side redirect logic (auth gate)
  useEffect(() => {
    if (!isAuthenticated && !onLoginPage) {
      // user is not authenticated and is not already on /login -> send them to /login
      router.push("/login")
    } else if (isAuthenticated && onLoginPage) {
      // user is authenticated but is on /login -> send them "home"
      router.push("/")
    }
  }, [isAuthenticated, onLoginPage, router])

  //
  // IMPORTANT PART:
  // We ALWAYS return the SAME outer structure:
  // <div className="flex h-screen overflow-hidden"> ... </div>
  //
  // We do NOT `return null`, and we do NOT swap the entire tree based on auth or route.
  // Instead, we conditionally HIDE pieces (sidebar/header) with CSS classes,
  // but we keep the DOM shape stable on first paint.
  //
  // This prevents server HTML and client HTML from disagreeing during hydration.
  //

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar area.
         - On /login we don't want to SEE the sidebar, so we hide it with className="hidden".
         - But we still render a wrapper div in the tree. That keeps the DOM structure consistent.
      */}
      <div className={onLoginPage ? "hidden" : "block"}>
        <AppSidebar />
      </div>

      {/* Main column */}
      <div className="flex flex-1 flex-col">
        {/* Header area.
           - Same trick: hide on /login but keep the node so SSR/CSR match.
        */}
        <div className={onLoginPage ? "hidden" : "block"}>
          <AppHeader />
        </div>

        {/* Page content.
           - We ALWAYS render {children}.
           - We do NOT return null here based on auth, because that would cause
             the server to render something different than the client once auth resolves.
           - For styling: login page shouldn't have padding px-8, so we switch className.
           - This className change is safe because it's based ONLY on pathname,
             and pathname is identical on server and client.
        */}
        <main
          className={
            onLoginPage
              ? "flex-1 overflow-y-auto" // full-screen login view styling
              : "flex-1 overflow-y-auto px-8" // normal app page styling
          }
        >
          {children}
        </main>
      </div>
    </div>
  )
}
