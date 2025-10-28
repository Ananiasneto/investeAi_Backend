import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function validateToken(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    res.sendStatus(401);
    return; 
  }

  const token = authToken.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
    res.locals.userId = decoded.userId;
    next();
  } catch (err) {
    res.status(401).json(err.message);
    return ;
  }
}
export function validateSchema(schema ) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({ error: true, message: error.details[0].message });
    }
    next();
  };
}

