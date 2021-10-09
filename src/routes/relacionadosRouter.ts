import { Router } from 'express';
import RelacionadosController from '../controllers/RelacionadosController';

const relacionadosRouter = Router();

const relacionadosController = new RelacionadosController();

relacionadosRouter.get('/', relacionadosController.show);
relacionadosRouter.get('/periodo', relacionadosController.showPeriodo);
relacionadosRouter.post('/', relacionadosController.create);
relacionadosRouter.delete('/:id', relacionadosController.delete);
relacionadosRouter.put('/:id', relacionadosController.update);

export default relacionadosRouter;