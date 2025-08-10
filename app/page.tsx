import { redirect } from "next/navigation"

export default function HomePage() {
  // In a real application, you would check for authentication here
  // If authenticated, redirect to /inicio
  // Else, redirect to /login
  redirect("/login")
}
