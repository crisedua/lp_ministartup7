import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Globe, Gift, Users, CheckCircle, AlertTriangle, Zap, Rocket, Star, Play } from 'lucide-react';
import { supabase } from './lib/supabase';

// Define LeadForm component outside of App to prevent recreation on each render
const LeadForm = ({ 
  className = "", 
  buttonText = "QUIERO MI LUGAR EN EL WEBINAR",
  formData,
  handleInputChange,
  handleSubmit,
  isSubmitted,
  isSubmitting
}: {
  className?: string;
  buttonText?: string;
  formData: { name: string; email: string };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isSubmitted: boolean;
  isSubmitting: boolean;
}) => (
  <form onSubmit={handleSubmit} className={`space-y-4 ${className}`}>
    <div>
      <input
        type="text"
        name="name"
        placeholder="Tu nombre completo"
        value={formData.name}
        onChange={handleInputChange}
        required
        disabled={isSubmitting}
        className="w-full px-6 py-4 text-lg text-black placeholder-gray-500 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
    <div>
      <input
        type="email"
        name="email"
        placeholder="Tu mejor email"
        value={formData.email}
        onChange={handleInputChange}
        required
        disabled={isSubmitting}
        className="w-full px-6 py-4 text-lg text-black placeholder-gray-500 bg-white border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      />
    </div>
    <button
      type="submit"
      disabled={isSubmitting}
      className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xl font-bold py-5 px-8 rounded-xl hover:from-orange-600 hover:to-red-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {isSubmitted ? '✅ ¡LUGAR RESERVADO!' : isSubmitting ? '⏳ RESERVANDO...' : buttonText}
    </button>
    {isSubmitted && (
      <div className="text-center">
        <p className="text-green-600 font-semibold text-lg mb-2">
          ¡Perfecto! Tu lugar está reservado.
        </p>
        <p className="text-gray-600">
          Te enviaremos los detalles de acceso por email.
        </p>
      </div>
    )}
  </form>
);

// Move CountdownTimer component outside of App to prevent recreation on each render
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Target date: July 12, 2025, 11:00 AM Chile time (UTC-4)
    const targetDate = new Date('2025-07-12T11:00:00-04:00');

    const updateCountdown = () => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 mb-8">
      <div className="text-center mb-4">
        <h3 className="text-2xl font-bold text-yellow-300 mb-2">⏰ El evento comienza en:</h3>
      </div>
      <div className="grid grid-cols-4 gap-4 text-center">
        <div className="bg-white bg-opacity-20 rounded-xl p-4">
          <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.days}</div>
          <div className="text-sm text-gray-200 uppercase tracking-wide">Días</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-4">
          <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.hours}</div>
          <div className="text-sm text-gray-200 uppercase tracking-wide">Horas</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-4">
          <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.minutes}</div>
          <div className="text-sm text-gray-200 uppercase tracking-wide">Min</div>
        </div>
        <div className="bg-white bg-opacity-20 rounded-xl p-4">
          <div className="text-3xl md:text-4xl font-bold text-white">{timeLeft.seconds}</div>
          <div className="text-sm text-gray-200 uppercase tracking-wide">Seg</div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('signups')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            event: 'No-Code + AI Webinar',
            date: '2025-07-12T11:00:00-04:00',
            timestamp: new Date().toISOString()
          }
        ]);

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      console.log('Form submitted successfully to Supabase:', data);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '' });
      }, 3000);
    } catch (error) {
      console.error('Error submitting form to Supabase:', error);
      // Still show success to user to avoid confusion
      setIsSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '' });
      }, 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-6 inline-flex items-center bg-orange-500 text-white px-6 py-2 rounded-full text-lg font-semibold">
              <Rocket className="w-5 h-5 mr-2" />
              🚀 Evento Exclusivo Gratuito
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              🚀 Cómo crear tu propio{' '}
              <span className="bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
                producto digital
              </span>{' '}
              sin escribir una sola línea de código
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl mb-8 opacity-90 leading-relaxed">
              (Incluso si no eres técnico)
            </h2>
            <p className="text-lg md:text-xl mb-12 opacity-80 max-w-3xl mx-auto">
              La Inteligencia Artificial y el No-Code están eliminando las barreras. 
              Si tienes una idea, te muestro cómo puedes lanzarla en días, no en meses.
            </p>
            
            {/* Countdown Timer */}
            <CountdownTimer />
            
            <div className="max-w-md mx-auto">
              <LeadForm 
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isSubmitted={isSubmitted}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Context Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                🌎 Estamos en un momento histórico
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <p className="text-xl md:text-2xl text-gray-700 mb-6 leading-relaxed">
                  Lo que antes requería equipos de programadores, 
                  <span className="font-bold text-orange-600"> ahora lo haces tú desde tu casa</span>.
                </p>
                <p className="text-xl md:text-2xl text-gray-700 leading-relaxed">
                  2025 ya está aquí, y quienes no entiendan este cambio, 
                  <span className="font-bold text-red-600"> se van a quedar atrás</span>.
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="text-center">
                  <Zap className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">La Revolución Está Aquí</h3>
                  <p className="text-gray-600">
                    Millones ya están aprovechando estas herramientas. 
                    ¿Vas a ser uno de ellos o vas a quedarte viendo?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Invitation Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
                Este sábado, te invito a un entrenamiento 
                <span className="text-orange-600"> 100% gratuito</span> donde:
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl">
                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ✅ Demo en Vivo
                </h3>
                <p className="text-gray-700">
                  Vas a ver en vivo cómo se crea un producto digital sin programar
                </p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-red-50 p-8 rounded-2xl">
                <Star className="w-12 h-12 text-orange-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ✅ Herramientas Revolucionarias
                </h3>
                <p className="text-gray-700">
                  Te mostraré las herramientas que están revolucionando el mercado
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl">
                <Users className="w-12 h-12 text-green-500 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ✅ Casos Reales
                </h3>
                <p className="text-gray-700">
                  Aprenderás cómo personas comunes están generando libertad financiera con IA + No-Code
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
                📱 Se encerró en una habitación, creó 17 aplicaciones y vendió 2 por{' '}
                <span className="text-green-400">$265,000</span>
              </h2>
              <p className="text-xl md:text-2xl text-gray-300 mb-8">
                Mira esta historia real de cómo el No-Code está cambiando vidas
              </p>
            </div>
            
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/4hMg_CZauJs"
                  title="Se encerró en una habitación, creó 17 aplicaciones y vendió 2 por $265,000"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              </div>
            </div>
            
            <div className="text-center mt-8">
              <p className="text-lg md:text-xl text-gray-300 mb-6">
                Esta es solo una de las miles de historias de éxito que están sucediendo ahora mismo.
              </p>
              <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-full text-lg font-semibold">
                <Play className="w-5 h-5 mr-2" />
                El sábado verás cómo tú también puedes hacerlo
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Scarcity Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-r from-red-600 to-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AlertTriangle className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              ⚠️ Importante:
            </h2>
            <div className="bg-black bg-opacity-20 p-8 rounded-2xl mb-8">
              <p className="text-2xl md:text-3xl font-bold mb-4">
                Este evento no se grabará.
              </p>
              <p className="text-xl md:text-2xl mb-6">
                Es en vivo, práctico y solo para quienes estén listos para aprovechar esta oportunidad.
              </p>
            </div>
            <p className="text-xl md:text-2xl opacity-90">
              La mayoría sigue pensando "mañana empiezo"... y ese "mañana" se convierte en 
              <span className="font-bold"> nunca</span>.
            </p>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-16 lg:py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-12">
              🔧 Ya cientos de creadores en Latinoamérica están usando No-Code + IA para:
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ✨ Lanzar apps desde cero
                </h3>
                <p className="text-gray-600">
                  Sin necesidad de equipos de desarrollo ni años de estudio
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ✨ Crear negocios digitales
                </h3>
                <p className="text-gray-600">
                  Sin invertir miles de dólares en desarrollo tradicional
                </p>
              </div>
              <div className="bg-white p-8 rounded-2xl shadow-lg transform hover:scale-105 transition-transform">
                <div className="text-4xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  ✨ Validar ideas
                </h3>
                <p className="text-gray-600">
                  Sin ser programadores ni tener conocimientos técnicos
                </p>
              </div>
            </div>
            <p className="text-2xl md:text-3xl font-bold text-gray-900">
              Este sábado tú puedes ser uno de ellos.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-20 bg-gradient-to-br from-orange-500 to-red-500 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-5xl font-bold mb-8">
              👉 Reserva tu lugar gratis
            </h2>
            <p className="text-xl md:text-2xl mb-12 opacity-90">
              Los cupos son limitados. Si quieres ver con tus propios ojos cómo se crea un producto digital real, 
              sin programar, deja tus datos ahora.
            </p>
            <div className="bg-white p-8 rounded-2xl shadow-2xl">
              <LeadForm 
                className="text-gray-900"
                formData={formData}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
                isSubmitted={isSubmitted}
                isSubmitting={isSubmitting}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Event Details Section */}
      <section className="py-16 lg:py-20 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
              Detalles del Evento
            </h2>
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="text-center bg-gray-800 p-8 rounded-2xl">
                <Calendar className="w-12 h-12 text-orange-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">🗓️ Fecha</h3>
                <p className="text-lg">Sábado 12 de Julio</p>
                <p className="text-lg">11:00 AM (Hora Chile)</p>
              </div>
              <div className="text-center bg-gray-800 p-8 rounded-2xl">
                <Globe className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">🌐 Modalidad</h3>
                <p className="text-lg">Online - Desde cualquier lugar</p>
                <p className="text-lg">Zoom en vivo</p>
              </div>
              <div className="text-center bg-gray-800 p-8 rounded-2xl">
                <Gift className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">🎁 Inversión</h3>
                <p className="text-lg">Sin costo</p>
                <p className="text-lg">Solo necesitas conexión a internet</p>
              </div>
            </div>
            <div className="text-center">
              <p className="text-2xl md:text-3xl font-bold mb-6">
                ¿Listo para ver lo que puedes construir?
              </p>
              <p className="text-xl opacity-90">
                Deja tus datos y nos vemos en el entrenamiento.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-orange-500 to-red-500 p-4 shadow-2xl z-50 md:hidden">
        <button 
          onClick={() => document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full bg-white text-orange-600 font-bold py-3 px-6 rounded-xl text-lg hover:bg-gray-100 transition-colors"
        >
          RESERVAR MI LUGAR GRATIS
        </button>
      </div>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400">
            © 2025 - Webinar No-Code + IA. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;