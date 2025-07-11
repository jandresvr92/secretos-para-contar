import React from 'react';
import { Header } from '../components/Layout/Header';
import { Footer } from '../components/Layout/Footer';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { Heart, BookOpen, Users, Target, Award, Globe } from 'lucide-react';

export const About: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogin = () => {
    navigate('/login');
  };

  const handleLogout = () => {
    logout();
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
            <h1 className="text-4xl lg:text-6xl font-bold font-serif text-brand-navy mb-6">
              Sobre Nosotros
            </h1>
            <p className="text-xl lg:text-2xl text-gray-600 mb-8 leading-relaxed">
              Somos una organización dedicada a democratizar el acceso a la educación 
              y la literatura a través de nuestra biblioteca digital gratuita.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="section-padding">
        <div className="container-brand">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold font-serif text-brand-navy mb-6">
                Nuestra Misión
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                En Secretos Para Contar creemos que todos los niños y familias merecen 
                acceso a literatura de calidad y recursos educativos, sin importar su 
                situación económica o ubicación geográfica.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Trabajamos incansablemente para crear una biblioteca digital que inspire, 
                eduque y conecte a las familias a través del poder transformador de las historias.
              </p>
              <div className="flex items-center space-x-2 text-brand-orange">
                <Heart className="w-6 h-6" />
                <span className="font-semibold text-lg">Educación para todos</span>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg" 
                alt="Niños leyendo" 
                className="rounded-2xl shadow-soft-lg w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-brand">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-brand-navy mb-6">
              Nuestros Valores
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Los principios que guían nuestro trabajo y definen quiénes somos como organización.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Accesibilidad</h3>
              <p className="text-gray-600 leading-relaxed">
                Creemos que la educación debe ser accesible para todos, eliminando 
                barreras económicas y geográficas.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Comunidad</h3>
              <p className="text-gray-600 leading-relaxed">
                Fomentamos la conexión entre familias y educadores a través de 
                experiencias compartidas de lectura.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Calidad</h3>
              <p className="text-gray-600 leading-relaxed">
                Seleccionamos cuidadosamente contenido educativo de alta calidad 
                que inspire y enriquezca la experiencia de aprendizaje.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Excelencia</h3>
              <p className="text-gray-600 leading-relaxed">
                Nos comprometemos con la excelencia en todo lo que hacemos, 
                desde la tecnología hasta el servicio al usuario.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-orange rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Inclusión</h3>
              <p className="text-gray-600 leading-relaxed">
                Celebramos la diversidad y trabajamos para que nuestra biblioteca 
                refleje diferentes culturas y perspectivas.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-16 h-16 bg-brand-navy rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-4">Pasión</h3>
              <p className="text-gray-600 leading-relaxed">
                Nuestra pasión por la educación y la literatura impulsa cada 
                decisión y cada innovación en nuestra plataforma.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding">
        <div className="container-brand">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold font-serif text-brand-navy mb-6">
              Nuestro Equipo
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Un grupo diverso de educadores, tecnólogos y soñadores unidos por 
              la misión de transformar la educación.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-orange to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">MR</span>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">María Antonieta</h3>
              <p className="text-brand-orange font-medium mb-4">Directora Ejecutiva</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Educadora con 15 años de experiencia, apasionada por democratizar 
                el acceso a la educación de calidad.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-navy to-navy-800 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">CL</span>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Jhon Legasov</h3>
              <p className="text-brand-orange font-medium mb-4">Director de Tecnología</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Ingeniero de software especializado en plataformas educativas 
                y experiencia de usuario.
              </p>
            </div>

            <div className="card p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-brand-orange to-orange-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-2xl font-bold text-white">AG</span>
              </div>
              <h3 className="text-xl font-bold text-brand-navy mb-2">Martha Cecilia Rojas</h3>
              <p className="text-brand-orange font-medium mb-4">Coordinadora de Contenido</p>
              <p className="text-gray-600 text-sm leading-relaxed">
                Especialista en literatura infantil y desarrollo de contenido 
                educativo multicultural.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};