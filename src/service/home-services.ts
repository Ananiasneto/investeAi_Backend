import { createInvestidor, getInvestidorById } from "../repository/home-repository";

export async function createInvestidorServices(nome:string,email:string,senha:string) {
  const novoInvestidorId = await createInvestidor(nome,email,senha);
  if(novoInvestidorId==null){
    throw new Error("Não criado");
  }
  return novoInvestidorId;
  
}


export async function getInvestidorService(id: string) {
  const investidor = await getInvestidorById(id);
  if (!investidor) {
      throw new Error("Não encontrado");
    }
  return investidor;
}
