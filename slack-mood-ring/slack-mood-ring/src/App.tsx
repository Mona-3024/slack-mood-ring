import React from 'react';
import Dashboard from './pages/Dashboard';
import { MoodProvider } from './contexts/MoodContext';
import { ThemeProvider } from './contexts/ThemeContext';

import './index.css';

function App() {
  return (
    <ThemeProvider>
      <MoodProvider>
        <Dashboard />
      </MoodProvider>
    </ThemeProvider>
  );
}

export default App;