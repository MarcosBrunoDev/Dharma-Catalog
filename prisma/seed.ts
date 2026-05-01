import { PrismaClient } from '@prisma/client'
import * as XLSX from 'xlsx'
import * as path from 'path'

const prisma = new PrismaClient()

function parsearServicios(texto: string | null | undefined): string[] {
  if (!texto) return []
  return texto
    .split(/[,;()\n]/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3)
}

async function main() {
  const filePath = path.join(__dirname, '../Lista_de_Páginas_Dharma__1_.xlsx')
  const workbook = XLSX.readFile(filePath)
  const sheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows: any[] = XLSX.utils.sheet_to_json(sheet)

  console.log(`Importando ${rows.length} clientes...`)

  for (const row of rows) {
    const dominio = row['Dominio'] || ''
    if (!dominio) continue

    await prisma.cliente.create({
      data: {
        activo: row['Columna1'] === true || row['Columna1'] === 'TRUE',
        dominio: dominio,
        url: `https://${dominio.toLowerCase().replace(/\s+/g, '')}`,
        rubro: row['Rubro'] || '',
        servicios: row['Servicios'] || '',
        ubicacion: row['Ubicación'] || '',
        serviciosPrincipales: parsearServicios(row['Servicios Principales']),
        notas: row['Notas'] || null,
      },
    })
  }

  console.log('¡Importación completada!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())