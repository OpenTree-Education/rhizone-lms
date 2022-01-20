import React, { createContext, ReactNode, useEffect, useState } from 'react';

import { Settings } from '../types/api';

const defaultSettings = {
  id: null,
  default_questionnaire_id: '',
};

const SettingsContext = createContext<Settings>(defaultSettings);

declare interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_ORIGIN}/settings/webapp`, {
      credentials: 'include',
    })
      .then(res => res.json())
      .then(({ data }) => data && setSettings(data));
  }, []);
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
};

export default SettingsContext;
