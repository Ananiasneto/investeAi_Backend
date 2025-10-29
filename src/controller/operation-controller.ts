import { Request, Response } from "express";
import { operationService } from "../service/operation-services";
import { OperationModel } from "../model/models";
import { BadRequestError } from "../error/errors";

export async function operationController(req: Request, res: Response) {
  try {
    const { tipo } = req.params;
    const { investidorId, papel, quantidade, valor } = req.body;

    const operationData :OperationModel = {
      tipo ,
      investidorId,
      papel,
      quantidade,
      valor,
    };

    const operation = await operationService(operationData);
    res.status(200).send(operation);
  } catch (error) {
    throw new BadRequestError("erro no servidor")
  }
}
