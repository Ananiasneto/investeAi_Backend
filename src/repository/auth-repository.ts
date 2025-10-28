import { SignUpModel } from "../model/models";
import prisma from "../database/database";

export async function findUserByEmail(email: string) {
  return await prisma.investidor.findUnique({
    where: { email: email },
  });
}
export async function createUserRepository(user: SignUpModel) {
  return await prisma.investidor.create({
    data: {
      email: user.email,
      nome: user.nome,
      senha: user.senha,
    },
  });

}


