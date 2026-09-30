import React from 'react';
import './App.css';
import AppRoutes from './AppRoutes';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <React.Fragment>
      <Toaster />
      <AppRoutes />
    </React.Fragment>
  );
}

export default App;
