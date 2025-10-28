import { Router } from "express";
import { ativeController } from "../controller/ative-controller";
import { validateToken } from "../middleware/auth-middleware";

const ativeRouter = Router();

ativeRouter.get("/ative",validateToken,ativeController);

export default ativeRouter;
