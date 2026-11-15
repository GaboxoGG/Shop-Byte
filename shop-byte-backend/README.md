
# Shop&Byte - Backend

Backend del proyecto **Shop&Byte**, un marketplace desarrollado con Node.js, Express y PostgreSQL.

Este proyecto permite gestionar usuarios, autenticación mediante JWT y publicación, consulta, actualización y eliminación de productos.

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

Clona el repositorio y entra en la carpeta del proyecto:

```bash
git clone URL_DEL_REPOSITORIO
cd shop-byte-backend
```

Instala las dependencias:

```bash
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto:

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

**Importante:** El archivo `.env` no debe subirse a GitHub.

## Base de datos

El proyecto utiliza PostgreSQL y contiene las siguientes tablas:

### users

- id
- name
- email
- password
- created_at

### products

- id
- name
- description
- price
- category
- image
- condition
- stock
- user_id
- created_at

La tabla `products` tiene una relación con `users` mediante la clave foránea `user_id`.

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
| PUT | `/api/products/:id` | Actualizar un producto propio |
| DELETE | `/api/products/:id` | Eliminar un producto propio |

Las operaciones de creación, actualización y eliminación requieren autenticación mediante JWT y verifican la propiedad del producto.

## Pruebas automatizadas

El proyecto utiliza Jest y Supertest para ejecutar pruebas automatizadas de la API.

Para ejecutar las pruebas:

```bash
npm test
```

Actualmente se incluyen pruebas para:

- GET `/`
- GET `/api/test-db`
- GET `/api/products`
- GET `/api/products/1`

## Autor

Proyecto académico Shop&Byte - Hito 3.
