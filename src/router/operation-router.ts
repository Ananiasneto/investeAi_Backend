import { Router } from "express";
import { operationController } from "../controller/operation-controller";
import { validateOperation } from "../middleware/operation-middleware";
import { validateToken } from "../middleware/auth-middleware";

const operationRouter = Router();

operationRouter.post("/operation/:tipo", validateOperation,validateToken, operationController);

export default operationRouter;
