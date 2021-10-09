import { Router } from "express";
import eventoRouter from "./eventoRouter";
import relacionadosRouter from "./relacionadosRouter";

const routes = Router();

routes.use('/evento', eventoRouter)
routes.use('/relacionados', relacionadosRouter);

export default routes;