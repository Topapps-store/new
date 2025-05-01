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
import { LanguageProvider } from "./context/LanguageContext";

function Router() {
  return (
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
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LanguageProvider>
          <Toaster />
          <Router />
        </LanguageProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
