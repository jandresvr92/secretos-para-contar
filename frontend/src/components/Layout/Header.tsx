import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Settings } from 'lucide-react';
import { Button } from '../UI/Button';

interface HeaderProps {
  user?: {
    name: string;
    role: string;
  } | null;
  onLogin: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  user, 
  onLogin, 
  onLogout
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/library', label: 'Biblioteca' },
    { path: '/about', label: 'Nosotros' },
    { path: '/contact', label: 'Contacto' },
    { path: '/donate', label: 'Donaciones' }
  ];

  const handleDashboardClick = () => {
    navigate('/dashboard');
    setIsUserMenuOpen(false);
  };

  return (
    <header className="bg-white shadow-soft sticky top-0 z-50">
      <div className="container-brand">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="relative">
              <img 
                src="/image.png" 
                alt="Secretos Para Contar Logo" 
                className="w-12 h-12 lg:w-16 lg:h-16 object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl lg:text-2xl font-bold font-serif text-brand-navy">
                Secretos Para Contar
              </h1>
              <p className="text-sm text-gray-600 font-medium">
                Biblioteca Digital
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium transition-colors ${
                  isActive(link.path)
                    ? 'text-brand-orange'
                    : 'text-brand-navy hover:text-brand-orange'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className="w-8 h-8 bg-brand-orange rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden sm:block text-left">
                    <p className="text-sm font-medium text-brand-navy">{user.name}</p>
                    <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                  </div>
                </button>

                {/* User Dropdown */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-soft-lg border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-brand-navy">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    
                    {(user.role === 'admin' || user.role === 'teacher') && (
                      <button
                        onClick={handleDashboardClick}
                        className="w-full px-4 py-2 text-left text-sm text-brand-navy hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <Settings className="w-4 h-4" />
                        <span>Panel de Control</span>
                      </button>
                    )}
                    
                    <button
                      onClick={() => {
                        onLogout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Button onClick={onLogin} size="md">
                Iniciar Sesión
              </Button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-gray-50 transition-colors"
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-brand-navy" />
              ) : (
                <Menu className="w-6 h-6 text-brand-navy" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-100 py-4 animate-slide-up">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`font-medium py-2 transition-colors ${
                    isActive(link.path)
                      ? 'text-brand-orange'
                      : 'text-brand-navy hover:text-brand-orange'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};