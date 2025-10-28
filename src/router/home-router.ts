import { Router } from "express";
import { homeGetInvestidor } from "../controller/home-controller";
import { validateToken } from "../middleware/auth-middleware";

const homeRouter = Router();

homeRouter.get("/home",validateToken,homeGetInvestidor);

export default homeRouter;
