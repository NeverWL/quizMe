import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {createBrowserRouter, RouterProvider} from 'react-router-dom';
import HomePage from './pages/HomePage';
import SelectPage from './pages/SelectPage';
import QuizPage from './pages/QuizPage';
import ResultsPage from './pages/ResultsPage';
import TestPage from './pages/TestPage';
import OCRPage from './pages/OCRPage';
import HistoryPage from './pages/HistoryPage';
import { AuthProvider } from "./context/AuthContext";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


const router = createBrowserRouter([
  {
    path: '/quizMe',
    element: <HomePage />,
    errorElement: <div>404 Not Found</div>,
  }, 
  {
    path: '/SelectPage',
    element: <SelectPage />,
  },
  {
    path: '/QuizPage',
    element: <QuizPage />
  },
  {
    path: '/ResultsPage',
    element: <ResultsPage />
  }, 
  {
    path: '/TestPage',
    element: <TestPage />
  }, 
  {
    path: '/OCRPage',
    element: <OCRPage />
  }, 
  {
    path: '/HistoryPage',
    element: <HistoryPage />,
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
