import React, { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Heart, CreditCard, Users, BookOpen, Target, Check } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { toast } from '../store/toastStore';

export const Donate: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [selectedAmount, setSelectedAmount] = useState(25);
  const [donationType, setDonationType] = useState<'once' | 'monthly'>('once');
  const [customAmount, setCustomAmount] = useState('');

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
  };

  const predefinedAmounts = [10, 25, 50, 100];

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (value: string) => {
    setCustomAmount(value);
    setSelectedAmount(0);
  };

  const getFinalAmount = () => {
    return customAmount ? parseFloat(customAmount) : selectedAmount;
  };

  const handleDonate = () => {
    const amount = getFinalAmount();
    
    if (amount <= 0) {
      toast.warning(
        'Monto inválido',
        'Por favor selecciona o ingresa un monto válido para donar.'
      );
      return;
    }

    if (amount < 1) {
      toast.warning(
        'Monto mínimo',
        'El monto mínimo de donación es $1.00'
      );
      return;
    }

    // Simulate donation process
    toast.success(
      '¡Gracias por tu donación!',
      `Tu donación de $${amount.toFixed(2)} ${donationType === 'monthly' ? 'mensual ' : ''}ha sido procesada exitosamente. Recibirás un recibo por email.`,
      {
        duration: 8000,
        action: {
          label: 'Ver Recibo',
          onClick: () => toast.info('Recibo', 'El recibo será enviado a tu email en los próximos minutos.')
        }
      }
    );

    // Reset form
    setSelectedAmount(25);
    setCustomAmount('');
    setDonationType('once');
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
            <Heart className="w-16 h-16 text-brand-orange mx-auto mb-6 animate-float" />
            <h1 className="text-4xl lg:text-6xl font-bold font-serif text-brand-navy mb-6">
              Ayúdanos a Crecer
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              Tu apoyo nos permite mantener nuestra biblioteca gratuita y seguir 
              llevando educación de calidad a más familias cada día.
            </p>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="section-padding">
        <div className="container-brand">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-brand-navy mb-6">
              Tu Impacto
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Cada donación hace una diferencia real en la vida de niños y familias.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-navy mb-2">$10</h3>
              <p className="text-gray-600">
                Proporciona acceso a 5 libros digitales para una familia durante un mes
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-navy mb-2">$25</h3>
              <p className="text-gray-600">
                Financia el hosting y mantenimiento de la plataforma por una semana
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-navy mb-2">$50</h3>
              <p className="text-gray-600">
                Permite la creación y digitalización de nuevo contenido educativo
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-brand-navy mb-2">$100</h3>
              <p className="text-gray-600">
                Apoya el desarrollo de nuevas funcionalidades y mejoras
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Donation Form */}
      <section className="section-padding bg-gray-50">
        <div className="container-brand">
          <div className="max-w-2xl mx-auto">
            <div className="card p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold font-serif text-brand-navy mb-4">
                  Hacer una Donación
                </h2>
                <p className="text-gray-600">
                  Elige el monto que deseas donar y ayúdanos a seguir creciendo.
                </p>
              </div>

              {/* Donation Type */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-brand-navy mb-4">Tipo de Donación</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDonationType('once')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      donationType === 'once'
                        ? 'border-brand-orange bg-orange-50 text-brand-orange'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">Una vez</div>
                    <div className="text-sm text-gray-600">Donación única</div>
                  </button>
                  
                  <button
                    onClick={() => setDonationType('monthly')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      donationType === 'monthly'
                        ? 'border-brand-orange bg-orange-50 text-brand-orange'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold">Mensual</div>
                    <div className="text-sm text-gray-600">Apoyo continuo</div>
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-brand-navy mb-4">Monto</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {predefinedAmounts.map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleAmountSelect(amount)}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        selectedAmount === amount && !customAmount
                          ? 'border-brand-orange bg-orange-50 text-brand-orange'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-bold text-lg">${amount}</div>
                    </button>
                  ))}
                </div>
                
                <div>
                  <label htmlFor="customAmount" className="block text-sm font-medium text-brand-navy mb-2">
                    Monto personalizado
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      id="customAmount"
                      type="number"
                      min="1"
                      step="0.01"
                      value={customAmount}
                      onChange={(e) => handleCustomAmountChange(e.target.value)}
                      className="input-field pl-8"
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>

              {/* Benefits for Monthly Donors */}
              {donationType === 'monthly' && (
                <div className="mb-8 p-6 bg-brand-orange/10 rounded-xl">
                  <h4 className="font-semibold text-brand-navy mb-3">
                    Beneficios para Donantes Mensuales
                  </h4>
                  <ul className="space-y-2">
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-brand-orange" />
                      <span className="text-sm text-gray-700">Acceso anticipado a nuevo contenido</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-brand-orange" />
                      <span className="text-sm text-gray-700">Boletín exclusivo con estadísticas de impacto</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-brand-orange" />
                      <span className="text-sm text-gray-700">Reconocimiento especial en nuestra comunidad</span>
                    </li>
                  </ul>
                </div>
              )}

              {/* Summary */}
              <div className="mb-8 p-6 bg-gray-50 rounded-xl">
                <h4 className="font-semibold text-brand-navy mb-2">Resumen de Donación</h4>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Donación {donationType === 'monthly' ? 'mensual' : 'única'}:
                  </span>
                  <span className="text-2xl font-bold text-brand-navy">
                    ${getFinalAmount().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Donate Button */}
              <Button
                variant="primary"
                size="lg"
                icon={CreditCard}
                onClick={handleDonate}
                fullWidth
                disabled={getFinalAmount() <= 0}
              >
                Donar ${getFinalAmount().toFixed(2)} {donationType === 'monthly' ? 'Mensualmente' : 'Ahora'}
              </Button>

              <p className="text-xs text-gray-500 text-center mt-4">
                Todas las donaciones son seguras y están protegidas por encriptación SSL.
                Recibirás un recibo por email para efectos fiscales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-padding">
        <div className="container-brand">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-brand-navy mb-6">
              Lo que Dicen Nuestros Donantes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">MG</span>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-navy">María González</h4>
                  <p className="text-sm text-gray-500">Madre de familia</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Gracias a esta plataforma, mis hijos tienen acceso a libros que 
                nunca podríamos permitirnos. Es una bendición para nuestra familia."
              </p>
            </div>

            <div className="card p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-navy rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">JR</span>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-navy">José Ramírez</h4>
                  <p className="text-sm text-gray-500">Maestro</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Como educador, veo el impacto directo de esta biblioteca en mis 
                estudiantes. Donar es mi forma de multiplicar ese impacto."
              </p>
            </div>

            <div className="card p-8">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-brand-orange rounded-full flex items-center justify-center mr-4">
                  <span className="text-white font-bold">LS</span>
                </div>
                <div>
                  <h4 className="font-semibold text-brand-navy">Laura Silva</h4>
                  <p className="text-sm text-gray-500">Donante mensual</p>
                </div>
              </div>
              <p className="text-gray-600 italic">
                "Saber que mi donación mensual ayuda a mantener esta biblioteca 
                gratuita me llena de satisfacción. Es una inversión en el futuro."
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};