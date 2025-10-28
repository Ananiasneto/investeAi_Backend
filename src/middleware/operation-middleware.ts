
import { Request, Response, NextFunction } from "express";
import {operationSchema} from "../schema/schema";


export function validateOperation(req: Request, res: Response, next: NextFunction) {
  const { error } = operationSchema.validate({ ...req.body, tipo: req.params.tipo });
  if (error) return res.status(400).json({ error: error.details[0].message });
  next();
}
