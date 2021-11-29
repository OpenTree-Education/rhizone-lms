import { Router } from 'express';

import db from './db';
import { itemEnvelope } from './responseEnvelope';

const settingsRouter = Router();

settingsRouter.get('/:category', async (req, res, next) => {
  const { category } = req.params;
  let settingsRows;
  try {
    settingsRows = await db('settings')
      .select('property', 'content')
      .where({ category })
      .orderBy('property');
  } catch (error) {
    next(error);
    return;
  }
  const settings = settingsRows.reduce(
    (mappedSettings, { content, property }) => ({
      ...mappedSettings,
      [property]: content,
    }),
    // All items should have an `id` property for API consistency
    { id: category }
  );
  res.json(itemEnvelope(settings));
});

export default settingsRouter;
