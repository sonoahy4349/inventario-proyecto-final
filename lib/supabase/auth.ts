import { createClient } from "./client"
import type { User } from "@supabase/supabase-js"

const supabase = createClient()

export interface AuthUser {
  id: string
  email: string
  name?: string
  role?: string
}

export interface SignInCredentials {
  email: string
  password: string
}

export interface SignUpCredentials {
  email: string
  password: string
  name: string
  role?: "Administrador" | "Usuario"
}
