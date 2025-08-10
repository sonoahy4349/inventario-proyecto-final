"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import GestionUsuarios from "./gestion-usuarios"

// Simulate current user role for demonstration
// In a real app, this would come from an authentication context
type UserRole = "Administrador" | "Usuario"

export default function ConfiguracionContent() {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>("Administrador") // Change to "Usuario" to test view-only mode

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Configuración</h1>
      <p className="text-muted-foreground">Configuración del sistema y gestión de usuarios</p>

      {/* Role switcher for demonstration */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        Simular rol:
        <select
          value={currentUserRole}
          onChange={(e) => setCurrentUserRole(e.target.value as UserRole)}
          className="p-1 border rounded-md bg-background dark:bg-gray-800"
        >
          <option value="Administrador">Administrador</option>
          <option value="Usuario">Usuario</option>
        </select>
      </div>

      <Tabs defaultValue="usuarios" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usuarios">Usuarios</TabsTrigger>
          <TabsTrigger value="catalogos">Catálogos</TabsTrigger>
          <TabsTrigger value="sistema">Sistema</TabsTrigger>
        </TabsList>
        <TabsContent value="usuarios">
          <GestionUsuarios currentUserRole={currentUserRole} />
        </TabsContent>
        <TabsContent value="catalogos">
          <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Gestión de Catálogos</h2>
            <p className="text-muted-foreground">Contenido para la gestión de catálogos.</p>
          </div>
        </TabsContent>
        <TabsContent value="sistema">
          <div className="p-4 rounded-lg border bg-card text-card-foreground shadow-sm">
            <h2 className="text-xl font-semibold mb-2">Configuración del Sistema</h2>
            <p className="text-muted-foreground">Contenido para la configuración general del sistema.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
