import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

// Pages
import Home from './pages/Home';
import RegisterDonor from './pages/RegisterDonor';
import FindDonor from './pages/FindDonor';
import RequestBlood from './pages/RequestBlood';
import RequestStatus from './pages/RequestStatus';
import DonorDashboard from './pages/DonorDashboard';
import HospitalDashboard from './pages/HospitalDashboard';
import AdminPanel from './pages/AdminPanel';
import DataTablePage from './pages/DataTablePage';
import Login from './pages/Login';
import Register from './pages/Register';
import About from './pages/About';
import Contact from './pages/Contact';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <BrowserRouter>
            <div className="min-h-screen flex flex-col bg-brand-grayBg dark:bg-slate-950 text-slate-800 dark:text-slate-100 transition-colors">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/register-donor" element={<RegisterDonor />} />
                  <Route path="/find-donor" element={<FindDonor />} />
                  <Route path="/request-blood" element={<RequestBlood />} />
                  <Route path="/request/:id" element={<RequestStatus />} />
                  <Route path="/data" element={<DataTablePage />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />

                  {/* Protected routes */}
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute allowedRoles={['donor', 'admin']}>
                        <DonorDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/hospital"
                    element={
                      <ProtectedRoute allowedRoles={['hospital', 'admin']}>
                        <HospitalDashboard />
                      </ProtectedRoute>
                    }
                  />

                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute allowedRoles={['admin']}>
                        <AdminPanel />
                      </ProtectedRoute>
                    }
                  />

                  {/* Catch-all 404 */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
