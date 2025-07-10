import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Eye, 
  EyeOff, 
  BookOpen, 
  Users, 
  Download, 
  Play,
  Search,
  X,
  Save,
  ArrowLeft
} from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { Button } from '../components/UI/Button';
import { useAuthStore } from '../store/authStore';
import { toast } from '../store/toastStore';

//@ts-ignore
const VITE_API_URL = import.meta.env.VITE_VITE_API_URL || 'http://localhost:3001';


interface Book {
  id: number;
  title: string;
  description: string;
  cover_image: string;
  category: string;
  downloads: number;
  plays: number;
  created_at: string;
  created_by_name?: string;
  file_url?: string;
  audio_url?: string;
  video_url?: string;
  is_active: boolean;
}

interface BookFormData {
  title: string;
  description: string;
  category: string;
  cover_image: string;
  file_url: string;
  audio_url: string;
  video_url: string;
}

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useAuthStore();
  const [books, setBooks] = useState<Book[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [showBookForm, setShowBookForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [formData, setFormData] = useState<BookFormData>({
    title: '',
    description: '',
    category: '',
    cover_image: '',
    file_url: '',
    audio_url: '',
    video_url: ''
  });
  const [stats, setStats] = useState({
    totalBooks: 0,
    activeBooks: 0,
    totalUsers: 0,
    totalDownloads: 0,
    totalPlays: 0
  });

  // Check if user has admin permissions
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      toast.error(
        'Acceso denegado',
        'Solo los administradores pueden acceder al panel de control.'
      );
      navigate('/');
      return;
    }
    
    fetchBooks();
    fetchCategories();
    fetchStats();
  }, [user, navigate]);

  const fetchBooks = async () => {
    if (!token) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`${VITE_API_URL}/api/books?limit=100`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setBooks(data.books || []);
    } catch (error) {
      console.error('Error fetching books:', error);
      toast.error(
        'Error al cargar libros',
        'No se pudieron cargar los libros del panel de control.'
      );
      setBooks([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${VITE_API_URL}/api/books/meta/categories`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      const categoryNames = (data.categories || []).map((cat: any) => cat.name);
      setCategories(['Todos', ...categoryNames]);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(
        'Error al cargar categorías',
        'No se pudieron cargar las categorías.'
      );
      setCategories(['Todos']);
    }
  };

  const fetchStats = async () => {
    if (!token) return;
    
    try {
      const response = await fetch(`${VITE_API_URL}/api/stats/admin`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setStats(data.overview || {
        totalBooks: 0,
        activeBooks: 0,
        totalUsers: 0,
        totalDownloads: 0,
        totalPlays: 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error(
        'Error al cargar estadísticas',
        'No se pudieron cargar las estadísticas del panel.'
      );
    }
  };

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateBook = () => {
    setEditingBook(null);
    setFormData({
      title: '',
      description: '',
      category: categories.find(cat => cat !== 'Todos') || '',
      cover_image: '',
      file_url: '',
      audio_url: '',
      video_url: ''
    });
    setShowBookForm(true);
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setFormData({
      title: book.title,
      description: book.description,
      category: book.category,
      cover_image: book.cover_image || '',
      file_url: book.file_url || '',
      audio_url: book.audio_url || '',
      video_url: book.video_url || ''
    });
    setShowBookForm(true);
  };

  const handleToggleBookStatus = async (bookId: number) => {
    if (!token) return;
    
    const book = books.find(b => b.id === bookId);
    if (!book) return;

    try {
      const response = await fetch(`${VITE_API_URL}/api/books/${bookId}/toggle-active`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al cambiar estado');
      }

      // Refresh data after successful toggle
      await Promise.all([fetchBooks(), fetchStats()]);
      
      toast.success(
        'Estado actualizado',
        `El libro "${book.title}" ha sido ${book.is_active ? 'ocultado' : 'activado'} exitosamente.`
      );
    } catch (error) {
      console.error('Error toggling book status:', error);
      toast.error(
        'Error al cambiar estado',
        error instanceof Error ? error.message : 'No se pudo cambiar el estado del libro. Intenta nuevamente.'
      );
    }
  };

  const handleSaveBook = async () => {
    if (!token) return;
    
    if (!formData.title.trim() || !formData.category) {
      toast.warning(
        'Campos requeridos',
        'Por favor completa el título y selecciona una categoría.'
      );
      return;
    }

    try {
      const url = editingBook 
        ? `${VITE_API_URL}/api/books/${editingBook.id}`
        : `${VITE_API_URL}/api/books`;
      
      const method = editingBook ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error al guardar el libro');
      }

      setShowBookForm(false);
      
      // Refresh data after successful save
      await Promise.all([fetchBooks(), fetchStats(), fetchCategories()]);
      
      toast.success(
        editingBook ? 'Libro actualizado' : 'Libro creado',
        `El libro "${formData.title}" ha sido ${editingBook ? 'actualizado' : 'creado'} exitosamente.`
      );
    } catch (error) {
      console.error('Error saving book:', error);
      toast.error(
        'Error al guardar libro',
        error instanceof Error ? error.message : 'No se pudo guardar el libro. Intenta nuevamente.'
      );
    }
  };

  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || book.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      {/* Dashboard Header */}
      <section className="bg-white border-b border-gray-200">
        <div className="container-brand py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-4 mb-2">
                <Button
                  variant="ghost"
                  icon={ArrowLeft}
                  onClick={() => navigate('/')}
                  className="text-gray-600"
                >
                  Volver al Inicio
                </Button>
              </div>
              <h1 className="text-3xl font-bold font-serif text-brand-navy">
                Panel de Control - Administrador
              </h1>
              <p className="text-gray-600 mt-2">
                Gestiona libros y contenido de la biblioteca digital
              </p>
            </div>
            <Button
              variant="primary"
              icon={Plus}
              onClick={handleCreateBook}
            >
              Agregar Libro
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8">
        <div className="container-brand">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-brand-orange rounded-xl flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-brand-navy">{stats.totalBooks}</div>
              <div className="text-sm text-gray-600">Total Libros</div>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-brand-navy">{stats.activeBooks}</div>
              <div className="text-sm text-gray-600">Libros Activos</div>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-brand-navy">{stats.totalUsers}</div>
              <div className="text-sm text-gray-600">Usuarios</div>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-brand-navy">{stats.totalDownloads}</div>
              <div className="text-sm text-gray-600">Descargas</div>
            </div>

            <div className="card p-6 text-center">
              <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Play className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold text-brand-navy">{stats.totalPlays}</div>
              <div className="text-sm text-gray-600">Reproducciones</div>
            </div>
          </div>
        </div>
      </section>

      {/* Books Management */}
      <section className="pb-16">
        <div className="container-brand">
          <div className="card p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 space-y-4 lg:space-y-0">
              <h2 className="text-2xl font-bold font-serif text-brand-navy">
                Gestión de Libros ({filteredBooks.length})
              </h2>
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Buscar libros..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="input-field pl-10 w-full sm:w-64"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="input-field w-full sm:w-48"
                >
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Books Table */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-orange mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando libros...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-semibold text-brand-navy">Libro</th>
                      <th className="text-left py-3 px-4 font-semibold text-brand-navy">Categoría</th>
                      <th className="text-left py-3 px-4 font-semibold text-brand-navy">Estado</th>
                      <th className="text-left py-3 px-4 font-semibold text-brand-navy">Estadísticas</th>
                      <th className="text-left py-3 px-4 font-semibold text-brand-navy">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBooks.map((book) => (
                      <tr key={book.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <img
                              src={book.cover_image || 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg'}
                              alt={book.title}
                              className="w-12 h-16 object-cover rounded"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg';
                              }}
                            />
                            <div>
                              <h3 className="font-semibold text-brand-navy">{book.title}</h3>
                              <p className="text-sm text-gray-600 line-clamp-2">{book.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <span className="bg-brand-orange/10 text-brand-orange px-2 py-1 rounded-full text-sm">
                            {book.category}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-2 py-1 rounded-full text-sm ${
                            book.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {book.is_active ? 'Activo' : 'Oculto'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-600">
                            <div>{book.downloads || 0} descargas</div>
                            <div>{book.plays || 0} reproducciones</div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => handleEditBook(book)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            
                            <button
                              onClick={() => handleToggleBookStatus(book.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                book.is_active
                                  ? 'text-red-600 hover:bg-red-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={book.is_active ? 'Ocultar' : 'Mostrar'}
                            >
                              {book.is_active ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredBooks.length === 0 && !isLoading && (
                  <div className="text-center py-12">
                    <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No se encontraron libros</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Book Form Modal */}
      {showBookForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-soft-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold font-serif text-brand-navy">
                {editingBook ? 'Editar Libro' : 'Agregar Nuevo Libro'}
              </h2>
              <button
                onClick={() => setShowBookForm(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Título *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field w-full"
                    placeholder="Título del libro"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={4}
                    className="input-field w-full resize-none"
                    placeholder="Descripción del libro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    Categoría *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="input-field w-full"
                    required
                  >
                    <option value="">Seleccionar categoría</option>
                    {categories.filter(cat => cat !== 'Todos').map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    URL de Imagen de Portada
                  </label>
                  <input
                    type="url"
                    value={formData.cover_image}
                    onChange={(e) => setFormData(prev => ({ ...prev, cover_image: e.target.value }))}
                    className="input-field w-full"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    URL del Archivo PDF
                  </label>
                  <input
                    type="text"
                    value={formData.file_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, file_url: e.target.value }))}
                    className="input-field w-full"
                    placeholder="/uploads/books/archivo.pdf"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    URL del Audio
                  </label>
                  <input
                    type="text"
                    value={formData.audio_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, audio_url: e.target.value }))}
                    className="input-field w-full"
                    placeholder="/uploads/audio/archivo.mp3"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-brand-navy mb-2">
                    URL del Video
                  </label>
                  <input
                    type="text"
                    value={formData.video_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, video_url: e.target.value }))}
                    className="input-field w-full"
                    placeholder="/uploads/video/archivo.mp4"
                  />
                </div>
              </form>
            </div>

            <div className="flex items-center justify-end space-x-4 p-6 border-t border-gray-100">
              <Button
                variant="outline"
                onClick={() => setShowBookForm(false)}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                icon={Save}
                onClick={handleSaveBook}
                disabled={!formData.title || !formData.category}
              >
                {editingBook ? 'Actualizar' : 'Crear'} Libro
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};