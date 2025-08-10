"use client"
import { Bell } from "lucide-react"
import { ThemeToggle } from "../theme-toggle"
import { useState } from "react"
import Image from "next/image"
import EditProfileModal from "./edit-profile-modal"

// Simulate current logged-in user data
const MOCK_LOGGED_IN_USER = {
  name: "Juan Pérez López",
  email: "juan.perez@hospital.com",
  avatar: "https://ferf1mheo22r9ira.public.blob.vercel-storage.com/avatar-01-n0x8HFv8EUetf9z6ht0wScJKoTHqf8.png",
  role: "Administrador", // Added role
}

export default function TopNav() {
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState(MOCK_LOGGED_IN_USER) // State to hold user data

  const handleSaveProfile = (updatedData: any) => {
    console.log("Perfil actualizado:", updatedData)
    // In a real app, you'd send this data to a backend API
    // For now, update the local state for demonstration
    setCurrentUser((prev) => ({
      ...prev,
      name: updatedData.name,
      email: updatedData.email,
      avatar: updatedData.avatar || prev.avatar, // Update avatar if a new one was "uploaded"
    }))
    alert("Perfil actualizado con éxito (simulado)!")
  }

  return (
    <nav className="px-3 sm:px-6 flex items-center justify-between bg-white dark:bg-[#0F0F12] border-b border-gray-200 dark:border-[#1F1F23] h-full">
      <div className="font-medium text-sm text-gray-900 dark:text-gray-100">Inventario de Equipos de TI - Hospital</div>

      <div className="flex items-center gap-2 sm:gap-4 ml-auto sm:ml-0">
        <button
          type="button"
          className="p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-full transition-colors"
        >
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 dark:text-gray-300" />
        </button>

        <ThemeToggle />

        {/* User Profile Display and Clickable Area */}
        <button
          type="button"
          onClick={() => setIsEditProfileModalOpen(true)}
          className="flex items-center gap-2 p-1.5 sm:p-2 hover:bg-gray-100 dark:hover:bg-[#1F1F23] rounded-full transition-colors focus:outline-none"
          aria-label="Configuración de perfil de usuario"
        >
          <Image
            src={currentUser.avatar || "/placeholder.svg?height=28&width=28&query=user avatar"}
            alt="User avatar"
            width={28}
            height={28}
            className="rounded-full ring-2 ring-gray-200 dark:ring-[#2B2B30] sm:w-8 sm:h-8 object-cover"
          />
          <div className="hidden md:flex flex-col items-start text-left">
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{currentUser.name}</span>
            <span className="text-xs text-gray-600 dark:text-gray-400">{currentUser.role}</span>
          </div>
        </button>
      </div>

      <EditProfileModal
        isOpen={isEditProfileModalOpen}
        onClose={() => setIsEditProfileModalOpen(false)}
        onSave={handleSaveProfile}
        initialData={{
          name: currentUser.name,
          email: currentUser.email,
          avatar: currentUser.avatar,
        }}
      />
    </nav>
  )
}
