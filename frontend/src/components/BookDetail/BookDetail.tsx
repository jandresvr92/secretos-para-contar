import React from 'react';
import { X, Download, Play, Calendar, User, Eye, Heart, Lock, LogIn } from 'lucide-react';
import { Button } from '../UI/Button';
import { useAuthStore } from '../../store/authStore';
import { useBookStore } from '../../store/bookStore';
import { useNavigate } from 'react-router-dom';
import { toast } from '../../store/toastStore';

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
}

interface BookDetailProps {
  book: Book;
  onClose: () => void;
  onDownload?: (book: Book) => void;
  onPlayAudio?: (book: Book) => void;
  onPlayVideo?: (book: Book) => void;
}

export const BookDetail: React.FC<BookDetailProps> = ({
  book,
  onClose,
  onDownload,
  onPlayAudio,
  onPlayVideo
}) => {
  const { user, token } = useAuthStore();
  const { recordInteraction } = useBookStore();
  const navigate = useNavigate();
  const isAuthenticated = !!user;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAuthRequired = (actionName: string) => {
    toast.warning(
      'Inicio de sesión requerido',
      `Para ${actionName} necesitas iniciar sesión en tu cuenta.`,
      {
        action: {
          label: 'Iniciar Sesión',
          onClick: () => {
            onClose();
            navigate('/login');
          }
        }
      }
    );
  };

  const handleDownload = async () => {
    if (!isAuthenticated) {
      handleAuthRequired('descargar este libro');
      return;
    }

    if (book.file_url) {
      await recordInteraction(book.id, 'download', token || undefined);
      if (onDownload) {
        onDownload(book);
      } else {
        // Direct download
        const link = document.createElement('a');
        link.href = book.file_url;
        link.download = `${book.title}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  const handlePlayAudio = async () => {
    if (!isAuthenticated) {
      handleAuthRequired('reproducir el audio');
      return;
    }

    if (book.audio_url) {
      await recordInteraction(book.id, 'play_audio', token || undefined);
      if (onPlayAudio) {
        onPlayAudio(book);
      } else {
        // Open audio in new tab
        window.open(book.audio_url, '_blank');
      }
    }
  };

  const handlePlayVideo = async () => {
    if (!isAuthenticated) {
      handleAuthRequired('reproducir el video');
      return;
    }

    if (book.video_url) {
      await recordInteraction(book.id, 'play_video', token || undefined);
      if (onPlayVideo) {
        onPlayVideo(book);
      } else {
        // Open video in new tab
        window.open(book.video_url, '_blank');
      }
    }
  };

  const handleView = async () => {
    if (isAuthenticated) {
      await recordInteraction(book.id, 'view', token || undefined);
    }
  };

  React.useEffect(() => {
    handleView();
  }, [book.id]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-soft-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold font-serif text-brand-navy">
            Detalles del Libro
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Image and Actions */}
            <div>
              <div className="aspect-[3/4] rounded-xl overflow-hidden mb-6">
                <img
                  src={book.cover_image || 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg'}
                  alt={book.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg';
                  }}
                />
              </div>

              {/* Authentication Warning */}
              {!isAuthenticated && (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
                  <div className="flex items-start space-x-3">
                    <Lock className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-1">
                        Inicio de sesión requerido
                      </h4>
                      <p className="text-sm text-yellow-700 mb-3">
                        Para acceder al contenido completo necesitas iniciar sesión en tu cuenta.
                      </p>
                      <Button
                        variant="primary"
                        size="sm"
                        icon={LogIn}
                        onClick={() => {
                          onClose();
                          navigate('/login');
                        }}
                      >
                        Iniciar Sesión
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-3">
                {book.file_url && (
                  <Button
                    variant={isAuthenticated ? "primary" : "outline"}
                    size="lg"
                    icon={isAuthenticated ? Download : Lock}
                    onClick={handleDownload}
                    fullWidth
                    disabled={!isAuthenticated}
                  >
                    {isAuthenticated ? 'Descargar PDF' : 'Iniciar Sesión para Descargar'}
                  </Button>
                )}

                {book.audio_url && (
                  <Button
                    variant={isAuthenticated ? "secondary" : "outline"}
                    size="lg"
                    icon={isAuthenticated ? Play : Lock}
                    onClick={handlePlayAudio}
                    fullWidth
                    disabled={!isAuthenticated}
                  >
                    {isAuthenticated ? 'Reproducir Audio' : 'Iniciar Sesión para Audio'}
                  </Button>
                )}

                {book.video_url && (
                  <Button
                    variant="outline"
                    size="lg"
                    icon={isAuthenticated ? Play : Lock}
                    onClick={handlePlayVideo}
                    fullWidth
                    disabled={!isAuthenticated}
                  >
                    {isAuthenticated ? 'Ver Video' : 'Iniciar Sesión para Video'}
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Download className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div className="text-2xl font-bold text-brand-navy">{book.downloads}</div>
                  <div className="text-sm text-gray-600">Descargas</div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center justify-center mb-2">
                    <Play className="w-5 h-5 text-brand-orange" />
                  </div>
                  <div className="text-2xl font-bold text-brand-navy">{book.plays}</div>
                  <div className="text-sm text-gray-600">Reproducciones</div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div>
              {/* Category Badge */}
              <div className="mb-4">
                <span className="bg-brand-orange text-white px-4 py-2 rounded-full text-sm font-medium">
                  {book.category}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl font-bold font-serif text-brand-navy mb-4">
                {book.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(book.created_at)}</span>
                </div>
                
                {book.created_by_name && (
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>{book.created_by_name}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-brand-navy mb-3">
                  Descripción
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {book.description || 'No hay descripción disponible para este libro.'}
                </p>
              </div>

              {/* Available Formats */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-brand-navy mb-3">
                  Formatos Disponibles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {book.file_url && (
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      PDF {!isAuthenticated && '🔒'}
                    </span>
                  )}
                  {book.audio_url && (
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      Audio {!isAuthenticated && '🔒'}
                    </span>
                  )}
                  {book.video_url && (
                    <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      Video {!isAuthenticated && '🔒'}
                    </span>
                  )}
                </div>
              </div>

              {/* Additional Actions */}
              <div className="flex items-center space-x-4 pt-6 border-t border-gray-100">
                <Button
                  variant="ghost"
                  icon={Heart}
                  className="text-gray-600 hover:text-red-500"
                  disabled={!isAuthenticated}
                >
                  Me Gusta
                </Button>
                <Button
                  variant="ghost"
                  icon={Eye}
                  className="text-gray-600"
                >
                  {book.downloads + book.plays} vistas
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};