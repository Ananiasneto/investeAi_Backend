import { NextFunction, Request, Response } from "express";
import { createUser, loginUser } from "../service/auth-service";


export async function signUp(req: Request, res: Response ,next: NextFunction) {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    next(error);
  }
}

export async function signIn(req: Request, res: Response ,next: NextFunction) {
  try {
    const token = await loginUser(req.body);
    res.status(200).json({ token });
  } catch (error: any) {
    next(error);
  }
}
