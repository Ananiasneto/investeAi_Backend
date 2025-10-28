import prisma from "../database/database";

export async function createInvestidor(nome:string,email:string,senha:string) {
  const novoInvestidor = await prisma.investidor.create({
    data: {
          nome,
          email
          ,senha
        },
  });
  return novoInvestidor.id;
}

export async function getInvestidorById(id: string) {
  return await prisma.investidor.findUnique({
    where: { id },
    include: { ativos: { orderBy: { papel: "asc" } }, transacoes: true },
  });
}

export async function updateInvestidor(id: string, saldo: number) {
  return await prisma.investidor.update({
    where: { id },
    data: { saldo },
  });
}

export async function updateInvestidorComPatrimonio(id: string, saldo: number,patrimonio:number) {
  return await prisma.investidor.update({
    where: { id },
    data: { saldo ,patrimonio},
  });
}
