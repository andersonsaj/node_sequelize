import { Router } from 'express';
import EventoController from '../controllers/EventoController';

const eventoRouter = Router();

const eventoController = new EventoController();

eventoRouter.post('/', eventoController.create);
eventoRouter.get('/', eventoController.show);
eventoRouter.get('/periodo', eventoController.showPeriodo);
eventoRouter.delete('/:id', eventoController.delete);
eventoRouter.put('/:id', eventoController.update);

export default eventoRouter;
