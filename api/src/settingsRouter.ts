import { Router } from 'express';

import { collectionEnvelope } from './responseEnvelope';
import db from './db';

const settingsRouter = Router();

settingsRouter.get('/:category', async (req, res, next) => {
  const categoryName = req.params.category;
  try {
    const settings = await db('settings')
      .select('property', 'content')
      .where({ category: categoryName });
    const countAlias = 'total_count';
    const totalCounts = await db('settings')
      .count({ [countAlias]: '*' })
      .where({ category: categoryName });
    res.json(collectionEnvelope(settings, totalCounts[0][countAlias]));
  } catch (error) {
    next(error);
    return;
  }
});
export default settingsRouter;
