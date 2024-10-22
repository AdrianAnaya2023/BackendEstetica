-- CreateTable
CREATE TABLE "Productos" (
    "id" BIGSERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "categoria_id" BIGINT NOT NULL,

    CONSTRAINT "Productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaProductos" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "imagen" TEXT,

    CONSTRAINT "CategoriaProductos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaConsejos" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,

    CONSTRAINT "CategoriaConsejos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consejos" (
    "id" BIGSERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,
    "categoria_id" BIGINT NOT NULL,

    CONSTRAINT "Consejos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuarios" (
    "id" BIGSERIAL NOT NULL,
    "usuario" TEXT NOT NULL,
    "contrasena" TEXT NOT NULL,

    CONSTRAINT "Usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Footer" (
    "id" BIGSERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "logo_img" TEXT NOT NULL,
    "nombre_dueno" TEXT NOT NULL,

    CONSTRAINT "Footer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaGaleria" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "imagen" TEXT NOT NULL,

    CONSTRAINT "CategoriaGaleria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Galeria" (
    "id" BIGSERIAL NOT NULL,
    "foto_antes" TEXT NOT NULL,
    "foto_despues" TEXT NOT NULL,
    "categoria_id" BIGINT NOT NULL,

    CONSTRAINT "Galeria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promos" (
    "id" BIGSERIAL NOT NULL,
    "foto" TEXT NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "fecha_fin" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Promos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Encuestas" (
    "id" BIGSERIAL NOT NULL,
    "pregunta" TEXT NOT NULL,
    "bueno" BIGINT NOT NULL,
    "malo" BIGINT NOT NULL,
    "regular" BIGINT NOT NULL,

    CONSTRAINT "Encuestas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Homepage" (
    "id" BIGSERIAL NOT NULL,
    "descripcion" TEXT NOT NULL,
    "foto_dueno" TEXT NOT NULL,
    "fotos_local" JSONB NOT NULL,

    CONSTRAINT "Homepage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoriaServicio" (
    "id" BIGSERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "imagen" TEXT,

    CONSTRAINT "CategoriaServicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Servicio" (
    "id" BIGSERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "descripcion" TEXT,
    "imagen" TEXT,
    "categoria_id" BIGINT NOT NULL,

    CONSTRAINT "Servicio_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Productos" ADD CONSTRAINT "Productos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "CategoriaProductos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consejos" ADD CONSTRAINT "Consejos_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "CategoriaConsejos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Galeria" ADD CONSTRAINT "Galeria_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "CategoriaGaleria"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Servicio" ADD CONSTRAINT "Servicio_categoria_id_fkey" FOREIGN KEY ("categoria_id") REFERENCES "CategoriaServicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
