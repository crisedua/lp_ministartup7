import React, { useState } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { supabase } from './lib/supabase';

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
    
    // Track form submission start
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead');
    }
    
    try {
      const { data, error } = await supabase
        .from('signups')
        .insert([
          {
            name: formData.name,
            email: formData.email,
            event: 'Webinar MVP - Eduardo Escalante',
            date: '2024-08-19T11:00:00-04:00',
            timestamp: new Date().toISOString()
          }
        ]);

      if (error) {
        throw error;
      }

      setIsSubmitted(true);
      
      // Track successful registration
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'CompleteRegistration', {
          content_name: 'Webinar MVP Registration',
          status: 'success'
        });
      }
      
      // Reset form after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '' });
      }, 5000);
    } catch (error: any) {
      console.error('Error submitting form:', error);
      setIsSubmitted(true);
      
      setTimeout(() => {
        setIsSubmitted(false);
        setFormData({ name: '', email: '' });
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with gradient and business people silhouettes effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-purple-900 to-purple-950"></div>
      
      {/* Decorative background pattern to simulate business people silhouettes */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full opacity-10"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white rounded-full opacity-10"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-white rounded-full opacity-10"></div>
        <div className="absolute bottom-40 right-16 w-18 h-18 bg-white rounded-full opacity-10"></div>
        <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-white rounded-full opacity-10"></div>
        <div className="absolute top-2/3 right-1/3 w-14 h-14 bg-white rounded-full opacity-10"></div>
      </div>

      {/* Orange ribbon */}
      <div className="absolute top-0 right-0 transform rotate-45 translate-x-20 -translate-y-10">
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-16 py-3 shadow-lg">
          <span className="font-bold text-sm">Evento 100% Online - Cupos limitados</span>
        </div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-12 min-h-screen flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Main headline */}
          <div className="mb-12">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-tight mb-6">
              ¿Sigues <span className="font-normal">postergando</span>
            </h1>
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold text-orange-500 leading-tight mb-6">
              tu idea
            </h2>
            <h3 className="text-5xl md:text-7xl lg:text-8xl font-light text-white leading-tight">
              de negocio?
            </h3>
          </div>

          {/* Subtitle */}
          <div className="mb-12">
            <p className="text-xl md:text-2xl lg:text-3xl text-white mb-2">
              Te invito a este <span className="font-bold">webinar gratuito</span>
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl text-white mb-2">
              donde te muestro <span className="font-bold">cómo crear tu MVP</span>
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl text-white mb-2">
              y empezar a vender en solo 4 semanas,
            </p>
            <p className="text-xl md:text-2xl lg:text-3xl text-white font-bold">
              sin ser programador y sin gastar una fortuna.
            </p>
          </div>

          {/* CTA Button */}
          <div className="mb-12">
            <button 
              onClick={() => {
                // Track CTA button click
                if (typeof window !== 'undefined' && (window as any).fbq) {
                  (window as any).fbq('track', 'InitiateCheckout', {
                    content_name: 'Main CTA Button',
                    content_category: 'Registration'
                  });
                }
                document.getElementById('registration-form')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xl md:text-2xl font-bold py-4 px-12 rounded-full transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-orange-500/25"
            >
              RESERVA TU LUGAR AHORA
            </button>
          </div>

          {/* Event details */}
          <div className="grid md:grid-cols-3 gap-6 text-white text-lg">
            <div className="flex items-center justify-center space-x-3">
              <Calendar className="w-6 h-6 text-orange-500" />
              <span className="font-bold">Sábado 19 de agosto</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-6 h-6 text-orange-500" />
                <span>11:00 AM Chile, Argentina, Uruguay</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-6 h-6 text-orange-500" />
                <span>10:00 AM Perú, Colombia, Ecuador, Bolivia</span>
              </div>
              <div className="flex items-center justify-center space-x-3">
                <Clock className="w-6 h-6 text-orange-500" />
                <span>9:00 AM México</span>
              </div>
            </div>
          </div>
        </div>
             </div>

       {/* Video Section */}
       <section className="relative z-10 bg-gray-900 py-16">
         <div className="container mx-auto px-4 max-w-5xl">
           <div className="text-center mb-12">
             <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
               📱 Mira esta historia real sobre{' '}
               <span className="text-orange-500">crear productos digitales</span>
             </h2>
             <p className="text-xl md:text-2xl text-gray-300 mb-8">
               Descubre cómo el No-Code está transformando la manera de crear negocios
             </p>
           </div>
           
                       <div 
              className="relative bg-black rounded-2xl overflow-hidden shadow-2xl cursor-pointer"
              onClick={() => {
                // Track video engagement
                if (typeof window !== 'undefined' && (window as any).fbq) {
                  (window as any).fbq('track', 'ViewContent', {
                    content_name: 'Webinar Preview Video',
                    content_type: 'video'
                  });
                }
              }}
            >
              <div className="aspect-video">
                <iframe
                  src="https://www.youtube.com/embed/yK6NY7Jkg8s"
                  title="Video sobre crear productos digitales"
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
             <div className="inline-flex items-center bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full text-lg font-semibold">
               ▶️ En el webinar verás cómo tú también puedes hacerlo
             </div>
           </div>
         </div>
       </section>

       {/* Registration Form Section */}
       <section id="registration-form" className="relative z-10 bg-white py-16">
        <div className="container mx-auto px-4 max-w-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Reserva tu lugar ahora
            </h2>
            <p className="text-xl text-gray-600">
              Es 100% gratuito y solo tomará 30 segundos
            </p>
          </div>

          {isSubmitted ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-8 text-center">
              <div className="text-green-600 text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-800 mb-2">
                ¡Lugar reservado exitosamente!
              </h3>
              <p className="text-green-700 text-lg">
                Te enviaremos todos los detalles de acceso por email.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Tu nombre completo"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  disabled={isSubmitting}
                  className="w-full px-6 py-4 text-lg text-gray-800 placeholder-gray-500 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:bg-white focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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
                  className="w-full px-6 py-4 text-lg text-gray-800 placeholder-gray-500 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:bg-white focus:outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-xl font-bold py-5 px-8 rounded-xl transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? '⏳ RESERVANDO TU LUGAR...' : 'RESERVA TU LUGAR AHORA'}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>🔒 Tus datos están seguros. No compartimos tu información.</p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;