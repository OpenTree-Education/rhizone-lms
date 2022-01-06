import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import React, { useEffect, useState } from 'react';

import Footer from './Footer';
import MeetingPage from './MeetingPage';
import MeetingsDrawer from './MeetingsDrawer';
import Navbar from './Navbar';
import ReflectionsPage from './ReflectionsPage';
import { Settings } from '../types/api';
import SettingsContext, { defaultSettings } from './SettingsContext';

const App = () => {
  const [isMeetingDrawerOpen, setIsMeetingDrawerOpen] = useState(false);
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
      <BrowserRouter>
        <Navbar onCalendarClick={() => setIsMeetingDrawerOpen(true)} />
        <Container fixed>
          <Routes>
            <Route path="/" element={<ReflectionsPage />} />
            <Route path="/meetings/:id" element={<MeetingPage />} />
          </Routes>
        </Container>
        <MeetingsDrawer
          isOpen={isMeetingDrawerOpen}
          onClose={() => setIsMeetingDrawerOpen(false)}
        />
        <Footer />
      </BrowserRouter>
    </SettingsContext.Provider>
  );
};

export default App;
