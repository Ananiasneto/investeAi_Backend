import express, { json, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors"; 
import authRouter from "./router/auth-router";
import homeRouter from "./router/home-router";
import operationRouter from "./router/operation-router";
import ativeRouter from "./router/ative-router";
import { errorHandler } from "./middleware/errorHandler";


dotenv.config();
const app = express();
app.use(cors());
app.use(json());
app.use(authRouter)
app.use(homeRouter)
app.use(operationRouter)
app.use(ativeRouter)
app.use(errorHandler);
app.get("/health", (req: Request, res: Response) => {
    res.status(200).send("ok!");
});

export default app;