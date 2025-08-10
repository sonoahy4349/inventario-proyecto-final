"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, UploadCloud } from "lucide-react"
import Image from "next/image"
import { useToast } from "@/components/ui/use-toast"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: { name: string; email: string; newPassword?: string; avatar?: string }) => void
  initialData: {
    name: string
    email: string
    avatar: string
  }
}

export default function EditProfileModal({ isOpen, onClose, onSave, initialData }: EditProfileModalProps) {
  const [name, setName] = useState(initialData.name)
  const [email, setEmail] = useState(initialData.email)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [avatarPreview, setAvatarPreview] = useState(initialData.avatar)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (isOpen) {
      setName(initialData.name)
      setEmail(initialData.email)
      setAvatarPreview(initialData.avatar)
      setCurrentPassword("")
      setNewPassword("")
      setConfirmNewPassword("")
      setAvatarFile(null)
    }
  }, [initialData, isOpen])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setAvatarFile(file)
      setAvatarPreview(URL.createObjectURL(file))
    }
  }

  const handleSubmit = () => {
    if (!name.trim() || !email.trim()) {
      toast({
        title: "Error",
        description: "Nombre y Email son obligatorios.",
        variant: "destructive",
      })
      return
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast({
        title: "Error",
        description: "Por favor, introduce un email válido.",
        variant: "destructive",
      })
      return
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        toast({
          title: "Error",
          description: "La nueva contraseña debe tener al menos 6 caracteres.",
          variant: "destructive",
        })
        return
      }
      if (newPassword !== confirmNewPassword) {
        toast({
          title: "Error",
          description: "La nueva contraseña y la confirmación no coinciden.",
          variant: "destructive",
        })
        return
      }
      console.log("Simulando verificación de contraseña actual:", currentPassword)
    }

    const updatedData: any = { name, email }
    if (newPassword) {
      updatedData.newPassword = newPassword
    }
    if (avatarFile) {
      console.log("Simulando subida de avatar:", avatarFile.name)
      updatedData.avatar = avatarPreview
    }

    onSave(updatedData)

    // Close modal first, then show success message
    onClose()

    // Show success message after modal is closed
    setTimeout(() => {
      toast({
        title: "Éxito",
        description: "Perfil actualizado correctamente.",
        variant: "success",
      })
    }, 200)
  }

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>Editar Perfil de Usuario</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-24 h-24 rounded-full overflow-hidden">
              <Image
                src={avatarPreview || "/placeholder.svg?height=96&width=96&query=user avatar"}
                alt="Avatar de usuario"
                layout="fill"
                objectFit="cover"
                className="rounded-full"
              />
            </div>
            <Label htmlFor="avatar-upload" className="cursor-pointer text-blue-600 hover:underline">
              <UploadCloud className="inline-block mr-2 h-4 w-4" />
              Cambiar foto de perfil
            </Label>
            <Input id="avatar-upload" type="file" className="hidden" onChange={handleAvatarChange} accept="image/*" />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Nombre
            </Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="col-span-3"
              type="email"
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="currentPassword" className="text-right">
              Contraseña Actual
            </Label>
            <Input
              id="currentPassword"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="col-span-3"
              placeholder="Deja vacío si no cambias contraseña"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="newPassword" className="text-right">
              Nueva Contraseña
            </Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="col-span-3"
              placeholder="Mínimo 6 caracteres"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="confirmNewPassword" className="text-right">
              Confirmar Nueva
            </Label>
            <Input
              id="confirmNewPassword"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>
            <Save className="mr-2 h-4 w-4" />
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
