import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, HardDrive, CheckCircle, XCircle, Users, MapPin } from "lucide-react"

export default function InicioContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard de Inventario de TI</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipos</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">250</div>
            <p className="text-xs text-muted-foreground">+20 nuevos este mes</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos Asignados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">210</div>
            <p className="text-xs text-muted-foreground">84% de asignación</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos de Baja</CardTitle>
            <XCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">5% del total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Responsables Registrados</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">50</div>
            <p className="text-xs text-muted-foreground">Personal de TI y áreas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <BarChart className="h-5 w-5" />
              Distribución de Equipos por Tipo
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span>CPU</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                  <div className="bg-blue-600 h-4 rounded-full" style={{ width: "35%" }}></div>
                </div>
                <span>35%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Monitor</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                  <div className="bg-green-600 h-4 rounded-full" style={{ width: "30%" }}></div>
                </div>
                <span>30%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Laptop</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                  <div className="bg-yellow-600 h-4 rounded-full" style={{ width: "20%" }}></div>
                </div>
                <span>20%</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Impresora</span>
                <div className="w-3/4 bg-gray-200 rounded-full h-4 dark:bg-gray-700">
                  <div className="bg-red-600 h-4 rounded-full" style={{ width: "15%" }}></div>
                </div>
                <span>15%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Equipos por Área/Servicio
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              <li className="flex justify-between items-center">
                <span>Urgencias</span>
                <span className="font-semibold">45 equipos</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Administración</span>
                <span className="font-semibold">30 equipos</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Laboratorio</span>
                <span className="font-semibold">25 equipos</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Radiología</span>
                <span className="font-semibold">20 equipos</span>
              </li>
              <li className="flex justify-between items-center">
                <span>Farmacia</span>
                <span className="font-semibold">15 equipos</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
