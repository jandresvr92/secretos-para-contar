import React, { useEffect } from 'react';
import { Search, Filter, BookOpen } from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { BookCard } from '../components/BookCard/BookCard';
import { BookDetail } from '../components/BookDetail/BookDetail';
import { Button } from '../components/UI/Button';
import { useAuthStore } from '../store/authStore';
import { useBookStore } from '../store/bookStore';
import { useNavigate } from 'react-router-dom';

//@ts-ignore
const VITE_API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export const Library: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuthStore();
  const { 
    books, 
    categories, 
    selectedBook, 
    isLoading, 
    filters,
    fetchBooks, 
    fetchCategories, 
    setSelectedBook, 
    setFilters,
    recordInteraction 
  } = useBookStore();

  // Initialize data
  useEffect(() => {
    fetchBooks();
    fetchCategories();
  }, []);

  // Fetch books when filters change
  useEffect(() => {
    fetchBooks({
      search: filters.search || undefined,
      category: filters.category !== 'Todos' ? filters.category : undefined
    });
  }, [filters]);

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
      link.href = `${VITE_API_URL}${book.file_url}`;
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
      window.open(`${VITE_API_URL}${book.audio_url}`, '_blank');
    }
  };

  const handlePlayVideo = async (book: any) => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (book.video_url) {
      await recordInteraction(book.id, 'play_video', token || undefined);
      window.open(`${VITE_API_URL}${book.video_url}`, '_blank');
    }
  };

  const handleSearchChange = (value: string) => {
    setFilters({ search: value });
  };

  const handleCategoryChange = (category: string) => {
    setFilters({ category });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-orange-50 via-white to-navy-50 py-16">
        <div className="container-brand">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold font-serif text-brand-navy mb-6">
              Nuestra Biblioteca Digital
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Explora nuestra colección de libros, cuentos y recursos educativos 
              disponibles en múltiples formatos para toda la familia.
            </p>
            
            {/* Authentication Notice */}
            {!user && (
              <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-xl max-w-2xl mx-auto">
                <p className="text-blue-800 font-medium">
                  📚 <strong>¡Inicia sesión</strong> para acceder a descargas, audio y video de todos nuestros libros
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="bg-white py-8 border-b border-gray-100">
        <div className="container-brand">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search */}
            <div className="relative flex-1 max-w-md lg:max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar libros, cuentos, autores..."
                value={filters.search}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="input-field pl-12 w-full"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0">
              <Filter className="w-5 h-5 text-gray-400 flex-shrink-0" />
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryChange(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                    filters.category === category
                      ? 'bg-brand-orange text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Books Grid */}
      <section className="section-padding bg-gray-50">
        <div className="container-brand">
          {isLoading ? (
            <div className="text-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-orange mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando libros...</p>
            </div>
          ) : books.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {books.map((book, index) => (
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
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No se encontraron libros
              </h3>
              <p className="text-gray-500 mb-6">
                Intenta con otros términos de búsqueda o selecciona una categoría diferente.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({ search: '', category: 'Todos' });
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          )}
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