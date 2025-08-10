import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { FeedbackProvider } from "@/components/feedback/feedback-provider"
import { ToastProvider } from "@/components/ui/use-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Inventario de Equipos de TI - Hospital",
  description: "Sistema de gestión de inventario de equipos de cómputo para el área de TI de un hospital.",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <FeedbackProvider>
            <ToastProvider>{children}</ToastProvider>
          </FeedbackProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
