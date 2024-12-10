import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import { BookingProvider } from './context/BookingContext';
import { AuthProvider } from './context/AuthContext';
import Footer from './components/Footer';
import MainLayout from './components/layout/MainLayout';

// Protected Route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <BookingProvider>
          <MainLayout>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </MainLayout>
        </BookingProvider>
      </AuthProvider>
    </Router>
  );
}