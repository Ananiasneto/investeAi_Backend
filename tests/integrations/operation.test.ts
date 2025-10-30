import request from "supertest";
import app from "../../src/index";
import * as operationServiceModule from "../../src/service/operation-services";
import {  NotFoundError } from "../../src/error/errors";

jest.mock("../../src/middleware/auth-middleware", () => ({
  validateToken: (req: any, res: any, next: any) => {
    res.locals.userId = "1";
    next();
  },
  validateSchema: (schema: any) => (req: any, res: any, next: any) => next(),
}));

jest.mock("../../src/service/operation-services");

describe("POST /operation/:tipo - testes simplificados", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve retornar 201 para APORTE válido", async () => {
    (operationServiceModule.operationService as jest.Mock).mockResolvedValue({
      tipo: "APORTE",
      valor: 500,
      investidorId: "1",
      papel: null,
      quantidade: 0,
    });

    const response = await request(app)
      .post("/operation/APORTE")
      .send({ investidorId: "1", valor: 500 });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      tipo: "APORTE",
      valor: 500,
      investidorId: "1",
      papel: null,
      quantidade: 0,
    });
  });

  it("deve retornar 201 para COMPRA válida", async () => {
    (operationServiceModule.operationService as jest.Mock).mockResolvedValue({
      tipo: "COMPRA",
      papel: "PETR4",
      quantidade: 10,
      valor: 50,
      saldo: 4500,
      patrimonio: 5500,
      investidorId: "1",
    });

    const response = await request(app)
      .post("/operation/COMPRA")
      .send({ investidorId: "1", papel: "PETR4", quantidade: 10 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("tipo", "COMPRA");
    expect(response.body).toHaveProperty("papel", "PETR4");
    expect(response.body).toHaveProperty("quantidade", 10);
  });

  it("deve retornar 201 para VENDA válida", async () => {
    (operationServiceModule.operationService as jest.Mock).mockResolvedValue({
      tipo: "VENDA",
      papel: "PETR4",
      quantidade: 5,
      valor: 50,
      saldo: 4750,
      patrimonio: 5250,
      investidorId: "1",
    });

    const response = await request(app)
      .post("/operation/VENDA")
      .send({ investidorId: "1", papel: "PETR4", quantidade: 5 });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("tipo", "VENDA");
    expect(response.body).toHaveProperty("papel", "PETR4");
    expect(response.body).toHaveProperty("quantidade", 5);
  });

  it("deve retornar 404 se o investidor não for encontrado", async () => {
    (operationServiceModule.operationService as jest.Mock).mockImplementation(() => {
      throw new NotFoundError("Investidor não encontrado");
    });

    const response = await request(app)
      .post("/operation/APORTE")
      .send({ investidorId: "999", valor: 500 });

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty("message", "Investidor não encontrado");
  });
});
