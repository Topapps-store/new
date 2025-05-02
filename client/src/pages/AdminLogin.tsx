import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { SimpleThemeToggle } from '@/components/admin/ThemeToggle';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const { t } = useLanguage();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const userData = await apiRequest<{ id: number; username: string; isAdmin: boolean }>('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (userData.isAdmin) {
        toast({
          title: t('admin.loginSuccess'),
          description: t('admin.welcomeBack', { username: userData.username }),
        });
        navigate('/admin/dashboard');
      } else {
        setError(t('admin.notAdmin'));
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.message || t('admin.loginError')
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-admin-sidebar transition-colors duration-200 p-4">
      <div className="absolute top-4 right-4">
        <SimpleThemeToggle />
      </div>
      <Card className="w-full max-w-md bg-admin-card border-admin transition-colors duration-200">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">{t('admin.login')}</CardTitle>
          <CardDescription className="text-center text-admin-muted">
            {t('admin.enterCredentials')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">{t('admin.username')}</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('admin.password')}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading}
            >
              {loading ? t('admin.loggingIn') : t('admin.login')}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}