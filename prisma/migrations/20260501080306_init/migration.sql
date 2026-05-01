-- CreateTable
CREATE TABLE "Cliente" (
    "id" SERIAL NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT false,
    "dominio" TEXT NOT NULL,
    "url" TEXT,
    "rubro" TEXT NOT NULL,
    "servicios" TEXT NOT NULL,
    "ubicacion" TEXT NOT NULL,
    "serviciosPrincipales" TEXT[],
    "notas" TEXT,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);
