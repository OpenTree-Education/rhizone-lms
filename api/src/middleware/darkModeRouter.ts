import { Router } from 'express';
import { getDarkMode, setDarkMode } from '../services/darkModeService';
import { itemEnvelope } from './responseEnvelope';

const darkModeRouter = Router();

darkModeRouter.get('/', async (req, res, next) => {
  const { principalId } = req.session;
  let { darkMode } = req.session;

  // TODO: getDarkMode from the database, set it to darkMode variable
  if (typeof darkMode === "undefined") {
    try {
      darkMode = await getDarkMode(principalId);
    } catch (e) {
      next(e);
      return;
    }
  }

  // TODO: send darkMode back to the browser via API response
  res.json(itemEnvelope({principal_id: principalId, dark_mode: darkMode}));
});

darkModeRouter.post('/', async (req, res, next) => {
  const { principalId } = req.session;
  const { darkModePreference } = req.body;

  // TODO: setDarkMode into the database
  try {
    await setDarkMode(principalId, darkModePreference);
  } catch (e) {
    next(e);
    return;
  }

  // TODO: respond that everything went ok
  res.status(201);
});

export default darkModeRouter;
