import React, { createContext, PropsWithChildren } from 'react';

import { Settings } from '../types/api';
import useApiData from '../helpers/useApiData';

const defaultSettings = {
  id: null,
  default_questionnaire_id: '',
};

const SettingsContext = createContext<Settings>(defaultSettings);

export const SettingsProvider = ({ children }: PropsWithChildren<{}>) => {
  const { data: settings } = useApiData<Settings>({
    initialData: defaultSettings,
    path: '/settings/webapp',
  });
  if (!settings) {
    return null;
  }
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
