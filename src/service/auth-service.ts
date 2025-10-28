import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SignInModel, SignUpModel } from "../model/models";
import { createUserRepository, findUserByEmail } from "../repository/auth-repository";
import { createInvestidorServices } from "./home-services";


export async function createUser(user: SignUpModel) {
  const userExist= await findUserByEmail(user.email);

  if (userExist) {
    throw new Error("E-mail já cadastrado");
  }

  const hashedPassword = await bcrypt.hash(user.senha, 10);

  const newUser = { 
      email: user.email,
      nome: user.nome,
      senha: hashedPassword
    }

return await createUserRepository(newUser);
}

export async function loginUser(userExist: SignInModel) {
  const user= await findUserByEmail(userExist.email);

  if (!user) throw new Error("Usuário não encontrado");

  const senha = await bcrypt.compare(userExist.senha, user.senha);
  if (!senha) throw new Error("Senha incorreta");

  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });


  return token;
}
