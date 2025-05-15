import { Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/LanguageContext';
import { AuthProvider } from '@/hooks/use-auth';
import { ProtectedRoute } from '@/lib/protected-route';

// Pages
import HomePage from '@/pages/Home';
import AppDetailPage from '@/pages/AppDetail';
import CategoryPage from '@/pages/Category';
import SearchPage from '@/pages/Search';
import AuthPage from '@/pages/Auth';
import AdminDashboard from '@/pages/AdminDashboard';
import PrivacyPolicyPage from '@/pages/legal/PrivacyPolicy';
import TermsOfServicePage from '@/pages/legal/TermsOfService';
import DisclaimerPage from '@/pages/legal/Disclaimer';
import NotFoundPage from '@/pages/NotFound';

// Layout
import { Layout } from '@/components/layout/Layout';

/**
 * Scroll to top on route change component
 */
function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return null;
}

/**
 * Main application component
 */
export function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <Layout>
          <Router />
          <Toaster />
        </Layout>
      </LanguageProvider>
    </AuthProvider>
  );
}

/**
 * Application routes
 */
function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/app/:id" component={AppDetailPage} />
      <Route path="/category/:id" component={CategoryPage} />
      <Route path="/search" component={SearchPage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <Route path="/privacy-policy" component={PrivacyPolicyPage} />
      <Route path="/terms-of-service" component={TermsOfServicePage} />
      <Route path="/disclaimer" component={DisclaimerPage} />
      <Route component={NotFoundPage} />
    </Switch>
  );
}