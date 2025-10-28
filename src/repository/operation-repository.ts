import { OperationModel } from "model/models";
import prisma from "../database/database";

export async function createTransacao(transacao: OperationModel) {
  return await prisma.transacao.create({
        data: {
            tipo:transacao.tipo,
            valor: transacao.valor,
            papel: transacao.papel,
            quantidade: transacao.quantidade,
            investidorId:transacao.investidorId,
        },
    });
}




