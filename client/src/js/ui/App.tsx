// import { Suspense, lazy } from 'preact/compat';
// import * as ReactDOMClient from 'react-dom/client';

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import HomePage from './pages/HomePage';
import About from './pages/About';
import { Root } from './components/Root';

export function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root/>,
      children: [
        {
          index: true,
          element: <HomePage/>,
        },
        {
          path: "account",
          element: <HomePage/>,
        },
      ],
    },
    {
      path: "about",
      element: <About/>,
    },
  ]);

  return (
    <RouterProvider router={router} />
  )
}