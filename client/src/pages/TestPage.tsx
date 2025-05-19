import React from 'react';
import { Link } from "wouter";

const TestPage = () => {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 my-8">
      <h1 className="text-3xl font-bold mb-6">Página de Prueba</h1>
      
      <div className="prose max-w-none">
        <p>Esta es una página de prueba para verificar el enrutamiento.</p>
        
        <h2>Enlaces a las páginas legales:</h2>
        <ul className="mt-4 space-y-2">
          <li>
            <Link href="/terms-of-service">
              <a className="text-blue-600 hover:underline">Términos de Servicio</a>
            </Link>
          </li>
          <li>
            <Link href="/privacy-policy">
              <a className="text-blue-600 hover:underline">Política de Privacidad</a>
            </Link>
          </li>
          <li>
            <Link href="/disclaimer">
              <a className="text-blue-600 hover:underline">Disclaimer</a>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default TestPage;