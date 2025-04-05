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
import 'bootstrap/dist/css/bootstrap.css'

const router = createBrowserRouter([
  {
    path: '/',
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
  }
]);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
