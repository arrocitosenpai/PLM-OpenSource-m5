import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import { Toaster } from "@/components/ui/toaster"
import { Suspense } from "react"
import { AuthProvider } from "@/lib/auth-context"
import { LayoutContent } from "@/components/layout-content"
import { ThemeProvider } from "@/lib/theme-context"

export const metadata: Metadata = {
  title: "NUVIO - Product Lifecycle Manager",
  description: "Ship the right product, faster. AI-powered project intelligence and lifecycle management.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme') || 'dark';
                document.documentElement.classList.toggle('dark', theme === 'dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <ThemeProvider>
          <AuthProvider>
            <Suspense fallback={<div>Loading...</div>}>
              <LayoutContent>{children}</LayoutContent>
            </Suspense>
            <Toaster />
            <Analytics />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
