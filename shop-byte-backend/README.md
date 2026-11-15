# Shop&Byte - Backend

Backend del proyecto **Shop&Byte**, un marketplace desarrollado con Node.js, Express y PostgreSQL.

Permite gestionar usuarios, autenticar mediante JWT y publicar, consultar, actualizar y eliminar productos.

## Tecnologías utilizadas

- Node.js
- Express
- PostgreSQL
- pg
- bcrypt
- JSON Web Token (JWT)
- CORS
- dotenv
- Jest
- Supertest
- Nodemon

## Requisitos previos

Antes de ejecutar el proyecto, debes tener instalado:

- Node.js y npm.
- PostgreSQL.
- Una base de datos llamada `shopbyte`.

## Instalación

Clona el repositorio:

```bash
git clone https://github.com/GaboxoGG/Shop-Byte.git
```

Ingresa a la carpeta del backend:

```bash
cd Shop-Byte/shop-byte-backend
```

Instala las dependencias:

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz de `shop-byte-backend` con las siguientes variables:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=TU_CONTRASEÑA
DB_NAME=shopbyte

JWT_SECRET=TU_CLAVE_SECRETA
```

Reemplaza los valores de ejemplo por tus propias credenciales.

**Importante:** el archivo `.env` contiene información privada y no debe subirse a GitHub.

## Base de datos

El proyecto utiliza PostgreSQL y contiene dos tablas:

### Usuarios (`users`)

| Campo | Descripción |
|---|---|
| id | Identificador del usuario |
| name | Nombre |
| email | Correo electrónico |
| password | Contraseña cifrada |
| created_at | Fecha de creación |

### Productos (`products`)

| Campo | Descripción |
|---|---|
| id | Identificador del producto |
| name | Nombre |
| description | Descripción |
| price | Precio |
| category | Categoría |
| image | Imagen del producto |
| condition | Estado del producto |
| stock | Cantidad disponible |
| user_id | Identificador del usuario propietario |
| created_at | Fecha de creación |

La tabla `products` tiene una clave foránea `user_id` que referencia a `users(id)`.

## Ejecución del proyecto

Para iniciar el servidor:

```bash
npm start
```

Para iniciar en modo desarrollo:

```bash
npm run dev
```

El servidor estará disponible en:

http://localhost:3000

## Rutas de la API

### General

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/` | Comprueba el funcionamiento del servidor |
| GET | `/api/test-db` | Comprueba la conexión con PostgreSQL |

### Autenticación

| Método | Endpoint | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Registrar un usuario |
| POST | `/api/auth/login` | Iniciar sesión |

### Productos

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/products` | Listar productos |
| GET | `/api/products/:id` | Consultar un producto |
| POST | `/api/products` | Crear un producto |
| PUT | `/api/products/:id` | Actualizar