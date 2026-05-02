'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { LogIn } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setCargando(true)
    setError('')

    const result = await signIn('credentials', {
      username,
      password,
      redirect: false,
    })

    if (result?.error) {
      setError('Usuario o contraseña incorrectos')
      setCargando(false)
    } else {
      router.push('/admin')
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 rounded-2xl p-8 w-full max-w-sm border border-gray-700 flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="bg-blue-600 p-3 rounded-xl">
            <LogIn size={24} className="text-white" />
          </div>
          <h1 className="text-white text-xl font-bold">Acceso Admin</h1>
          <p className="text-gray-400 text-sm">Ingresá tus credenciales</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-gray-400 text-xs font-medium uppercase tracking-wider">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={cargando}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-xl py-2.5 text-sm font-semibold transition-colors"
          >
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  )
}