"use client"

import type React from "react"
import { createContext, useCallback, useContext, useMemo, useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CheckCircle2, XCircle, Info } from "lucide-react"

type FeedbackVariant = "success" | "error" | "info"

type FeedbackState = {
  open: boolean
  title: string
  description?: string
  variant: FeedbackVariant
}

type ShowFeedbackInput = {
  title: string
  description?: string
  variant?: FeedbackVariant
}

type FeedbackContextType = {
  showFeedback: (input: ShowFeedbackInput) => void
  closeFeedback: () => void
}

const FeedbackContext = createContext<FeedbackContextType | null>(null)

export function useFeedback() {
  const ctx = useContext(FeedbackContext)
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider")
  return ctx
}

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<FeedbackState>({
    open: false,
    title: "",
    description: "",
    variant: "info",
  })

  const showFeedback = useCallback((input: ShowFeedbackInput) => {
    setState({
      open: true,
      title: input.title,
      description: input.description,
      variant: input.variant ?? "info",
    })
  }, [])

  const closeFeedback = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }))
  }, [])

  const handleOpenChange = useCallback(
    (open: boolean) => {
      if (!open) {
        closeFeedback()
      }
    },
    [closeFeedback],
  )

  const value = useMemo(() => ({ showFeedback, closeFeedback }), [showFeedback, closeFeedback])

  const icon =
    state.variant === "success" ? (
      <CheckCircle2 className="h-8 w-8 text-emerald-600" aria-hidden="true" />
    ) : state.variant === "error" ? (
      <XCircle className="h-8 w-8 text-red-600" aria-hidden="true" />
    ) : (
      <Info className="h-8 w-8 text-blue-600" aria-hidden="true" />
    )

  const iconBgColor =
    state.variant === "success" ? "bg-emerald-50" : state.variant === "error" ? "bg-red-50" : "bg-blue-50"

  return (
    <FeedbackContext.Provider value={value}>
      {children}
      <Dialog open={state.open} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-md text-center">
          <DialogHeader className="items-center space-y-4">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-full ${iconBgColor}`}>
              {icon}
            </div>
            <DialogTitle className="text-xl font-semibold text-center">{state.title}</DialogTitle>
            {state.description && (
              <DialogDescription className="text-base text-gray-600 text-center">{state.description}</DialogDescription>
            )}
          </DialogHeader>
          <DialogFooter className="flex justify-center mt-6">
            <Button onClick={closeFeedback} className="px-8">
              Aceptar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </FeedbackContext.Provider>
  )
}
