import { Route, Switch, useLocation } from 'wouter';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/lib/protected-route';
import { queryClient } from '@/lib/query-client';
import { useEffect } from 'react';

// Importar páginas
import Home from '@/pages/Home';
import AppDetail from '@/pages/AppDetail';
import Category from '@/pages/Category';
import Search from '@/pages/Search';
import Auth from '@/pages/Auth';
import AdminDashboard from '@/pages/AdminDashboard';
import PrivacyPolicy from '@/pages/legal/PrivacyPolicy';
import TermsOfService from '@/pages/legal/TermsOfService';
import Disclaimer from '@/pages/legal/Disclaimer';
import NotFound from '@/pages/NotFound';

// Importar layout
import { Layout } from '@/components/layout/Layout';

// Componente para manejar el scroll al cambiar de ruta
function ScrollToTop() {
  const [location] = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);
  
  return null;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Layout>
            <Switch>
              <Route path="/" component={Home} />
              <Route path="/app/:id" component={AppDetail} />
              <Route path="/category/:id" component={Category} />
              <Route path="/search" component={Search} />
              <Route path="/auth" component={Auth} />
              <ProtectedRoute path="/admin" component={AdminDashboard} />
              <Route path="/privacy-policy" component={PrivacyPolicy} />
              <Route path="/terms-of-service" component={TermsOfService} />
              <Route path="/disclaimer" component={Disclaimer} />
              <Route component={NotFound} />
            </Switch>
          </Layout>
          <Toaster />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;