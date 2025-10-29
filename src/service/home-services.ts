import { BadRequestError, NotFoundError } from "../error/errors";
import { createInvestidor, getInvestidorById } from "../repository/home-repository";

export async function createInvestidorServices(nome:string,email:string,senha:string) {
  const novoInvestidorId = await createInvestidor(nome,email,senha);
  if(novoInvestidorId==null){
    throw new BadRequestError("erro ao criar usuario");
  }
  return novoInvestidorId;
  
}


export async function getInvestidorService(id: string) {
  const investidor = await getInvestidorById(id);
  if (!investidor) {
      throw new NotFoundError("usuario não encontrado");
    }
  return investidor;
}
