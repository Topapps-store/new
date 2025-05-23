import React, { useEffect } from 'react';

/**
 * Componente especial para SEO de la página de Uber
 * Inserta meta tags y contenido optimizado específicamente para Uber
 */
const UberAppSEO: React.FC = () => {
  // Modificar el título y las meta tags de la página al montar el componente
  useEffect(() => {
    // Guardar el título original para restaurarlo al desmontar
    const originalTitle = document.title;
    
    // Establecer nuevo título
    document.title = "Download Uber App – Request a Ride Today | TopApps Store";
    
    // Crear o actualizar meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', 'Get the Uber ride app for Android or iPhone. Download now and request safe, fast rides.');
    
    // Limpiar al desmontar
    return () => {
      document.title = originalTitle;
      metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', '');
      }
    };
  }, []);

  return (
    <div className="my-5">
      <h1 className="text-3xl font-bold text-center mb-3">
        Download the Uber App – Fast & Easy Rides at Your Fingertips
      </h1>
      
      <h2 className="text-xl text-center mb-6 text-gray-700">
        Get the official Uber ride app for Android and iPhone. Request your ride in seconds.
      </h2>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-5">
        <p className="text-lg mb-3">
          The Uber mobile app makes getting around easy and reliable.
        </p>
        <p className="mb-3">
          Whether you're on Android or iPhone, install the Uber app and start riding today.
        </p>
        <p className="mb-3">
          Get the Uber ride app now and enjoy safe, fast, and affordable transportation.
        </p>
        <p className="mb-3">
          Download Uber today to book a ride anytime, anywhere.
        </p>
        <p>
          Uber download is simple. Just tap, install, and ride.
        </p>
      </div>
      
      {/* Keywords ocultos para SEO pero visibles para lectores de pantalla */}
      <div className="sr-only">
        <p>Uber App</p>
        <p>Download Uber App</p>
        <p>Uber Ride App</p>
        <p>Install Uber App</p>
        <p>Get Uber App for Android</p>
        <p>Get Uber App for iPhone</p>
        <p>Uber Mobile App</p>
        <p>Request a Ride with Uber</p>
        <p>Uber Download</p>
        <p>Fast, Safe, and Easy Rides</p>
      </div>
    </div>
  );
};

export default UberAppSEO;