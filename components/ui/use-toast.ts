"use client"

import * as React from "react"
import type { ToastAction } from "@/components/ui/toast"
import { useFeedback } from "@/components/feedback/feedback-provider"

const TOAST_LIMIT = 1
const TOAST_REMOVE_DELAY = 1000000
const DURATION = 5000

type ToasterToast = {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactElement<typeof ToastAction>
  variant?: "default" | "destructive" | "success"
}

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_VALUE
  return count.toString()
}

type Action =
  | {
      type: "ADD_TOAST"
      toast: ToasterToast
    }
  | {
      type: "UPDATE_TOAST"
      toast: Partial<ToasterToast>
    }
  | {
      type: "DISMISS_TOAST"
      toastId?: string
    }
  | {
      type: "REMOVE_TOAST"
      toastId?: string
    }

interface State {
  toasts: ToasterToast[]
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case "DISMISS_TOAST": {
      const { toastId } = action

      if (toastId) {
        return {
          ...state,
          toasts: state.toasts.map((t) => (t.id === toastId ? { ...t, open: false } : t)),
        }
      }
      return {
        ...state,
        toasts: state.toasts.map((t) => ({ ...t, open: false })),
      }
    }

    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const ToastContext = React.createContext<{ toast: ({ ...props }: ToasterToast) => { id: string } } | undefined>(
  undefined,
)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, { toasts: [] })
  const { showFeedback } = useFeedback()

  const addToast = React.useCallback(
    (toast: ToasterToast) => {
      const id = genId()
      const newToast = { ...toast, id }
      dispatch({ type: "ADD_TOAST", toast: newToast })

      // Map toast variants to feedback variants
      let variant: "success" | "error" | "info" = "info"
      if (toast.variant === "success") {
        variant = "success"
      } else if (toast.variant === "destructive") {
        variant = "error"
      }

      // Show feedback with a slight delay to ensure proper modal handling
      setTimeout(() => {
        showFeedback({
          title:
            toast.title?.toString() ||
            (variant === "success" ? "Éxito" : variant === "error" ? "Error" : "Información"),
          description: toast.description?.toString(),
          variant: variant,
        })
      }, 50)

      return id
    },
    [showFeedback],
  )

  const toast = React.useCallback(({ ...props }: ToasterToast) => addToast(props), [addToast])

  return <ToastContext.Provider value={{ toast }}>{children}</ToastContext.Provider>
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
