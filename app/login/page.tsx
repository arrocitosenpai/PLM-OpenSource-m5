"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth, type UserRole } from "@/lib/auth-context"
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<UserRole | "">("")
  const router = useRouter()
  const { login } = useAuth()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email && role) {
      login(email, role as UserRole)
      router.push("/")
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mb-6 flex items-center justify-center">
            <Image src="/nuvio-logo.png" alt="NUVIO" width={300} height={100} className="h-auto w-64" priority />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Product Lifecycle Manager</h2>
          <p className="text-lg text-muted-foreground">Ship the right product, faster</p>
        </div>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-background"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger id="role" className="bg-background">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="Engineer">Engineer</SelectItem>
                    <SelectItem value="Platform">Platform</SelectItem>
                    <SelectItem value="Admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" className="w-full" size="lg">
                Sign In
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <Button type="button" variant="outline" className="w-full bg-transparent" size="lg" disabled>
                <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"
                  />
                </svg>
                Single Sign-On (SSO)
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          Secure authentication powered by enterprise-grade security
        </p>
      </div>
    </div>
  )
}
