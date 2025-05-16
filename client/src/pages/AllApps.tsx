import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation } from 'wouter';
import { useLanguage } from '../context/StaticLanguageContext';
import AppCard from '../components/AppCard';
import { getAllApps } from '../services/staticDataService';

const AllApps: React.FC = () => {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  // Obtener todas las apps
  const { data: apps, isLoading } = useQuery({
    queryKey: ['/api/apps/all'],
    queryFn: () => getAllApps(),
  });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('apps.allApps')}</h1>
          <p className="text-gray-600">{t('apps.discoverAllApps')}</p>
        </div>
        <button 
          onClick={() => setLocation('/')}
          className="mt-4 md:mt-0 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <i className="fas fa-arrow-left mr-2"></i>
          {t('back')}
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg shadow-md p-4 h-48 animate-pulse">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="flex space-x-1">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="w-3 h-3 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {apps?.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>

          {apps && apps.length === 0 && (
            <div className="text-center py-10">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">{t('apps.noAppsFound')}</h3>
              <p className="text-gray-600">{t('apps.tryDifferentSearch')}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AllApps;