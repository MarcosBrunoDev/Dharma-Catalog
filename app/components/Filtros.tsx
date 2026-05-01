import { X } from 'lucide-react'

interface Props {
  rubros: string[]
  ubicaciones: string[]
  rubroActivo: string
  ubicacionActiva: string
  onRubro: (rubro: string) => void
  onUbicacion: (ubicacion: string) => void
  onLimpiar: () => void
}

export default function Filtros({ rubros, ubicaciones, rubroActivo, ubicacionActiva, onRubro, onUbicacion, onLimpiar }: Props) {
  const hayFiltros = rubroActivo || ubicacionActiva

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm">Filtros</h3>
        {hayFiltros && (
          <button onClick={onLimpiar} className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors">
            <X size={12} /> Limpiar
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Rubro</p>
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
          {rubros.map((r) => (
            <button
              key={r}
              onClick={() => onRubro(r === rubroActivo ? '' : r)}
              className={`text-left text-xs px-3 py-1.5 rounded-lg transition-colors ${
                rubroActivo === r
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Ubicación</p>
        <div className="flex flex-col gap-1 max-h-48 overflow-y-auto pr-1">
          {ubicaciones.map((u) => (
            <button
              key={u}
              onClick={() => onUbicacion(u === ubicacionActiva ? '' : u)}
              className={`text-left text-xs px-3 py-1.5 rounded-lg transition-colors ${
                ubicacionActiva === u
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-400 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}