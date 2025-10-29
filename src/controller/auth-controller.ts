import { Request, Response } from "express";
import { createUser, loginUser } from "../service/auth-service";
import { BadRequestError } from "../error/errors";


export async function signUp(req: Request, res: Response) {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    throw new BadRequestError("erro no servidor")
  }
}

export async function signIn(req: Request, res: Response) {
  try {
    const token = await loginUser(req.body);
    res.status(200).json({ token });
  } catch (error: any) {
    throw new BadRequestError("erro no servidor")
  }
}
