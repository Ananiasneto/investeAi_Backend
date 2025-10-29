import { NextFunction, Request, Response } from "express";
import { getInvestidorService } from "../service/home-services";
import { getAtivosComLucro } from "../service/ative-service";

export async function ativeController(req: Request, res: Response ,next: NextFunction) {
  try {
    const userId = res.locals.userId;
    const investidor = await getInvestidorService(userId);
    const result =await getAtivosComLucro(investidor)
    res.status(200).send(result);
  } catch (error) {
   next(error);
  }
}
