import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useContext } from 'react';

import DocPage from './DocPage';
import Footer from './Footer';
import MeetingPage from './MeetingPage';
import { MeetingsDrawerProvider } from './MeetingsDrawerContext';
import Navbar from './Navbar';
import ReflectionsPage from './ReflectionsPage';
import RequireAuth from './RequireAuth';
import SessionContext from './SessionContext';

const App = () => {
  const { isAuthenticated } = useContext(SessionContext);
  return (
    <BrowserRouter>
      <MeetingsDrawerProvider>
        {isAuthenticated && <Navbar />}
        <Routes>
          <Route
            path="/terms-of-use"
            element={<DocPage docId="terms-of-use" />}
          />
          <Route
            path="/privacy-policy"
            element={<DocPage docId="privacy-policy" />}
          />
          <Route
            path="/"
            element={
              <RequireAuth>
                <ReflectionsPage />
              </RequireAuth>
            }
          />
          <Route
            path="/meetings/:id"
            element={
              <RequireAuth>
                <MeetingPage />
              </RequireAuth>
            }
          />
        </Routes>
        <Footer />
      </MeetingsDrawerProvider>
    </BrowserRouter>
  );
};

export default App;
