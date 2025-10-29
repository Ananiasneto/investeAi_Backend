import { Request, Response } from "express";
import {getInvestidorService } from "../service/home-services"
import { BadRequestError, NotFoundError } from "../error/errors";

export async function homeGetInvestidor(req: Request, res: Response) {
  try {
    const userId = res.locals.userId;
    if(!userId){
      throw new NotFoundError("usuario não encontrado")
    }
    const investidor = await getInvestidorService(userId);
    res.status(200).send(investidor);
  } catch (error) {
    throw new BadRequestError("erro no servidor")
  }
}