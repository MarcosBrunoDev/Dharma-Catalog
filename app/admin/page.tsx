'use client'

import { useState, useEffect, useCallback } from 'react'
import { signOut } from 'next-auth/react'
import { Plus, Pencil, Trash2, LogOut, Search, X, Check } from 'lucide-react'

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

const clienteVacio: Omit<Cliente, 'id'> = {
  activo: false,
  dominio: '',
  url: '',
  rubro: '',
  servicios: '',
  ubicacion: '',
  serviciosPrincipales: [],
  notas: '',
}

export default function AdminPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [modal, setModal] = useState<'crear' | 'editar' | null>(null)
  const [clienteActual, setClienteActual] = useState<Omit<Cliente, 'id'>>(clienteVacio)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [servicioInput, setServicioInput] = useState('')
  const [guardando, setGuardando] = useState(false)

  const fetchClientes = useCallback(async () => {
    setCargando(true)
    const params = new URLSearchParams()
    if (busqueda) params.set('busqueda', busqueda)
    const res = await fetch(`/api/clientes?${params.toString()}`)
    const data = await res.json()
    setClientes(data.clientes)
    setCargando(false)
  }, [busqueda])

  useEffect(() => {
    const timeout = setTimeout(fetchClientes, 300)
    return () => clearTimeout(timeout)
  }, [fetchClientes])

  const abrirCrear = () => {
    setClienteActual(clienteVacio)
    setServicioInput('')
    setModal('crear')
  }

  const abrirEditar = (cliente: Cliente) => {
    setClienteActual({ ...cliente })
    setEditandoId(cliente.id)
    setServicioInput('')
    setModal('editar')
  }

  const cerrarModal = () => {
    setModal(null)
    setEditandoId(null)
    setClienteActual(clienteVacio)
  }

  const agregarServicio = () => {
    if (!servicioInput.trim()) return
    setClienteActual(prev => ({
      ...prev,
      serviciosPrincipales: [...prev.serviciosPrincipales, servicioInput.trim()]
    }))
    setServicioInput('')
  }

  const quitarServicio = (i: number) => {
    setClienteActual(prev => ({
      ...prev,
      serviciosPrincipales: prev.serviciosPrincipales.filter((_, idx) => idx !== i)
    }))
  }

  const guardar = async () => {
    setGuardando(true)
    if (modal === 'crear') {
      await fetch('/api/clientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteActual),
      })
    } else {
      await fetch(`/api/clientes/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(clienteActual),
      })
    }
    await fetchClientes()
    setGuardando(false)
    cerrarModal()
  }

  const eliminar = async (id: number) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return
    await fetch(`/api/clientes/${id}`, { method: 'DELETE' })
    await fetchClientes()
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="border-b border-gray-800 px-6 py-4 flex items-center gap-3">
        <h1 className="text-lg font-bold">Admin — Clientes</h1>
        <span className="text-sm text-gray-400">{clientes.length} clientes</span>
        <div className="ml-auto flex items-center gap-3">
          <button onClick={abrirCrear}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm font-semibold transition-colors">
            <Plus size={16} /> Nuevo cliente
          </button>
          <button onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm">
            <LogOut size={16} /> Salir
          </button>
        </div>
      </div>

      <div className="p-6 flex flex-col gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar cliente..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500"
          />
        </div>

        {cargando ? (
          <p className="text-gray-500 text-center py-10">Cargando...</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-700">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-gray-400 text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Dominio</th>
                  <th className="px-4 py-3 text-left">Rubro</th>
                  <th className="px-4 py-3 text-left">Ubicación</th>
                  <th className="px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {clientes.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-800 transition-colors">
                    <td className="px-4 py-3">
                      {c.activo
                        ? <span className="flex items-center gap-1 text-green-400"><Check size={14} /> Activo</span>
                        : <span className="text-gray-500">Inactivo</span>
                      }
                    </td>
                    <td className="px-4 py-3 font-medium">{c.dominio}</td>
                    <td className="px-4 py-3 text-gray-400">{c.rubro}</td>
                    <td className="px-4 py-3 text-gray-400">{c.ubicacion}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button onClick={() => abrirEditar(c)}
                          className="text-gray-400 hover:text-white transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button onClick={() => eliminar(c.id)}
                          className="text-gray-400 hover:text-red-400 transition-colors">
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col gap-4 p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-lg">{modal === 'crear' ? 'Nuevo cliente' : 'Editar cliente'}</h2>
              <button onClick={cerrarModal} className="text-gray-400 hover:text-white"><X size={20} /></button>
            </div>

            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" checked={clienteActual.activo}
                  onChange={(e) => setClienteActual(p => ({ ...p, activo: e.target.checked }))}
                  className="rounded" />
                Cliente activo
              </label>

              {[
                { label: 'Dominio', key: 'dominio' },
                { label: 'URL', key: 'url' },
                { label: 'Rubro', key: 'rubro' },
                { label: 'Ubicación', key: 'ubicacion' },
              ].map(({ label, key }) => (
                <div key={key} className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400 uppercase tracking-wider">{label}</label>
                  <input
                    type="text"
                    value={(clienteActual as any)[key] || ''}
                    onChange={(e) => setClienteActual(p => ({ ...p, [key]: e.target.value }))}
                    className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                </div>
              ))}

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Servicios</label>
                <textarea
                  value={clienteActual.servicios}
                  onChange={(e) => setClienteActual(p => ({ ...p, servicios: e.target.value }))}
                  rows={3}
                  className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Servicios Principales</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={servicioInput}
                    onChange={(e) => setServicioInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && agregarServicio()}
                    placeholder="Agregar servicio..."
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                  />
                  <button onClick={agregarServicio}
                    className="bg-blue-600 hover:bg-blue-700 px-3 rounded-xl transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
                <div className="flex flex-wrap gap-1">
                  {clienteActual.serviciosPrincipales.map((s, i) => (
                    <span key={i} className="flex items-center gap-1 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                      {s}
                      <button onClick={() => quitarServicio(i)} className="hover:text-red-400">
                        <X size={10} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 uppercase tracking-wider">Notas</label>
                <textarea
                  value={clienteActual.notas || ''}
                  onChange={(e) => setClienteActual(p => ({ ...p, notas: e.target.value }))}
                  rows={2}
                  className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button onClick={cerrarModal}
                className="flex-1 bg-gray-700 hover:bg-gray-600 rounded-xl py-2.5 text-sm font-semibold transition-colors">
                Cancelar
              </button>
              <button onClick={guardar} disabled={guardando}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl py-2.5 text-sm font-semibold transition-colors">
                {guardando ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}