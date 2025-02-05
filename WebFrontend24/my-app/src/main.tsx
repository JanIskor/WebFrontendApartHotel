import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Page2 from './pages/Page2'
import App from './App.tsx'
import Apartments from './pages/Page1'


const router = createBrowserRouter([
  {
    path: '/home',
    element: <App />
  },
  {
    path: '/apartments',
    element: <Apartments />
  },
  {
    path: '/details',
    element: <Page2 />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  /*<React.StrictMode>
    <RouterProvider router={router} />
</React.StrictMode>,*/
 <App />
)

