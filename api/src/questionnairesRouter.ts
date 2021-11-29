import { Router } from 'express';

const questionnairesRouter = Router();

questionnairesRouter.get('/:id', (req, res, next) => {
  next('Not implemented');
});

export default questionnairesRouter;
