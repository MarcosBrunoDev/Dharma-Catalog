'use client'

import { useState } from 'react'
import { ExternalLink, MapPin, Tag, CheckCircle, XCircle, AlertCircle, X } from 'lucide-react'

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

export default function ClienteCard({ cliente }: { cliente: Cliente }) {
  const [modalAbierto, setModalAbierto] = useState(false)

  return (
    <>
      <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-all flex flex-col gap-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            {cliente.activo
              ? <CheckCircle size={16} className="text-green-400 shrink-0" />
              : <XCircle size={16} className="text-gray-500 shrink-0" />
            }
            <h2
              onClick={() => setModalAbierto(true)}
              className="text-white font-semibold text-sm leading-tight cursor-pointer hover:text-blue-400 transition-colors"
            >
              {cliente.dominio}
            </h2>
          </div>
          {cliente.url ? (
            <a href={cliente.url?.startsWith('http') ? cliente.url : `https://${cliente.url}`} target="_blank" rel="noopener noreferrer"
              className="text-gray-400 hover:text-white transition-colors shrink-0">
              <ExternalLink size={15} />
            </a>
          ) : (
            <span title="Sin URL">
              <AlertCircle size={15} className="text-yellow-500 shrink-0" />
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 text-xs text-blue-400">
          <Tag size={12} />
          <span>{cliente.rubro}</span>
        </div>

        <div className="flex items-center gap-1 text-xs text-gray-400">
          <MapPin size={12} />
          <span>{cliente.ubicacion}</span>
        </div>

        <p className="text-gray-400 text-xs leading-relaxed line-clamp-3">{cliente.servicios}</p>

        {cliente.serviciosPrincipales.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {cliente.serviciosPrincipales.slice(0, 4).map((s, i) => (
              <span key={i} className="bg-gray-700 text-gray-300 text-xs px-2 py-0.5 rounded-full">
                {s}
              </span>
            ))}
          </div>
        )}

        {cliente.notas && (
          <p className="text-yellow-500 text-xs border-t border-gray-700 pt-2">{cliente.notas}</p>
        )}
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg max-h-[90vh] overflow-y-auto flex flex-col gap-4 p-6">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                {cliente.activo
                  ? <CheckCircle size={16} className="text-green-400 shrink-0" />
                  : <XCircle size={16} className="text-gray-500 shrink-0" />
                }
                <h2 className="text-white font-bold text-lg leading-tight">{cliente.dominio}</h2>
              </div>
              <button onClick={() => setModalAbierto(false)} className="text-gray-400 hover:text-white shrink-0">
                <X size={20} />
              </button>
            </div>

            {cliente.url && (
              
                <a href={cliente.url?.startsWith('http') ? cliente.url : `https://${cliente.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
              >
                <ExternalLink size={14} />
                {cliente.url}
              </a>
            )}

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Rubro</p>
                <p className="text-sm text-white">{cliente.rubro}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Ubicación</p>
                <p className="text-sm text-white">{cliente.ubicacion}</p>
              </div>

              <div className="flex flex-col gap-1">
                <p className="text-xs text-gray-400 uppercase tracking-wider">Servicios</p>
                <p className="text-sm text-gray-300 leading-relaxed">{cliente.servicios}</p>
              </div>

              {cliente.serviciosPrincipales.length > 0 && (
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Servicios Principales</p>
                  <div className="flex flex-wrap gap-1">
                    {cliente.serviciosPrincipales.map((s, i) => (
                      <span key={i} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {cliente.notas && (
                <div className="flex flex-col gap-1">
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Notas</p>
                  <p className="text-sm text-yellow-500">{cliente.notas}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}