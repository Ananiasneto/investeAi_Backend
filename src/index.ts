import express, { json, Request, Response } from "express";
import dotenv from "dotenv";
import authRouter from "./router/auth-router";
import homeRouter from "./router/home-router";
import operationRouter from "./router/operation-router";
import ativeRouter from "./router/ative-router";

dotenv.config();
const app = express();
app.use(json());
app.use(authRouter)
app.use(homeRouter)
app.use(operationRouter)
app.use(ativeRouter)
app.get("/health", (req: Request, res: Response) => {
    res.status(200).send("ok!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));
