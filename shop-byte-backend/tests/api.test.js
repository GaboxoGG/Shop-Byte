
const request = require("supertest");

// Simulamos la conexión a PostgreSQL
jest.mock("../src/config/db", () => ({
  query: jest.fn(),
}));

const pool = require("../src/config/db");
const app = require("../src/app");

describe("Pruebas de la API Shop&Byte", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Prueba 1: Ruta principal
  test("GET / debe responder correctamente", async () => {
    const response = await request(app).get("/");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
      "Servidor Shop&Byte funcionando"
    );
  });

  // Prueba 2: Conexión a PostgreSQL
  test("GET /api/test-db debe comprobar la conexión", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [{ fecha: "2026-11-14T12:00:00.000Z" }],
    });

    const response = await request(app).get("/api/test-db");

    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe(
      "Conexión a PostgreSQL exitosa"
    );
    expect(pool.query).toHaveBeenCalledTimes(1);
  });

  // Prueba 3: Listar productos
  test("GET /api/products debe devolver una lista", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [],
    });

    const response = await request(app).get("/api/products");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  // Prueba 4: Consultar producto por ID
  test("GET /api/products/1 debe devolver un producto", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [
        {
          id: 1,
          name: "Notebook Lenovo",
          description: "Notebook de prueba",
          price: "420000.00",
          category: "Notebooks",
          image: "https://example.com/notebook.jpg",
          condition: "Usado",
          stock: 3,
          user_id: 1,
        },
      ],
    });

    const response = await request(app).get("/api/products/1");

    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBe(1);
    expect(response.body.name).toBe("Notebook Lenovo");
  });

  // Prueba 5: Producto inexistente
  test("GET /api/products/999 debe responder 404", async () => {
    pool.query.mockResolvedValueOnce({
      rows: [],
    });

    const response = await request(app).get("/api/products/999");

    expect(response.statusCode).toBe(404);
    expect(response.body.message).toBe("Producto no encontrado");
  });

  // Prueba 6: Error al consultar productos
  test("GET /api/products debe responder 500 si falla la base de datos", async () => {
    pool.query.mockRejectedValueOnce(
      new Error("Error de conexión")
    );

    const response = await request(app).get("/api/products");

    expect(response.statusCode).toBe(500);
  });

  // Prueba 7: Acceso sin token
  test("GET /api/products/private debe responder 401 sin token", async () => {
    const response = await request(app).get("/api/products/private");

    expect(response.statusCode).toBe(401);
    expect(response.body.message).toBe(
      "Token de autenticación requerido"
    );
  });
});
