import { create } from 'zustand';
import { toast } from './toastStore';

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

interface BookState {
  books: Book[];
  categories: string[];
  selectedBook: Book | null;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
  filters: {
    search: string;
    category: string;
  };
  
  // Actions
  fetchBooks: (params?: { search?: string; category?: string; limit?: number; offset?: number }) => Promise<void>;
  fetchBook: (id: number) => Promise<void>;
  fetchCategories: () => Promise<void>;
  recordInteraction: (bookId: number, interactionType: string, token?: string) => Promise<void>;
  setSelectedBook: (book: Book | null) => void;
  setFilters: (filters: Partial<{ search: string; category: string }>) => void;
  clearError: () => void;
}

//@ts-ignore
const API_URL = import.meta.env.API_URL || 'http://localhost:3001';

export const useBookStore = create<BookState>((set, get) => ({
  books: [],
  categories: [],
  selectedBook: null,
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
    hasMore: false,
  },
  filters: {
    search: '',
    category: 'Todos',
  },

  fetchBooks: async (params = {}) => {
    set({ isLoading: true, error: null });
    
    try {
      const { search, category, limit = 20, offset = 0 } = params;
      const queryParams = new URLSearchParams();
      
      if (search) queryParams.append('search', search);
      if (category && category !== 'Todos') queryParams.append('category', category);
      queryParams.append('limit', limit.toString());
      queryParams.append('offset', offset.toString());

      const response = await fetch(`${API_URL}/api/books?${queryParams}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error obteniendo libros');
      }

      set({
        books: offset === 0 ? data.books : [...get().books, ...data.books],
        pagination: data.pagination,
        isLoading: false,
        error: null,
      });

      // Show success message only for search/filter operations
      if (search || (category && category !== 'Todos')) {
        const resultCount = data.books.length;
        if (resultCount === 0) {
          toast.info(
            'Sin resultados',
            'No se encontraron libros con los criterios de búsqueda especificados.'
          );
        } else {
          toast.success(
            'Búsqueda completada',
            `Se encontraron ${resultCount} libro${resultCount !== 1 ? 's' : ''}.`
          );
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(
        'Error al cargar libros',
        'No se pudieron cargar los libros. Verifica tu conexión e intenta nuevamente.'
      );
    }
  },

  fetchBook: async (id: number) => {
    set({ isLoading: true, error: null });
    
    try {
      const response = await fetch(`${API_URL}/api/books/${id}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error obteniendo libro');
      }

      set({
        selectedBook: data.book,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      set({
        isLoading: false,
        error: errorMessage,
      });

      toast.error(
        'Error al cargar libro',
        'No se pudo cargar la información del libro.'
      );
    }
  },

  fetchCategories: async () => {
    try {
      const response = await fetch(`${API_URL}/api/books/meta/categories`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error obteniendo categorías');
      }

      const categoryNames = data.categories.map((cat: any) => cat.name);
      set({ categories: ['Todos', ...categoryNames] });
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(
        'Error al cargar categorías',
        'No se pudieron cargar las categorías de libros.'
      );
    }
  },

  recordInteraction: async (bookId: number, interactionType: string, token?: string) => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      } else {
        // If no token, user is not authenticated - don't record interaction
        return;
      }

      const response = await fetch(`${API_URL}/api/books/${bookId}/interact`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ interaction_type: interactionType }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Error registrando interacción');
      }

      // Update local book counters
      set(state => ({
        books: state.books.map(book => {
          if (book.id === bookId) {
            const updatedBook = { ...book };
            if (interactionType === 'download') {
              updatedBook.downloads += 1;
            } else if (interactionType === 'play_audio' || interactionType === 'play_video') {
              updatedBook.plays += 1;
            }
            return updatedBook;
          }
          return book;
        }),
        selectedBook: state.selectedBook?.id === bookId ? {
          ...state.selectedBook,
          downloads: interactionType === 'download' ? state.selectedBook.downloads + 1 : state.selectedBook.downloads,
          plays: (interactionType === 'play_audio' || interactionType === 'play_video') ? state.selectedBook.plays + 1 : state.selectedBook.plays,
        } : state.selectedBook,
      }));

      // Show appropriate success message
      const book = get().books.find(b => b.id === bookId);
      const bookTitle = book?.title || 'el libro';

      switch (interactionType) {
        case 'download':
          toast.success(
            'Descarga iniciada',
            `Se está descargando "${bookTitle}". El archivo se guardará en tu carpeta de descargas.`
          );
          break;
        case 'play_audio':
          toast.success(
            'Audio reproduciendo',
            `Se está reproduciendo el audio de "${bookTitle}".`
          );
          break;
        case 'play_video':
          toast.success(
            'Video reproduciendo',
            `Se está reproduciendo el video de "${bookTitle}".`
          );
          break;
        case 'view':
          // Don't show toast for view interactions to avoid spam
          break;
      }
    } catch (error) {
      console.error('Error recording interaction:', error);
      
      // Only show error toast for user-initiated actions (not views)
      if (interactionType !== 'view') {
        toast.error(
          'Error en la acción',
          'No se pudo completar la acción. Intenta nuevamente.'
        );
      }
    }
  },

  setSelectedBook: (book: Book | null) => {
    set({ selectedBook: book });
  },

  setFilters: (filters: Partial<{ search: string; category: string }>) => {
    set(state => ({
      filters: { ...state.filters, ...filters },
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));