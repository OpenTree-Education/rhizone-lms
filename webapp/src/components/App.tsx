import { BrowserRouter, Route, Routes } from 'react-router-dom';
import React, { useContext } from 'react';

import CompetenciesPage from './CompetenciesPage';
import DocPage from './DocPage';
import Footer from './Footer';
import MeetingPage from './MeetingPage';
import { MeetingsDrawerProvider } from './MeetingsDrawerContext';
import Navbar from './Navbar';
import ReflectionsPage from './ReflectionsPage';
import RequireAuth from './RequireAuth';
import SessionContext from './SessionContext';
import ProgramsPage from './ProgramsPage';

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
            path="/competencies"
            element={
              <RequireAuth>
                <CompetenciesPage />
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
          <Route
            path="/calendar"
            element={
              <RequireAuth>
                <ProgramsPage />
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
