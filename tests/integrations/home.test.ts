import { createInvestidorServices, getInvestidorService } from "../../src/service/home-services";
import * as repo from "../../src/repository/home-repository";
import { BadRequestError, NotFoundError } from "../../src/error/errors";

jest.mock("../../src/repository/home-repository");

describe("home-services - unitário", () => {
  const mockUser = {
    id: "1",
    nome: "Teste",
    email: "teste@mail.com",
    senha: "123456",
    saldo: 1000,
    patrimonio: 5000,
    ativos: [],
    transacoes: [],
  };

  beforeEach(() => jest.clearAllMocks());

  describe("createInvestidorServices", () => {
    it("deve criar um investidor com sucesso", async () => {
      (repo.createInvestidor as jest.Mock).mockResolvedValue(mockUser.id);

      const result = await createInvestidorServices(mockUser.nome, mockUser.email, mockUser.senha);
      expect(result).toBe(mockUser.id);
    });

    it("deve lançar BadRequestError se não criar investidor", async () => {
      (repo.createInvestidor as jest.Mock).mockResolvedValue(null);

      await expect(
        createInvestidorServices(mockUser.nome, mockUser.email, mockUser.senha)
      ).rejects.toThrow(BadRequestError);
    });
  });

  describe("getInvestidorService", () => {
    it("deve retornar o investidor se encontrado", async () => {
      (repo.getInvestidorById as jest.Mock).mockResolvedValue(mockUser);

      const result = await getInvestidorService(mockUser.id);
      expect(result).toEqual(mockUser);
    });

    it("deve lançar NotFoundError se investidor não encontrado", async () => {
      (repo.getInvestidorById as jest.Mock).mockResolvedValue(null);

      await expect(getInvestidorService("id-invalido")).rejects.toThrow(NotFoundError);
    });
  });
});
