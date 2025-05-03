import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import AppDetail from "@/pages/AppDetail";
import Category from "@/pages/Category";
import AllApps from "@/pages/AllApps";
import TermsOfService from "@/pages/TermsOfService";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import Disclaimer from "@/pages/Disclaimer";
import Contact from "@/pages/Contact";
import Search from "@/pages/Search";
import AdminLogin from "@/pages/AdminLogin";
import AdminDashboard from "@/pages/AdminDashboard";
import { LanguageProvider } from "./context/LanguageContext";
import { AdminProvider } from "./context/AdminContext";
import { ThemeProvider } from "./context/ThemeContext";
import { useScrollToTop } from "./hooks/useScrollToTop";

function Router() {
  // This hook will scroll to top on route changes
  useScrollToTop();
  
  return (
    <Switch>
      {/* Admin routes without Layout */}
      <Route path="/admin/login" component={AdminLogin} />
      <Route path="/admin/dashboard" component={AdminDashboard} />
      
      {/* Main site routes with Layout */}
      <Route path="*">
        <Layout>
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/apps/all" component={AllApps} />
            <Route path="/apps/:appId" component={AppDetail} />
            <Route path="/categories/:categoryId" component={Category} />
            <Route path="/search" component={Search} />
            <Route path="/terms" component={TermsOfService} />
            <Route path="/privacy" component={PrivacyPolicy} />
            <Route path="/disclaimer" component={Disclaimer} />
            <Route path="/contact" component={Contact} />
            <Route component={NotFound} />
          </Switch>
        </Layout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <LanguageProvider>
            <AdminProvider>
              <Toaster />
              <Router />
            </AdminProvider>
          </LanguageProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
