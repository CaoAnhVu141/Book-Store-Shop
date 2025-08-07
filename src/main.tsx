import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Layout from '@/layout'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import BookPage from 'pages/client/book.tsx';
import AboutPage from 'pages/client/about.tsx';
import LoginPage from 'pages/client/auth/login.tsx';
import RegisterPage from 'pages/client/auth/register.tsx';
import './style/global.scss'
import enUS from 'antd/locale/en_US';
import { App, ConfigProvider } from 'antd';
import HomePage from 'pages/client/home.tsx';
import { AppProvider } from 'components/context/app.context';
import ProtectedRoute from 'components/auth';
import LayoutAdmin from './components/layout/layout.admin';
import DashboardPage from './pages/admin/dashboard';
import ManagerOrderPage from './pages/admin/manager.order';
import ManagerBookPage from './pages/admin/manager.book';
import ManagerUserPage from './pages/admin/manager.user';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: "/book",
        element: <BookPage />,
      },
      {
        path: "/about",
        element: <AboutPage />,
      },
      {
        path: "/checkout",
        element: (
          <ProtectedRoute>
            <div>Trang checkout</div>
          </ProtectedRoute>

        ),
      },
    ]
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "book",
        element: (
          <ProtectedRoute>
            <ManagerBookPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "order",
        element: (
          <ProtectedRoute>
            <ManagerOrderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "user",
        element: (
          <ProtectedRoute>
            <ManagerUserPage />
          </ProtectedRoute>
        ),
      }
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
    <App>
      <ConfigProvider locale={enUS}>
        <AppProvider>
          <RouterProvider router={router} />
        </AppProvider>
      </ConfigProvider>
    </App>
  </StrictMode>,
)

