import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../hooks/useToast';
import axios from 'axios';

const AddApp: React.FC = () => {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { t } = useLanguage();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url) {
      toast({
        title: t('errors.invalidInput'),
        description: t('addApp.urlRequired'),
        variant: 'destructive'
      });
      return;
    }
    
    // Validar que la URL sea de Google Play
    if (!url.includes('play.google.com')) {
      toast({
        title: t('errors.invalidInput'),
        description: t('addApp.mustBeGooglePlay'),
        variant: 'destructive'
      });
      return;
    }
    
    setIsLoading(true);
    setResult(null);
    
    try {
      // Llamar al endpoint que procesará la URL (necesitamos crear este endpoint)
      const response = await axios.post('/api/apps/add-from-playstore', { url });
      
      setResult({
        success: true,
        message: response.data.message || t('addApp.appAddedSuccess')
      });
      
      toast({
        title: t('success'),
        description: t('addApp.appAddedSuccess'),
        variant: 'default'
      });
      
      // Limpiar la URL después de un éxito
      setUrl('');
    } catch (error: any) {
      console.error('Error adding app:', error);
      
      setResult({
        success: false,
        message: error.response?.data?.message || t('errors.unknownError')
      });
      
      toast({
        title: t('errors.failed'),
        description: error.response?.data?.message || t('errors.unknownError'),
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">{t('addApp.title')}</h1>
        
        <p className="mb-4 text-gray-600">
          {t('addApp.description')}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="playstore-url" className="block text-sm font-medium text-gray-700 mb-1">
              {t('addApp.googlePlayUrl')}
            </label>
            <input
              type="url"
              id="playstore-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://play.google.com/store/apps/details?id=com.example.app"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              disabled={isLoading}
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2 px-4 bg-primary text-white font-medium rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t('loading') : t('addApp.addApp')}
          </button>
        </form>
        
        {result && (
          <div className={`mt-4 p-3 rounded-md ${result.success ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {result.message}
          </div>
        )}
        
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2">{t('addApp.instructions')}</h2>
          <ol className="list-decimal pl-5 space-y-2 text-gray-700">
            <li>{t('addApp.step1')}</li>
            <li>{t('addApp.step2')}</li>
            <li>{t('addApp.step3')}</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default AddApp;