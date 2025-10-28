import { ativeModel, InvestidorModel } from "../model/models";
import { getPreco } from "../utils/brapi";

export async function getAtivosComLucro(investidor: InvestidorModel) {
  const ativosComPreco = await Promise.all(
    investidor.ativos.map(async (ativo: ativeModel) => {
      if (!ativo.papel || ativo.quantidade == null) return null;

      const preco = await getPreco(ativo.papel);
      const valorAtual = preco * ativo.quantidade;
      const lucro = valorAtual - ativo.valorAquisicao;

      return {
        id: ativo.id,
        papel: ativo.papel,
        quantidade: ativo.quantidade,
        valorAtual: parseFloat(valorAtual.toFixed(2)),
        valorAquisicao: ativo.valorAquisicao,
        lucroOuPrejuizo: parseFloat(lucro.toFixed(2)),
      };
    })
  );

  const ativosValidos = ativosComPreco
    .filter((a): a is NonNullable<typeof a> => a !== null)
    .sort((a, b) => a.papel.localeCompare(b.papel));

  return { ativos: ativosValidos };
}
