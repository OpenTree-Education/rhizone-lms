import { Router } from 'express';

import { findSettings } from '../services/settingsService';
import { itemEnvelope } from './responseEnvelope';

const settingsRouter = Router();

settingsRouter.get('/:category', async (req, res, next) => {
  const { category } = req.params;
  let settings;
  try {
    settings = await findSettings(category);
  } catch (error) {
    next(error);
    return;
  }
  res.json(itemEnvelope(settings));
});

export default settingsRouter;
