import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params
  const body = await request.json()

  const cliente = await prisma.cliente.update({
    where: { id: parseInt(id) },
    data: {
      activo: body.activo,
      dominio: body.dominio,
      url: body.url,
      rubro: body.rubro,
      servicios: body.servicios,
      ubicacion: body.ubicacion,
      serviciosPrincipales: body.serviciosPrincipales,
      notas: body.notas,
    },
  })

  return NextResponse.json(cliente)
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

  const { id } = await params

  await prisma.cliente.delete({
    where: { id: parseInt(id) },
  })

  return NextResponse.json({ ok: true })
}