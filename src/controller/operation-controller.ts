import { Request, Response } from "express";
import { operationService } from "../service/operation-services";
import { OperationModel } from "../model/models";

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
    res.status(500).json({ error: error.message });
  }
}
