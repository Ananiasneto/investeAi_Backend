import { Request, Response } from "express";
import {getInvestidorService } from "../service/home-services"

export async function homeGetInvestidor(req: Request, res: Response) {
  try {
    const userId = res.locals.userId;
    if(!userId){
      return res.status(401).json({ error: "ID do usuário não encontrado" });
    }
    const investidor = await getInvestidorService(userId);
    res.status(200).send(investidor);
  } catch (error) {
    console.error("Erro ao buscar investidor:", error);
    res.status(500).json({ error: "Erro interno" });
  }
}