import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Users, Download, Play, Heart, Star, ArrowRight } from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { BookCard } from '../components/BookCard/BookCard';
import { BookDetail } from '../components/BookDetail/BookDetail';
import { Button } from '../components/UI/Button';
import { useAuthStore } from '../store/authStore';
import { useBookStore } from '../store/bookStore';

//@ts-ignore
const API_URL = import.meta.env.API_URL || 'http://localhost:3001';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuthStore();
  const { 
    books,  
    selectedBook, 
    isLoading, 
    fetchBooks, 
    fetchCategories, 
    setSelectedBook, 
    recordInteraction 
  } = useBookStore();

  const [stats, setStats] = useState({
    totalBooks: 0,
    totalUsers: 0,
    totalDownloads: 0,
    totalPlays: 0
  });

  // Initialize data
  useEffect(() => {
    fetchBooks({ limit: 8 }); // Only show 8 books on home page
    fetchCategories();
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_URL}/api/stats`);
      const data = await response.json();
      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
  };

  const handleBookView = (book: any) => {
    setSelectedBook(book);
  };

  const handleBookDownload = async (book: any) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (book.file_url) {
      await recordInteraction(book.id, 'download', token || undefined);
      // Create download link
      const link = document.createElement('a');
      link.href = `${API_URL}${book.file_url}`;
      link.download = `${book.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePlayAudio = async (book: any) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (book.audio_url) {
      await recordInteraction(book.id, 'play_audio', token || undefined);
      window.open(`${API_URL}${book.audio_url}`, '_blank');
    }
  };

  const handlePlayVideo = async (book: any) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (book.video_url) {
      await recordInteraction(book.id, 'play_video', token || undefined);
      window.open(`${API_URL}${book.video_url}`, '_blank');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-navy-50 section-padding">
        <div className="container-brand">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold font-serif text-brand-navy mb-6 animate-fade-in">
              Descubre un mundo de{' '}
              <span className="text-brand-gradient">historias</span>
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed animate-fade-in animation-delay-200">
              Biblioteca digital gratuita con cuentos, libros educativos y recursos 
              para toda la familia. Aprende, imagina y crece con nosotros.
            </p>
            
            {/* Authentication Notice */}
            {!user && (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-2xl mx-auto animate-fade-in animation-delay-300">
                <p className="text-blue-800 font-medium">
                  📚 <strong>¡Inicia sesión</strong> para acceder a descargas, audio y video de todos nuestros libros
                </p>
              </div>
            )}
            
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-12 animate-fade-in animation-delay-400">
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-brand">
                  <BookOpen className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-brand-navy">{stats.totalBooks.toLocaleString()}</div>
                <div className="text-gray-600 font-medium">Libros</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-brand-navy">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-gray-600 font-medium">Usuarios</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-brand">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-brand-navy">{stats.totalDownloads.toLocaleString()}</div>
                <div className="text-gray-600 font-medium">Descargas</div>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Play className="w-8 h-8 text-white" />
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-brand-navy">{stats.totalPlays.toLocaleString()}</div>
                <div className="text-gray-600 font-medium">Reproducciones</div>
              </div>
            </div>

            <Link to="/library">
              <Button size="lg" className="animate-fade-in animation-delay-600">
                Explorar Biblioteca
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Books */}
      <section className="section-padding bg-gray-50">
        <div className="container-brand">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-brand-navy mb-4">
              Libros Destacados
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Descubre algunos de los libros más populares de nuestra biblioteca digital.
              {!user && (
                <span className="block mt-2 text-brand-orange font-semibold">
                  Inicia sesión para acceder al contenido completo
                </span>
              )}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando libros...</p>
            </div>
          ) : books.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {books.slice(0, 8).map((book, index) => (
                  <div
                    key={book.id}
                    className="animate-fade-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <BookCard
                      book={book}
                      onView={handleBookView}
                      onDownload={handleBookDownload}
                      onPlayAudio={handlePlayAudio}
                      onPlayVideo={handlePlayVideo}
                      isAuthenticated={!!user}
                    />
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-12">
                <Link to="/library">
                  <Button variant="outline" size="lg" icon={ArrowRight} iconPosition="right">
                    Ver Toda la Biblioteca
                  </Button>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Cargando contenido...
              </h3>
              <p className="text-gray-500">
                Estamos preparando los mejores libros para ti.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding">
        <div className="container-brand">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-brand-navy mb-6">
              ¿Por qué elegir Secretos Para Contar?
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Ofrecemos una experiencia única de lectura digital diseñada especialmente 
              para familias y educadores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Completamente Gratuito</h3>
              <p className="text-gray-600 leading-relaxed">
                Acceso ilimitado a toda nuestra biblioteca sin costo alguno. 
                La educación debe ser accesible para todos.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Para Toda la Familia</h3>
              <p className="text-gray-600 leading-relaxed">
                Contenido cuidadosamente seleccionado para diferentes edades 
                y niveles de lectura.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Play className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Múltiples Formatos</h3>
              <p className="text-gray-600 leading-relaxed">
                Libros en PDF, audiolibros y videos educativos para diferentes 
                estilos de aprendizaje.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Download className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Descarga Offline</h3>
              <p className="text-gray-600 leading-relaxed">
                Descarga tus libros favoritos para leer sin conexión a internet 
                en cualquier momento.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Star className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Contenido de Calidad</h3>
              <p className="text-gray-600 leading-relaxed">
                Cada libro es revisado por educadores para garantizar 
                valor educativo y entretenimiento.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Comunidad</h3>
              <p className="text-gray-600 leading-relaxed">
                Únete a una comunidad de familias y educadores comprometidos 
                con la educación de calidad.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-brand-orange to-orange-600 section-padding text-white">
        <div className="container-brand text-center">
          <div className="max-w-3xl mx-auto">
            <Heart className="w-16 h-16 mx-auto mb-6 animate-float" />
            <h2 className="text-3xl lg:text-4xl font-bold font-serif mb-6">
              Ayúdanos a seguir creciendo
            </h2>
            <p className="text-xl mb-8 opacity-90 leading-relaxed">
              Tu apoyo nos permite mantener esta biblioteca gratuita y seguir 
              llevando educación y literatura a más familias cada día.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/donate">
                <Button variant="secondary" size="lg">
                  Hacer una Donación
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg" className="bg-white/10 border-white text-white hover:bg-white hover:text-brand-orange">
                  Conocer más
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Book Detail Modal */}
      {selectedBook && (
        <BookDetail
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
          onDownload={handleBookDownload}
          onPlayAudio={handlePlayAudio}
          onPlayVideo={handlePlayVideo}
        />
      )}
    </div>
  );
};