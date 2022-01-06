import { createContext } from 'react';

import { Settings } from '../types/api';

export const defaultSettings = {
  default_questionnaire_id: '',
};

const SettingsContext = createContext<Settings>(defaultSettings);

export default SettingsContext;
