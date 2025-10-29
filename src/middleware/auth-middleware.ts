import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { InvalidTokenError, UnauthorizedError, UnprocessableEntityError } from "../error/errors";

interface TokenPayload extends JwtPayload {
  userId: string;
}

export function validateToken(req: Request, res: Response, next: NextFunction) {
  const authToken = req.headers.authorization;

  if (!authToken) {
    throw new UnauthorizedError("Acesso negado");
  }

  const token = authToken.replace("Bearer ", "");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
    
    if (!decoded.userId) {
      throw new InvalidTokenError("Invalid token");
    }

    res.locals.userId = decoded.userId;
    next();
  } catch (err: any) {
    throw new UnauthorizedError("Acesso negado");
  }
}

export function validateSchema(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    if (error) {
        return next(new UnprocessableEntityError(error.message));
    }
    next();
  };
}
