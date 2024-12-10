import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import AuthModal from './auth/AuthModal';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-serif">Taarifa Suites</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex sm:items-center sm:space-x-8">
            <Link to="/" className="text-gray-700 hover:text-amber-600">
              Home
            </Link>
            <Link to="/suites" className="text-gray-700 hover:text-amber-600">
              Our Suites
            </Link>
            <Link to="/long-stay" className="text-gray-700 hover:text-amber-600">
              Long Stay
            </Link>
            <Link to="/amenities" className="text-gray-700 hover:text-amber-600">
              Amenities
            </Link>
            
            {isLoggedIn ? (
              <div className="relative ml-3">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center text-gray-700 hover:text-amber-600"
                >
                  <User className="h-5 w-5 mr-1" />
                  <span>Account</span>
                </button>
                
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-amber-600 hover:bg-amber-700"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="sm:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-amber-600"
            >
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
            >
              Home
            </Link>
            <Link
              to="/suites"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
            >
              Our Suites
            </Link>
            <Link
              to="/long-stay"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
            >
              Long Stay
            </Link>
            <Link
              to="/amenities"
              className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
            >
              Amenities
            </Link>
            
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="block w-full text-left pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:text-amber-600 hover:bg-gray-50"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}

      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </nav>
  );
}