import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from './toastStore';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
}

//@ts-ignore
const API_URL = import.meta.env.API_URL || 'http://localhost:3001';

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Error en el inicio de sesión');
          }

          set({
            user: data.user,
            token: data.token,
            isLoading: false,
            error: null,
          });

          toast.success(
            '¡Bienvenido!',
            `Hola ${data.user.name}, has iniciado sesión correctamente.`
          );
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            isLoading: false,
            error: errorMessage,
          });

          toast.error(
            'Error al iniciar sesión',
            errorMessage === 'Credenciales inválidas' 
              ? 'Verifica tu email y contraseña e intenta nuevamente.'
              : errorMessage
          );
          throw error;
        }
      },

      register: async (name: string, email: string, password: string, role = 'student') => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await fetch(`${API_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password, role }),
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Error en el registro');
          }

          set({
            user: data.user,
            token: data.token,
            isLoading: false,
            error: null,
          });

          toast.success(
            '¡Cuenta creada exitosamente!',
            `Bienvenido ${data.user.name}. Tu cuenta ha sido creada y ya puedes explorar nuestra biblioteca.`
          );
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
          set({
            isLoading: false,
            error: errorMessage,
          });

          toast.error(
            'Error al crear cuenta',
            errorMessage === 'El usuario ya existe'
              ? 'Ya existe una cuenta con este email. Intenta iniciar sesión.'
              : errorMessage
          );
          throw error;
        }
      },

      logout: () => {
        const currentUser = get().user;
        set({
          user: null,
          token: null,
          error: null,
        });

        toast.info(
          'Sesión cerrada',
          `Hasta pronto${currentUser ? `, ${currentUser.name}` : ''}. ¡Esperamos verte pronto!`
        );
      },

      refreshToken: async () => {
        const { token } = get();
        
        if (!token) {
          throw new Error('No hay token para renovar');
        }

        try {
          const response = await fetch(`${API_URL}/api/auth/refresh`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          });

          const data = await response.json();

          if (!response.ok) {
            throw new Error(data.error || 'Error renovando token');
          }

          set({
            user: data.user,
            token: data.token,
            error: null,
          });

          toast.success(
            'Sesión renovada',
            'Tu sesión ha sido renovada automáticamente.'
          );
        } catch (error) {
          // If refresh fails, logout user
          set({
            user: null,
            token: null,
            error: null,
          });

          toast.warning(
            'Sesión expirada',
            'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
            {
              action: {
                label: 'Iniciar Sesión',
                onClick: () => window.location.href = '/login'
              }
            }
          );
          throw error;
        }
      },

      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);