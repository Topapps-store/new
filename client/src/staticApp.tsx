import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, Router } from 'wouter';
import Layout from './components/Layout';
import { LanguageProvider } from './context/StaticLanguageContext';
import Home from './pages/Home';
import AppDetail from './pages/AppDetail';
import CategoryPage from './pages/Category';
import SearchResults from './pages/Search';
import AllApps from './pages/AllApps';
import { Toaster } from './components/ui/toaster';
// Vamos a simplificar por ahora y no usar el tema 

// Crear cliente de consulta para React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

/**
 * Aplicación estática principal
 * Esta versión utiliza datos locales sin conexión a base de datos
 */
const StaticApp = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <Router>
          <Layout>
            <main className="flex-grow">
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/apps/:appId" component={AppDetail} />
                <Route path="/categories/:categoryId" component={CategoryPage} />
                <Route path="/search" component={SearchResults} />
                <Route path="/apps/all" component={AllApps} />
              </Switch>
            </main>
          </Layout>
        </Router>
        <Toaster />
      </LanguageProvider>
    </QueryClientProvider>
  );
};

export default StaticApp;