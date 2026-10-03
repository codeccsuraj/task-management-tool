import React from 'react';
import './App.css';
import AppRoutes from './AppRoutes';
import { Toaster } from 'react-hot-toast';
import 'react-quill-new/dist/quill.snow.css'

function App() {
  return (
    <React.Fragment>
      <Toaster />
      <AppRoutes />
    </React.Fragment>
  );
}

export default App;
