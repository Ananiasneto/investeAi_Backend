import request from "supertest";
import jwt from "jsonwebtoken";
import * as homeServicesModule from "../../src/service/home-services";
import * as ativeServiceModule from "../../src/service/ative-service";
import { UnauthorizedError, NotFoundError } from "../../src/error/errors";

jest.mock("../../src/service/home-services");
jest.mock("../../src/service/ative-service");

jest.mock("jsonwebtoken");

import app from "../../src/index";

describe("GET /ative - integração", () => {
  const validToken = "valid-jwt-token";
  const userId = "user123";

  beforeEach(() => {
    jest.clearAllMocks();
    (jwt.verify as jest.Mock).mockImplementation((token, secret) => {
      if (token === validToken) {
        return { userId };
      }
      throw new Error("Invalid token");
    });
  });

  describe("Sucesso", () => {
    it("deve retornar 200 com lista de ativos com lucro", async () => {
      const mockInvestidor = {
        id: userId,
        nome: "João Silva",
        saldo: 5000,
        patrimonio: 15000,
        ativos: [
          { id: "1", papel: "PETR4", quantidade: 100, valorAquisicao: 2500 },
          { id: "2", papel: "VALE3", quantidade: 50, valorAquisicao: 1500 }
        ]
      };

      const mockAtivosComLucro = [
        {
          id: "1",
          papel: "PETR4",
          quantidade: 100,
          valorAtual: 3000,
          valorAquisicao: 2500,
          lucroOuPrejuizo: 500,
        },
        {
          id: "2",
          papel: "VALE3",
          quantidade: 50,
          valorAtual: 1800,
          valorAquisicao: 1500,
          lucroOuPrejuizo: 300,
        }
      ];

      (homeServicesModule.getInvestidorService as jest.Mock).mockResolvedValue(mockInvestidor);
      (ativeServiceModule.getAtivosComLucro as jest.Mock).mockResolvedValue(mockAtivosComLucro);

      const response = await request(app)
        .get("/ative")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockAtivosComLucro);
      expect(homeServicesModule.getInvestidorService).toHaveBeenCalledWith(userId);
      expect(ativeServiceModule.getAtivosComLucro).toHaveBeenCalledWith(mockInvestidor);
    });

    it("deve retornar 200 com array vazio quando não há ativos", async () => {
      const mockInvestidor = {
        id: userId,
        nome: "João Silva",
        saldo: 5000,
        patrimonio: 5000,
        ativos: []
      };

      const mockAtivosComLucro: any[] = [];

      (homeServicesModule.getInvestidorService as jest.Mock).mockResolvedValue(mockInvestidor);
      (ativeServiceModule.getAtivosComLucro as jest.Mock).mockResolvedValue(mockAtivosComLucro);

      const response = await request(app)
        .get("/ative")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe("Erros de autenticação", () => {
    it("deve retornar 401 quando token não é fornecido", async () => {
      const response = await request(app)
        .get("/ative");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Acesso negado");
    });

    it("deve retornar 401 quando token é inválido", async () => {
      (jwt.verify as jest.Mock).mockImplementation(() => {
        throw new Error("Invalid token");
      });

      const response = await request(app)
        .get("/ative")
        .set("Authorization", "Bearer invalid-token");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Acesso negado");
    });

    it("deve retornar 401 quando token não tem userId", async () => {
      (jwt.verify as jest.Mock).mockReturnValue({}); 

      const response = await request(app)
        .get("/ative")
        .set("Authorization", "Bearer token-sem-userid");

      expect(response.status).toBe(401);
    });

    it("deve retornar 401 quando Authorization header está mal formatado", async () => {
      const response = await request(app)
        .get("/ative")
        .set("Authorization", "MalformedToken");

      expect(response.status).toBe(401);
    });
  });

  describe("Erros de negócio", () => {
    it("deve retornar 404 quando investidor não é encontrado", async () => {
      (homeServicesModule.getInvestidorService as jest.Mock).mockRejectedValue(
        new NotFoundError("usuario não encontrado")
      );

      const response = await request(app)
        .get("/ative")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "usuario não encontrado");
    });

    it("deve retornar 500 para erro interno do servidor no getInvestidorService", async () => {
      (homeServicesModule.getInvestidorService as jest.Mock).mockRejectedValue(
        new Error("Erro no banco de dados")
      );

      const response = await request(app)
        .get("/ative")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(500);
    });

    it("deve retornar 500 quando serviço de ativos falha", async () => {
      const mockInvestidor = {
        id: userId,
        nome: "João Silva",
        saldo: 5000,
        patrimonio: 15000,
        ativos: [{ id: "1", papel: "PETR4", quantidade: 100, valorAquisicao: 2500 }]
      };

      (homeServicesModule.getInvestidorService as jest.Mock).mockResolvedValue(mockInvestidor);
      (ativeServiceModule.getAtivosComLucro as jest.Mock).mockRejectedValue(
        new Error("Erro ao calcular lucros")
      );

      const response = await request(app)
        .get("/ative")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(500);
    });
  });

  describe("Validações de dados", () => {
    it("deve usar o userId do token corretamente", async () => {
      const differentUserId = "user456";
      
      (jwt.verify as jest.Mock).mockReturnValue({ userId: differentUserId });

      const mockInvestidor = {
        id: differentUserId,
        nome: "Maria Santos",
        saldo: 3000,
        patrimonio: 10000,
        ativos: []
      };

      const mockAtivosComLucro: any[] = [];

      (homeServicesModule.getInvestidorService as jest.Mock).mockResolvedValue(mockInvestidor);
      (ativeServiceModule.getAtivosComLucro as jest.Mock).mockResolvedValue(mockAtivosComLucro);

      const response = await request(app)
        .get("/ative")
        .set("Authorization", "Bearer different-token");

      expect(response.status).toBe(200);
      expect(homeServicesModule.getInvestidorService).toHaveBeenCalledWith(differentUserId);
    });

    it("deve filtrar ativos com papel ou quantidade nulos", async () => {
      const mockInvestidor = {
        id: userId,
        nome: "João Silva",
        saldo: 5000,
        patrimonio: 5000,
        ativos: [
          { id: "1", papel: "PETR4", quantidade: 100, valorAquisicao: 2500 },
          { id: "2", papel: null, quantidade: 50, valorAquisicao: 1500 },
          { id: "3", papel: "VALE3", quantidade: null, valorAquisicao: 1000 }
        ]
      };

      const mockAtivosFiltrados = [
        {
          id: "1",
          papel: "PETR4",
          quantidade: 100,
          valorAtual: 3000,
          valorAquisicao: 2500,
          lucroOuPrejuizo: 500
        }
      ];

      (homeServicesModule.getInvestidorService as jest.Mock).mockResolvedValue(mockInvestidor);
      (ativeServiceModule.getAtivosComLucro as jest.Mock).mockResolvedValue(mockAtivosFiltrados);

      const response = await request(app)
        .get("/ative")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].papel).toBe("PETR4");
    });
  });

  describe("Performance", () => {
    it("deve processar grande quantidade de ativos corretamente", async () => {
      const muitosAtivos = Array.from({ length: 20 }, (_, i) => ({
        id: `a${i}`,
        papel: `PAPEL${i}`,
        quantidade: 10,
        valorAquisicao: 1000
      }));

      const mockInvestidor = {
        id: userId,
        nome: "João Silva",
        saldo: 50000,
        patrimonio: 100000,
        ativos: muitosAtivos
      };

      const mockResultado = muitosAtivos.map(ativo => ({
        ...ativo,
        valorAtual: 1200,
        lucroOuPrejuizo: 200,
      }));

      (homeServicesModule.getInvestidorService as jest.Mock).mockResolvedValue(mockInvestidor);
      (ativeServiceModule.getAtivosComLucro as jest.Mock).mockResolvedValue(mockResultado);

      const response = await request(app)
        .get("/ative")
        .set("Authorization", `Bearer ${validToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(20);
    });
  });
});