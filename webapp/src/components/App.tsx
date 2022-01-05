import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import React, { useState } from 'react';

import Footer from './Footer';
import MeetingPage from './MeetingPage';
import MeetingsDrawer from './MeetingsDrawer';
import Navbar from './Navbar';
import Reflections from './Reflections';

const App = () => {
  const [isMeetingDrawerOpen, setIsMeetingDrawerOpen] = useState(false);
  return (
    <BrowserRouter>
      <Navbar onCalendarClick={() => setIsMeetingDrawerOpen(true)} />
      <Container fixed>
        <Routes>
          <Route path="/" element={<Reflections />} />
          <Route path="/meetings/:id" element={<MeetingPage />} />
        </Routes>
      </Container>
      <MeetingsDrawer
        isOpen={isMeetingDrawerOpen}
        onClose={() => setIsMeetingDrawerOpen(false)}
      />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
