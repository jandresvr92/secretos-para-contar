import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-navy text-white">
      <div className="container-brand section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-3 mb-6">
              <div className="relative">
                <img 
                  src="/image.png" 
                  alt="Secretos Para Contar Logo" 
                  className="w-12 h-12 object-contain"
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-serif text-white">
                  Secretos Para Contar
                </h2>
                <p className="text-gray-300 font-medium">
                  Biblioteca Digital
                </p>
              </div>
            </Link>
            
            <p className="text-gray-300 mb-6 leading-relaxed font-serif">
              Llevamos educación y literatura a todas las familias a través de nuestra 
              biblioteca digital gratuita. Descubre un mundo de historias, cuentos y 
              aventuras para niños y adultos.
            </p>
            
            <div className="flex items-center space-x-2 text-gray-300">
              <Heart className="w-5 h-5 text-brand-orange" />
              <span className="font-medium">Desarrollado con amor para la educación</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold font-serif mb-6">Enlaces Rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/library" className="text-gray-300 hover:text-brand-orange transition-colors font-medium">
                  Biblioteca
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-brand-orange transition-colors font-medium">
                  Nosotros
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-brand-orange transition-colors font-medium">
                  Contacto
                </Link>
              </li>
              <li>
                <Link to="/donate" className="text-gray-300 hover:text-brand-orange transition-colors font-medium">
                  Donaciones
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold font-serif mb-6">Contacto</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-brand-orange mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">info@secretosparacontar.org</p>
                  <p className="text-gray-400 text-sm">Consultas generales</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-brand-orange mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">+57 (604) 3001010</p>
                  <p className="text-gray-400 text-sm">Lunes a Viernes, 9AM - 5PM</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-orange mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-gray-300 font-medium">Medellín, Colombia</p>
                  <p className="text-gray-400 text-sm">Oficina principal</p>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-navy-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-6">
              <a 
                href="#" 
                className="w-10 h-10 bg-navy-800 rounded-full flex items-center justify-center hover:bg-brand-orange transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-navy-800 rounded-full flex items-center justify-center hover:bg-brand-orange transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 bg-navy-800 rounded-full flex items-center justify-center hover:bg-brand-orange transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
            
            <div className="text-center md:text-right">
              <p className="text-gray-400 text-sm">
                © 2025 Secretos Para Contar. Todos los derechos reservados.
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Biblioteca digital educativa sin fines de lucro
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};