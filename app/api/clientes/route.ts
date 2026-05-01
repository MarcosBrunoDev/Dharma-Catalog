import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const busqueda = searchParams.get('busqueda') || ''
  const rubro = searchParams.get('rubro') || ''
  const ubicacion = searchParams.get('ubicacion') || ''

  const clientes = await prisma.cliente.findMany({
    where: {
      AND: [
        busqueda ? {
          OR: [
            { dominio: { contains: busqueda, mode: 'insensitive' } },
            { servicios: { contains: busqueda, mode: 'insensitive' } },
          ]
        } : {},
        rubro ? { rubro: { contains: rubro, mode: 'insensitive' } } : {},
        ubicacion ? { ubicacion: { contains: ubicacion, mode: 'insensitive' } } : {},
      ]
    },
    orderBy: { dominio: 'asc' }
  })

  const rubros = await prisma.cliente.findMany({
    select: { rubro: true },
    distinct: ['rubro'],
    orderBy: { rubro: 'asc' }
  })

  const ubicaciones = await prisma.cliente.findMany({
    select: { ubicacion: true },
    distinct: ['ubicacion'],
    orderBy: { ubicacion: 'asc' }
  })

  return NextResponse.json({
    clientes,
    rubros: rubros.map(r => r.rubro).filter(Boolean),
    ubicaciones: ubicaciones.map(u => u.ubicacion).filter(Boolean),
  })
}