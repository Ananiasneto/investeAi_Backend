import { Router } from "express";
import { signUp, signIn } from "../controller/auth-controller";
import { signInSchema, signUpSchema } from "../schema/schema";
import { validateSchema } from "../middleware/auth-middleware";


const authRouter = Router();

authRouter.post("/sign-up",validateSchema(signUpSchema) ,signUp);
authRouter.post("/sign-in",validateSchema(signInSchema), signIn);

export default authRouter;
