import { Redirect, Route } from 'wouter';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface ProtectedRouteProps {
  path: string;
  component: React.ComponentType;
}

/**
 * Protected route component
 * Redirects to login page if user is not authenticated
 */
export function ProtectedRoute({ path, component: Component }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Route>
    );
  }

  if (!user) {
    return (
      <Route path={path}>
        <Redirect to="/auth" />
      </Route>
    );
  }

  return <Route path={path} component={Component} />;
}