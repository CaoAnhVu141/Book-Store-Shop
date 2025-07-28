import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import BookPage from 'pages/client/book.tsx';
import AboutPage from './pages/client/about.tsx';
import LoginPage from './pages/client/auth/login.tsx';
import RegisterPage from './pages/client/auth/register.tsx';
import './style/global.scss'
import ManagerUser from './pages/admin/manager.user.tsx';
import { ProConfigProvider } from '@ant-design/pro-components';
import enUS from 'antd/locale/en_US';
import { ConfigProvider } from 'antd';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/book",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/admin/user",
        element: <ManagerUser />,
      },
    ]
  },
  {
    path: "/Login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  }

]);
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <Layout /> */}
    <ConfigProvider locale={enUS}>
        <RouterProvider router={router} />
    </ConfigProvider>
  </StrictMode>,
)

