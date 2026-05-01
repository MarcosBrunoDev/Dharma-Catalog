import { ExternalLink, MapPin, Tag, CheckCircle, XCircle } from 'lucide-react'

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
  return (
    <div className="bg-gray-800 rounded-xl p-5 border border-gray-700 hover:border-gray-500 transition-all flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          {cliente.activo
            ? <CheckCircle size={16} className="text-green-400 shrink-0" />
            : <XCircle size={16} className="text-gray-500 shrink-0" />
          }
          <h2 className="text-white font-semibold text-sm leading-tight">{cliente.dominio}</h2>
        </div>
        {cliente.url && (
          <a href={cliente.url} target="_blank" rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors shrink-0">
            <ExternalLink size={15} />
          </a>
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
  )
}