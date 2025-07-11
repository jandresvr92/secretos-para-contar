import React, { useState } from 'react';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageCircle, Clock } from 'lucide-react';
import { Button } from '../components/UI/Button';
import { toast } from '../store/toastStore';

export const Contact: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name.trim() || !formData.email.trim() || !formData.subject || !formData.message.trim()) {
      toast.warning(
        'Campos requeridos',
        'Por favor completa todos los campos del formulario.'
      );
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error(
        'Email inválido',
        'Por favor ingresa un email válido.'
      );
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success(
        '¡Mensaje enviado exitosamente!',
        `Gracias ${formData.name}, hemos recibido tu mensaje y te responderemos pronto.`
      );
      
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(
        'Error al enviar mensaje',
        'No se pudo enviar tu mensaje. Por favor intenta nuevamente.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />

      <section className="bg-gradient-to-br from-orange-50 via-white to-navy-50 section-padding">
        <div className="container-brand">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl lg:text-6xl font-bold font-serif text-brand-navy mb-6">
              Contáctanos
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              ¿Tienes preguntas, sugerencias o quieres colaborar con nosotros? 
              Nos encantaría escucharte.
            </p>
          </div>
        </div>
      </section>

      <section className="section-padding">
        <div className="container-brand">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-bold font-serif text-brand-navy mb-8">
                Información de Contacto
              </h2>
              
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-orange rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-navy mb-2">Email</h3>
                    <p className="text-gray-600 mb-1">info@secretosparacontar.org</p>
                    <p className="text-sm text-gray-500">Para consultas generales</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-navy mb-2">Teléfono</h3>
                    <p className="text-gray-600 mb-1">+57 (604) 3001010</p>
                    <p className="text-sm text-gray-500">Lunes a Viernes, 9AM - 5PM</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-orange rounded-xl flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-navy mb-2">Ubicación</h3>
                    <p className="text-gray-600 mb-1">Medellín, Colombia</p>
                    <p className="text-sm text-gray-500">Oficina principal</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-brand-navy rounded-xl flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-brand-navy mb-2">Horarios</h3>
                    <p className="text-gray-600 mb-1">Lunes - Viernes: 9:00 AM - 5:00 PM</p>
                    <p className="text-gray-600 mb-1">Sábados: 10:00 AM - 2:00 PM</p>
                    <p className="text-sm text-gray-500">Zona horaria: GMT-5</p>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="mt-12">
                <h3 className="text-2xl font-bold font-serif text-brand-navy mb-6">
                  Preguntas Frecuentes
                </h3>
                <div className="space-y-4">
                  <div className="card p-6">
                    <h4 className="font-semibold text-brand-navy mb-2">
                      ¿Es realmente gratuito el acceso a los libros?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Sí, todos nuestros recursos son completamente gratuitos. 
                      Nos financiamos a través de donaciones y patrocinios.
                    </p>
                  </div>
                  
                  <div className="card p-6">
                    <h4 className="font-semibold text-brand-navy mb-2">
                      ¿Cómo puedo contribuir con contenido?
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Si eres educador o creador de contenido, contáctanos para 
                      conocer nuestro proceso de colaboración.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <div className="card p-8">
                <h2 className="text-2xl font-bold font-serif text-brand-navy mb-6">
                  Envíanos un Mensaje
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-brand-navy mb-2">
                        Nombre Completo
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="input-field"
                        placeholder="Tu nombre"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-brand-navy mb-2">
                        Correo Electrónico
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="input-field"
                        placeholder="tu@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-brand-navy mb-2">
                      Asunto
                    </label>
                    <select
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => handleInputChange('subject', e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Selecciona un asunto</option>
                      <option value="general">Consulta General</option>
                      <option value="technical">Soporte Técnico</option>
                      <option value="content">Sugerencia de Contenido</option>
                      <option value="collaboration">Colaboración</option>
                      <option value="donation">Donaciones</option>
                      <option value="other">Otro</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-brand-navy mb-2">
                      Mensaje
                    </label>
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      rows={6}
                      className="input-field resize-none"
                      placeholder="Escribe tu mensaje aquí..."
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    icon={Send}
                    loading={isSubmitting}
                    fullWidth
                  >
                    Enviar Mensaje
                  </Button>
                </form>
              </div>

              {/* Additional Contact Options */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card p-6 text-center">
                  <MessageCircle className="w-8 h-8 text-brand-orange mx-auto mb-3" />
                  <h3 className="font-semibold text-brand-navy mb-2">Chat en Vivo</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Disponible de 9AM a 6PM
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                    onClick={() => toast.info('Chat en vivo', 'Esta función estará disponible próximamente.')}
                  >
                    Iniciar Chat
                  </Button>
                </div>

                <div className="card p-6 text-center">
                  <Phone className="w-8 h-8 text-brand-navy mx-auto mb-3" />
                  <h3 className="font-semibold text-brand-navy mb-2">Llamada</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Respuesta inmediata
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    fullWidth
                    onClick={() => toast.info('Llamada telefónica', 'Puedes llamarnos al +1 (555) 123-4567')}
                  >
                    Llamar Ahora
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};