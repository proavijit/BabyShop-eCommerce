import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from 'next-themes'
import { Toaster } from 'sonner'
import './index.css'

import { About } from './pages/About'
import { NotFound } from './pages/NotFound'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { Dashboard } from './pages/Dashboard'
import { Users } from './pages/Users'
import { Orders } from './pages/Orders'
import { Invoices } from './pages/Invoices'
import { Products } from './pages/Products'
import { Accounts } from './pages/Accounts'
import { Banner } from './pages/Banner'
import { Categories } from './pages/Categories'
import { Brands } from './pages/Brands'
import App from './App'
import ProtectedRoute from './components/ProtectedRoute'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <Toaster richColors position="top-right" closeButton />
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected dashboard routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<App />}>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="dashboard/users" element={<Users />} />
              <Route path="dashboard/orders" element={<Orders />} />
              <Route path="dashboard/invoices" element={<Invoices />} />
              <Route path="dashboard/products" element={<Products />} />
              <Route path="dashboard/brands" element={<Brands />} />
              <Route path="dashboard/accounts" element={<Accounts />} />
              <Route path="dashboard/banner" element={<Banner />} />
              <Route path="dashboard/about" element={<About />} />
              <Route path="dashboard/categories" element={<Categories />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </StrictMode>
)
