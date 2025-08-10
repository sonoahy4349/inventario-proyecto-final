// lib/supabase/server.ts
import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"

export function createClient() {
  const cookieStore = cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch (error) {
          // The `set` method was called from a Server Component.
          // This can be ignored if you have enabled the `experimental_taint_and_suspend_wrapper` flag in next.config.js
          // console.error('Error setting cookie from Server Component:', error);
        }
      },
      remove(name: string, options: any) {
        try {
          cookieStore.set({ name, value: "", ...options })
        } catch (error) {
          // The `remove` method was called from a Server Component.
          // This can be ignored if you have enabled the `experimental_taint_and_suspend_wrapper` flag in next.config.js
          // console.error('Error removing cookie from Server Component:', error);
        }
      },
    },
  })
}
