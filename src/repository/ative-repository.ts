import prisma from "../database/database";
import { ativeModel } from "../model/models";

export async function updateAtivo(ativoExistente: ativeModel) {
  return await prisma.ativo.update({
    where: { id: ativoExistente.id },
    data: {
      quantidade: ativoExistente.quantidade ?? undefined,
      valorAquisicao: ativoExistente.valorAquisicao,
    },
  });
}

export async function deleteAtivo(ativoExistente :ativeModel) {
  return await prisma.ativo.delete({
        where: { id: ativoExistente.id }
      });   
}
export async function createAtivo(papel:string,valor:number,quantidade:number,totalCompra:number,investidorId:string) {
  return await prisma.ativo.create({
        data: {
          papel,
          quantidade,
          valor,
          valorAquisicao: totalCompra,
          investidorId,
        },
      });
}


      