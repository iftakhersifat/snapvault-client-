import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import Root from './Components/Root/Root.jsx';
import Home from './Components/Pages/Home.jsx';
import Upload from './Components/Pages/Upload.jsx';
import MyUploads from './Components/Pages/MyUploads.jsx';
import SignUp from './Components/Firebase/SignUp.jsx';
import LogIn from './Components/Firebase/LogIn.jsx';
import AuthProvider from './Components/Firebase/AuthProvider.jsx';
import { Toaster } from 'react-hot-toast';
import MediaGallery from './Components/Pages/MediaGallery.jsx';
const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children:[
      {index: true, Component: Home},
      {path: "upload", Component: Upload},
      {path: "mymedia", Component: MyUploads},
      {path: "gallery", Component: MediaGallery},

      // firebase
      {path: "signup", Component:SignUp},
      {path: "login", Component:LogIn},
    ]
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <Toaster position="top-right" />
        <RouterProvider router={router} />
    </AuthProvider>  
  </StrictMode>,
)
