import { Router } from 'express';
import {
  getCurrentPage,
  setCurrentPage,
} from '../services/myCoolFeatureService';

import { itemEnvelope } from './responseEnvelope';

const myCoolFeatureRouter = Router();

myCoolFeatureRouter.get('/', async (req, res, next) => {
  const { principalId } = req.session;

  let pageNumber = { page_number: -1 };

  try {
    pageNumber = await getCurrentPage(principalId);
  } catch (e) {
    next(e);
    return;
  }
  res.status(200).json(itemEnvelope(pageNumber));
});

myCoolFeatureRouter.patch('/', async (req, res, next) => {
  const { principalId } = req.session;
  const { currentPage } = req.body;

  try {
    await setCurrentPage(principalId, currentPage);
  } catch (e) {
    next(e);
    return;
  }

  res
    .status(200)
    .json(
      itemEnvelope({ principal_id: principalId, page_number: currentPage })
    );
});

export default myCoolFeatureRouter;
