import { Router } from 'express';
import { itemEnvelope } from './responseEnvelope';

const darkModeRouter = Router();

darkModeRouter.get('/', async (req, res, next) => {
    const { principalId } = req.session;
    let { darkMode } = req.session;

    // TODO: getDarkMode from the database, set it to darkMode variable

    // TODO: send darkMode back to the browser via API response
});

darkModeRouter.post('/', async (req, res, next) => {
    const { principalId } = req.session;
    const { darkModePreference } = req.body;

    // TODO: setDarkMode into the database

    // TODO: respond that everything went ok
});

export default darkModeRouter;
