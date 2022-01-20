import { Router } from 'express';

import { findDocBySlug } from '../services/docsService';
import { itemEnvelope } from './responseEnvelope';
import { NotFoundError } from './httpErrors';

const settingsRouter = Router();

settingsRouter.get('/:slug', async (req, res, next) => {
  const { slug } = req.params;
  let doc;
  try {
    doc = await findDocBySlug(slug);
  } catch (error) {
    next(error);
    return;
  }
  if (!doc) {
    next(
      new NotFoundError(`A doc with the slug "${slug}" could not be found.`)
    );
    return;
  }
  res.json(itemEnvelope(doc));
});

export default settingsRouter;
