import { getInvestidorById, updateInvestidor, updateInvestidorComPatrimonio } from "../repository/home-repository";
import { createTransacao } from "../repository/operation-repository";
import { OperationModel } from "../model/models";
import { getPreco } from "../utils/brapi";
import { createAtivo, deleteAtivo, updateAtivo } from "../repository/ative-repository";

export async function operationService(dataOperation :OperationModel) {
  const { tipo, investidorId, papel, quantidade, valor } = dataOperation;

  const investidor = await getInvestidorById(investidorId)

  if (!investidor) {
    throw new Error("Investidor não encontrado");
  }

  let novoSaldo = investidor.saldo;
  let patrimonio = investidor.patrimonio;

  if (tipo.toUpperCase() === "APORTE") {
    if (valor > 10000) throw new Error("Limite de aporte: R$ 10.000");
    novoSaldo += valor;

    const result=await createTransacao({
            tipo: "APORTE",
            valor: valor,
            investidorId,
            papel:null,
            quantidade:0
        })

    await updateInvestidor(investidorId,novoSaldo)

    return result;
  }

  if (tipo.toUpperCase() === "COMPRA") {
    if (!papel || !quantidade) throw new Error("Papel e quantidade obrigatórios");

    if (quantidade > 1000) throw new Error("Não é possível comprar mais de 1000 papéis de uma vez");

    const valor=await getPreco(papel)
    const totalCompra = valor * quantidade;

    if (totalCompra > novoSaldo) throw new Error("Saldo insuficiente");

    novoSaldo -= totalCompra;
    patrimonio += totalCompra;
 const ativoExistente = investidor.ativos.find(a => a.papel === papel);

    if (ativoExistente) {
      ativoExistente.quantidade=ativoExistente.quantidade + quantidade;
      ativoExistente.valorAquisicao= ativoExistente.valorAquisicao + totalCompra;
      await updateAtivo(ativoExistente)
    } else {
      await createAtivo(papel,valor,quantidade,totalCompra,investidorId)
    }

    const transacao={
      tipo,papel,quantidade,valor,investidorId
    }
    await createTransacao(transacao);

    await updateInvestidorComPatrimonio(investidorId,novoSaldo,patrimonio)
    return { saldo: novoSaldo, patrimonio, tipo, papel, quantidade };
  }

  if (tipo.toUpperCase() === "VENDA") {
    if (!papel || !quantidade) throw new Error("Papel e quantidade obrigatórios");
    
    const ativoExistente = investidor.ativos.find(a => a.papel === papel);
    if (!ativoExistente || ativoExistente.quantidade < quantidade) {
      throw new Error("Quantidade indisponível para venda");
    }
    const valor=await getPreco(papel)
    const totalVenda = valor * quantidade;
    novoSaldo += totalVenda;
    patrimonio -= totalVenda;
     ativoExistente.quantidade=ativoExistente.quantidade-quantidade
   if (ativoExistente.quantidade > 0) {
  await updateAtivo(ativoExistente);
} else {
  await deleteAtivo(ativoExistente);
}
     const transacao={
      tipo,
      papel:ativoExistente.papel,
      quantidade:ativoExistente.quantidade,
      valor,
      investidorId:ativoExistente.investidorId
    }
    await createTransacao(transacao);

    await updateInvestidorComPatrimonio(investidorId,novoSaldo,patrimonio)

    return { saldo: novoSaldo, patrimonio, tipo, papel, quantidade };
  }

  throw new Error("Tipo de operação inválido");
}
