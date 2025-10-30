// tests/unit/operation-service.test.ts
import { 
  operationService 
} from "../../src/service/operation-services";
import { 
  getInvestidorById, 
  updateInvestidor, 
  updateInvestidorComPatrimonio 
} from "../../src/repository/home-repository";
import { 
  createAtivo, 
  updateAtivo, 
  deleteAtivo 
} from "../../src/repository/ative-repository";
import { createTransacao } from "../../src/repository/operation-repository";
import { getPreco } from "../../src/utils/brapi";
import { 
  UnprocessableEntityError, 
  NotFoundError, 
  BadRequestError 
} from "../../src/error/errors";

jest.mock("../../src/repository/home-repository");
jest.mock("../../src/repository/ative-repository");
jest.mock("../../src/repository/operation-repository");
jest.mock("../../src/utils/brapi");

describe("Operation Service ", () => {
  const mockInvestidor = {
    id: "1",
    saldo: 5000,
    patrimonio: 10000,
    ativos: []
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Operação APORTE", () => {
    it("deve realizar aporte com sucesso", async () => {
      const operationData = {
        tipo: "APORTE",
        investidorId: "1",
        valor: 1000,
        papel: null,
        quantidade: 0
      };

      (getInvestidorById as jest.Mock).mockResolvedValue(mockInvestidor);
      (createTransacao as jest.Mock).mockResolvedValue({ id: "transacao-1" });
      (updateInvestidor as jest.Mock).mockResolvedValue({});

      const result = await operationService(operationData);

      expect(getInvestidorById).toHaveBeenCalledWith("1");
      expect(createTransacao).toHaveBeenCalledWith({
        tipo: "APORTE",
        valor: 1000,
        investidorId: "1",
        papel: null,
        quantidade: 0
      });
      expect(updateInvestidor).toHaveBeenCalledWith("1", 6000);
      expect(result).toEqual({ id: "transacao-1" });
    });

    it("deve lançar erro se investidor não existir", async () => {
      const operationData = {
        tipo: "APORTE",
        investidorId: "999",
        valor: 1000,
        papel: null,
        quantidade: 0
      };

      (getInvestidorById as jest.Mock).mockResolvedValue(null);

      await expect(operationService(operationData))
        .rejects
        .toThrow(new NotFoundError("Investidor não encontrado"));
    });

    it("deve lançar erro se valor do aporte for maior que 10000", async () => {
      const operationData = {
        tipo: "APORTE",
        investidorId: "1",
        valor: 15000,
        papel: null,
        quantidade: 0
      };

      (getInvestidorById as jest.Mock).mockResolvedValue(mockInvestidor);

      await expect(operationService(operationData))
        .rejects
        .toThrow(new UnprocessableEntityError("Limite de aporte: R$ 10.000"));
    });

  });

  describe("Operação COMPRA", () => {
    it("deve realizar compra com sucesso para novo ativo", async () => {
      const operationData = {
        tipo: "COMPRA",
        investidorId: "1",
        papel: "PETR4",
        quantidade: 10,
        valor: 0 
      };

      const investidorComSaldo = { ...mockInvestidor, saldo: 10000 };
      (getInvestidorById as jest.Mock).mockResolvedValue(investidorComSaldo);
      (getPreco as jest.Mock).mockResolvedValue(25.50);
      (createAtivo as jest.Mock).mockResolvedValue({});
      (createTransacao as jest.Mock).mockResolvedValue({});
      (updateInvestidorComPatrimonio as jest.Mock).mockResolvedValue({});

      const result = await operationService(operationData);

      expect(getPreco).toHaveBeenCalledWith("PETR4");
      expect(createAtivo).toHaveBeenCalledWith(
        "PETR4",
        25.50,
        10,
        255,
        "1"
      );
      expect(updateInvestidorComPatrimonio).toHaveBeenCalledWith("1", 9745, 10255);
      expect(result).toMatchObject({
        saldo: 9745,
        patrimonio: 10255,
        tipo: "COMPRA",
        papel: "PETR4",
        quantidade: 10
      });
    });

    it("deve realizar compra com sucesso para ativo existente", async () => {
      const ativoExistente = {
        id: "ativo-1",
        papel: "PETR4",
        quantidade: 5,
        valorAquisicao: 125,
        investidorId: "1"
      };

      const investidorComAtivo = {
        ...mockInvestidor,
        saldo: 10000,
        ativos: [ativoExistente]
      };

      const operationData = {
        tipo: "COMPRA",
        investidorId: "1",
        papel: "PETR4",
        quantidade: 10,
        valor: 0
      };

      (getInvestidorById as jest.Mock).mockResolvedValue(investidorComAtivo);
      (getPreco as jest.Mock).mockResolvedValue(25.50);
      (updateAtivo as jest.Mock).mockResolvedValue({});
      (createTransacao as jest.Mock).mockResolvedValue({});
      (updateInvestidorComPatrimonio as jest.Mock).mockResolvedValue({});

      const result = await operationService(operationData);

      expect(updateAtivo).toHaveBeenCalledWith({
        ...ativoExistente,
        quantidade: 15,
        valorAquisicao: 380
      });
      expect(result).toMatchObject({
        tipo: "COMPRA",
        papel: "PETR4",
        quantidade: 10
      });
    });

    it("deve lançar erro se saldo for insuficiente", async () => {
      const operationData = {
        tipo: "COMPRA",
        investidorId: "1",
        papel: "PETR4",
        quantidade: 1000,
        valor: 0
      };

      (getInvestidorById as jest.Mock).mockResolvedValue(mockInvestidor);
      (getPreco as jest.Mock).mockResolvedValue(30);

      await expect(operationService(operationData))
        .rejects
        .toThrow(new UnprocessableEntityError("Saldo insuficiente"));
    });

    it("deve lançar erro se quantidade exceder limite", async () => {
      const operationData = {
        tipo: "COMPRA",
        investidorId: "1",
        papel: "PETR4",
        quantidade: 1500,
        valor: 0
      };

      (getInvestidorById as jest.Mock).mockResolvedValue(mockInvestidor);
      (getPreco as jest.Mock).mockResolvedValue(10);

      await expect(operationService(operationData))
        .rejects
        .toThrow(new UnprocessableEntityError("Não é possível comprar mais de 1000 papéis de uma vez"));
    });

    it("deve lançar erro se papel não for informado", async () => {
      const operationData = {
        tipo: "COMPRA",
        investidorId: "1",
        quantidade: 10,
        valor: 0
      } as any;

      (getInvestidorById as jest.Mock).mockResolvedValue(mockInvestidor);

      await expect(operationService(operationData))
        .rejects
        .toThrow(new UnprocessableEntityError("Papel e quantidade obrigatórios"));
    });

    it("deve lançar erro se quantidade não for informada", async () => {
      const operationData = {
        tipo: "COMPRA",
        investidorId: "1",
        papel: "PETR4",
        valor: 0
      } as any;

      (getInvestidorById as jest.Mock).mockResolvedValue(mockInvestidor);

      await expect(operationService(operationData))
        .rejects
        .toThrow(new UnprocessableEntityError("Papel e quantidade obrigatórios"));
    });
  });

  describe("Operação VENDA", () => {
    const ativoExistente = {
      id: "ativo-1",
      papel: "PETR4",
      quantidade: 20,
      valorAquisicao: 500,
      investidorId: "1"
    };

    const investidorComAtivo = {
      ...mockInvestidor,
      saldo: 5000,
      patrimonio: 10000,
      ativos: [ativoExistente]
    };

    it("deve realizar venda com sucesso", async () => {
      const operationData = {
        tipo: "VENDA",
        investidorId: "1",
        papel: "PETR4",
        quantidade: 5,
        valor: 0
      };

      (getInvestidorById as jest.Mock).mockResolvedValue(investidorComAtivo);
      (getPreco as jest.Mock).mockResolvedValue(30);
      (updateAtivo as jest.Mock).mockResolvedValue({});
      (createTransacao as jest.Mock).mockResolvedValue({});
      (updateInvestidorComPatrimonio as jest.Mock).mockResolvedValue({});

      const result = await operationService(operationData);

      expect(getPreco).toHaveBeenCalledWith("PETR4");
      expect(updateAtivo).toHaveBeenCalledWith({
        ...ativoExistente,
        quantidade: 15
      });
      expect(updateInvestidorComPatrimonio).toHaveBeenCalledWith("1", 5150, 9850);
      expect(result).toMatchObject({
        tipo: "VENDA",
        papel: "PETR4",
        quantidade: 5,
        saldo: 5150,
        patrimonio: 9850
      });
    });

    it("deve lançar erro se ativo não existir na carteira", async () => {
      const operationData = {
        tipo: "VENDA",
        investidorId: "1",
        papel: "ITUB4",
        quantidade: 5,
        valor: 0
      };

      (getInvestidorById as jest.Mock).mockResolvedValue(investidorComAtivo);

      await expect(operationService(operationData))
        .rejects
        .toThrow(new UnprocessableEntityError("Quantidade indisponível para venda"));
    });

    it("deve lançar erro se quantidade for maior que a disponível", async () => {
      const operationData = {
        tipo: "VENDA",
        investidorId: "1",
        papel: "PETR4",
        quantidade: 25,
        valor: 0
      };

      (getInvestidorById as jest.Mock).mockResolvedValue(investidorComAtivo);

      await expect(operationService(operationData))
        .rejects
        .toThrow(new UnprocessableEntityError("Quantidade indisponível para venda"));
    });

    it("deve lançar erro se papel não for informado", async () => {
      const operationData = {
        tipo: "VENDA",
        investidorId: "1",
        quantidade: 5,
        valor: 0
      } as any;

      (getInvestidorById as jest.Mock).mockResolvedValue(investidorComAtivo);

      await expect(operationService(operationData))
        .rejects
        .toThrow(new UnprocessableEntityError("Papel e quantidade obrigatórios"));
    });
  });

  describe("Operação inválida", () => {
    it("deve lançar erro para tipo de operação inválido", async () => {
      const operationData = {
        tipo: "INVALIDO",
        investidorId: "1",
        valor: 100
      } as any;

      (getInvestidorById as jest.Mock).mockResolvedValue(mockInvestidor);

      await expect(operationService(operationData))
        .rejects
        .toThrow(new BadRequestError("Tipo de operação inválido"));
    });
  });

  describe("Validações de caso de uso", () => {
    it("deve converter tipo para maiúsculo", async () => {
      const operationData = {
        tipo: "aporte",
        investidorId: "1",
        valor: 500,
        papel: null,
        quantidade: 0
      };

      (getInvestidorById as jest.Mock).mockResolvedValue(mockInvestidor);
      (createTransacao as jest.Mock).mockResolvedValue({});
      (updateInvestidor as jest.Mock).mockResolvedValue({});

      await operationService(operationData);

      expect(createTransacao).toHaveBeenCalledWith(
        expect.objectContaining({ tipo: "APORTE" })
      );
    });

    it("deve lidar com erro no serviço de preço", async () => {
      const operationData = {
        tipo: "COMPRA",
        investidorId: "1",
        papel: "PETR4",
        quantidade: 10,
        valor: 0
      };

      (getInvestidorById as jest.Mock).mockResolvedValue(mockInvestidor);
      (getPreco as jest.Mock).mockRejectedValue(new Error("Erro ao buscar preço"));

      await expect(operationService(operationData))
        .rejects
        .toThrow("Erro ao buscar preço");
    });
  });
});