import { NextFunction, Request, Response } from "express";
import {getInvestidorService } from "../service/home-services"
import {  NotFoundError } from "../error/errors";

export async function homeGetInvestidor(req: Request, res: Response ,next: NextFunction) {
  try {
    const userId = res.locals.userId;
    if(!userId){
      throw new NotFoundError("usuario não encontrado")
    }
    const investidor = await getInvestidorService(userId);
    if (!investidor) {
      throw new NotFoundError("usuario não encontrado");
  }
    res.status(200).send(investidor);
  } catch (error) {
    next(error);
  }
}