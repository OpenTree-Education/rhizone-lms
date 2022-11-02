import { Router } from 'express';
import { findGreeting, createGreeting } from '../services/greetingsService';

import { itemEnvelope } from './responseEnvelope';

const greetingsRouter = Router();

greetingsRouter.get('/', async (req, res, next) => {
  const { principalId } = req.session;
  console.log("get");
  let greeting;
  try {
    [greeting] = await findGreeting(principalId);
  } catch (err) {
    next(err);
    return;
  }
  console.log(greeting);
  res.json(itemEnvelope(greeting))
});

greetingsRouter.post('/', async (req, res, next) => {
  console.log("post");
  const { principalId } = req.session;
  let greeting;

    try {
      greeting = await createGreeting(principalId);
    } catch (err) {
      next(err);
      return;
    }

  console.log("route" + greeting)
  res.status(201).json(itemEnvelope(greeting));
});

export default greetingsRouter;
