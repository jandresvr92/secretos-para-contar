import React from 'react';
import { Download, Play, Eye, Calendar, User, Lock } from 'lucide-react';
import { Button } from '../UI/Button';

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

interface BookCardProps {
  book: Book;
  onView: (book: Book) => void;
  onDownload?: (book: Book) => void;
  onPlayAudio?: (book: Book) => void;
  onPlayVideo?: (book: Book) => void;
  isAuthenticated?: boolean;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onView,
  onDownload,
  onPlayAudio,
  onPlayVideo,
  isAuthenticated = false
}) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleActionClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      // Show login required message or redirect to login
      return;
    }
    action();
  };

  return (
    <div className="card group hover:scale-105 transition-all duration-300 overflow-hidden">
      {/* Cover Image */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={book.cover_image || 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg'}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg';
          }}
        />
        
        {/* Overlay with actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
            {book.file_url && (
              <Button
                size="sm"
                variant={isAuthenticated ? "primary" : "outline"}
                icon={isAuthenticated ? Download : Lock}
                onClick={(e) => handleActionClick(e, () => onDownload?.(book))}
                className="text-xs"
                disabled={!isAuthenticated}
              >
                {isAuthenticated ? 'PDF' : 'Login'}
              </Button>
            )}
            
            {book.audio_url && (
              <Button
                size="sm"
                variant={isAuthenticated ? "secondary" : "outline"}
                icon={isAuthenticated ? Play : Lock}
                onClick={(e) => handleActionClick(e, () => onPlayAudio?.(book))}
                className="text-xs"
                disabled={!isAuthenticated}
              >
                {isAuthenticated ? 'Audio' : 'Login'}
              </Button>
            )}
            
            {book.video_url && (
              <Button
                size="sm"
                variant="outline"
                icon={isAuthenticated ? Play : Lock}
                onClick={(e) => handleActionClick(e, () => onPlayVideo?.(book))}
                className="text-xs bg-white/90 backdrop-blur-sm"
                disabled={!isAuthenticated}
              >
                {isAuthenticated ? 'Video' : 'Login'}
              </Button>
            )}
          </div>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-brand-orange text-white px-3 py-1 rounded-full text-xs font-medium shadow-md">
            {book.category}
          </span>
        </div>

        {/* Authentication Required Badge */}
        {!isAuthenticated && (
          <div className="absolute top-3 right-3">
            <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium shadow-md flex items-center space-x-1">
              <Lock className="w-3 h-3" />
              <span>Login Requerido</span>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-serif font-semibold text-lg text-brand-navy mb-2 line-clamp-2 group-hover:text-brand-orange transition-colors">
          {book.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {book.description}
        </p>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-1">
            <Calendar className="w-3 h-3" />
            <span>{formatDate(book.created_at)}</span>
          </div>
          
          {book.created_by_name && (
            <div className="flex items-center space-x-1">
              <User className="w-3 h-3" />
              <span>{book.created_by_name}</span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Download className="w-3 h-3" />
              <span>{book.downloads || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Play className="w-3 h-3" />
              <span>{book.plays || 0}</span>
            </div>
          </div>
        </div>

        {/* Authentication Warning */}
        {!isAuthenticated && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <Lock className="w-4 h-4 text-yellow-600" />
              <p className="text-xs text-yellow-700">
                Inicia sesión para acceder al contenido
              </p>
            </div>
          </div>
        )}

        {/* View Button */}
        <Button
          variant="outline"
          size="sm"
          icon={Eye}
          onClick={() => onView(book)}
          fullWidth
          className="group-hover:bg-brand-orange group-hover:text-white group-hover:border-brand-orange"
        >
          Ver Detalles
        </Button>
      </div>
    </div>
  );
};