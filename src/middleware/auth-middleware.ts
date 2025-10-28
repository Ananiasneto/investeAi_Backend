import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface TokenPayload extends JwtPayload {
  userId: string;
}

export function validateToken(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    res.sendStatus(401);
    return; 
  }

  const token = authToken.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    
    if (!decoded.userId) {
      return res.sendStatus(401);
    }

    res.locals.userId = decoded.userId;
    next();
  } catch (err: any) {
    res.status(401).json({ error: true, message: err.message });
  }
}

export function validateSchema(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
      return res.status(422).json({ error: true, message: error.details[0].message });
    }
    next();
  };
}
