import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { LoginForm } from '../components/Auth/LoginForm';
import { RegisterForm } from '../components/Auth/RegisterForm';
import { useAuthStore } from '../store/authStore';

export const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, login, register, isLoading, error } = useAuthStore();

  // Redirect if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (email: string, password: string) => {
    await login(email, password);
  };

  const handleRegister = async (name: string, email: string, password: string, role?: string) => {
    await register(name, email, password, role);
  };

  if (isLogin) {
    return (
      <LoginForm
        onLogin={handleLogin}
        onSwitchToRegister={() => setIsLogin(false)}
        loading={isLoading}
      />
    );
  }

  return (
    <RegisterForm
      onRegister={handleRegister}
      onSwitchToLogin={() => setIsLogin(true)}
      loading={isLoading}
    />
  );
};