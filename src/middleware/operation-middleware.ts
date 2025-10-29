
import { Request, Response, NextFunction } from "express";
import {operationSchema} from "../schema/schema";
import { BadRequestError } from "../error/errors";


export function validateOperation(req: Request, res: Response, next: NextFunction) {
  const { error } = operationSchema.validate({ ...req.body, tipo: req.params.tipo });
  if (error) return new BadRequestError( error.details[0].message);
  next();
}
