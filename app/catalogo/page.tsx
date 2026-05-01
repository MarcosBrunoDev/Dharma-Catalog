'use client'

import { useEffect, useState, useCallback } from 'react'
import ClienteCard from '../components/ClienteCard'
import Buscador from '../components/Buscador'
import Filtros from '../components/Filtros'
import { Users } from 'lucide-react'

interface Cliente {
  id: number
  activo: boolean
  dominio: string
  url: string | null
  rubro: string
  servicios: string
  ubicacion: string
  serviciosPrincipales: string[]
  notas: string | null
}

export default function CatalogoPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [rubros, setRubros] = useState<string[]>([])
  const [ubicaciones, setUbicaciones] = useState<string[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [rubroActivo, setRubroActivo] = useState('')
  const [ubicacionActiva, setUbicacionActiva] = useState('')
  const [cargando, setCargando] = useState(true)

  const fetchClientes = useCallback(async () => {
    setCargando(true)
    const params = new URLSearchParams()
    if (busqueda) params.set('busqueda', busqueda)
    if (rubroActivo) params.set('rubro', rubroActivo)
    if (ubicacionActiva) params.set('ubicacion', ubicacionActiva)

    const res = await fetch(`/api/clientes?${params.toString()}`)
    const data = await res.json()
    setClientes(data.clientes)
    setRubros(data.rubros)
    setUbicaciones(data.ubicaciones)
    setCargando(false)
  }, [busqueda, rubroActivo, ubicacionActiva])

  useEffect(() => {
    const timeout = setTimeout(fetchClientes, 300)
    return () => clearTimeout(timeout)
  }, [fetchClientes])

  const limpiarFiltros = () => {
    setBusqueda('')
    setRubroActivo('')
    setUbicacionActiva('')
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <Users size={20} className="text-blue-400" />
        <h1 className="text-lg font-bold">Catálogo de Clientes</h1>
        <span className="ml-auto text-sm text-gray-400">{clientes.length} clientes</span>
      </div>

      <div className="flex h-[calc(100vh-61px)]">
        <aside className="w-64 shrink-0 border-r border-gray-800 p-4 overflow-y-auto">
          <Filtros
            rubros={rubros}
            ubicaciones={ubicaciones}
            rubroActivo={rubroActivo}
            ubicacionActiva={ubicacionActiva}
            onRubro={setRubroActivo}
            onUbicacion={setUbicacionActiva}
            onLimpiar={limpiarFiltros}
          />
        </aside>

        <main className="flex-1 p-6 overflow-y-auto flex flex-col gap-4">
          <Buscador valor={busqueda} onChange={setBusqueda} />

          {cargando ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              Cargando...
            </div>
          ) : clientes.length === 0 ? (
            <div className="flex items-center justify-center h-full text-gray-500">
              No se encontraron clientes
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {clientes.map((cliente) => (
                <ClienteCard key={cliente.id} cliente={cliente} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}