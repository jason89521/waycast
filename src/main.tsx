import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './waycast.css';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from 'react-router-dom';
import QuickLink from './pages/QuickLink';
import Waycast from './pages/Waycast';
import { CommandPageLayout } from './layouts/CommandPageLayout';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<App />}>
      <Route path="/" element={<Waycast />} />
      <Route element={<CommandPageLayout />}>
        <Route path="quick-link" element={<QuickLink />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
