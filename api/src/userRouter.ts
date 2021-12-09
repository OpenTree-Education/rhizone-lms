import { Router } from 'express';
import { itemEnvelope } from './responseEnvelope';

const userRouter = Router();

userRouter.get('/', (req, res) => {
  const { principalId } = req.session;
  res.json(itemEnvelope({ principal_id: principalId || null }));
});

export default userRouter;
