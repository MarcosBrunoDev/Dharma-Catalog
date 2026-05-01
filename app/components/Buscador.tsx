import { Search } from 'lucide-react'

interface Props {
  valor: string
  onChange: (valor: string) => void
}

export default function Buscador({ valor, onChange }: Props) {
  return (
    <div className="relative w-full">
      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Buscar por nombre o servicio..."
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors"
      />
    </div>
  )
}