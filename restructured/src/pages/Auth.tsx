import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/context/LanguageContext';
import { Loader2 } from 'lucide-react';

// Esquemas de validación
const loginSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

const registerSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(6, 'Password must be at least 6 characters')
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword']
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

// Componente de autenticación
export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { translateText } = useLanguage();
  const { user, loginMutation, registerMutation } = useAuth();
  const [, navigate] = useLocation();
  
  // Si el usuario ya está autenticado, redirigir a la página principal
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);
  
  // Formulario de inicio de sesión
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: ''
    }
  });
  
  // Formulario de registro
  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      password: '',
      confirmPassword: ''
    }
  });
  
  // Manejar envío de inicio de sesión
  const handleLogin = (data: LoginFormValues) => {
    loginMutation.mutate({
      username: data.username,
      password: data.password
    });
  };
  
  // Manejar envío de registro
  const handleRegister = (data: RegisterFormValues) => {
    registerMutation.mutate({
      username: data.username,
      password: data.password
    });
  };
  
  // Textos traducibles
  const [translations, setTranslations] = useState({
    welcome: 'Welcome to TopApps',
    description: 'Discover the best mobile applications with our personalized recommendation platform.',
    loginTab: 'Login',
    registerTab: 'Register',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    loginButton: 'Login',
    registerButton: 'Register',
    loginError: loginForm.formState.errors.username?.message || loginForm.formState.errors.password?.message || '',
    registerError: registerForm.formState.errors.username?.message || 
                  registerForm.formState.errors.password?.message || 
                  registerForm.formState.errors.confirmPassword?.message || ''
  });
  
  // Traducir textos
  useEffect(() => {
    async function translate() {
      const translated = {
        welcome: await translateText(translations.welcome),
        description: await translateText(translations.description),
        loginTab: await translateText(translations.loginTab),
        registerTab: await translateText(translations.registerTab),
        username: await translateText(translations.username),
        password: await translateText(translations.password),
        confirmPassword: await translateText(translations.confirmPassword),
        loginButton: await translateText(translations.loginButton),
        registerButton: await translateText(translations.registerButton),
        loginError: translations.loginError ? await translateText(translations.loginError) : '',
        registerError: translations.registerError ? await translateText(translations.registerError) : ''
      };
      
      setTranslations(translated);
    }
    
    translate();
  }, [
    translateText, 
    loginForm.formState.errors.username, 
    loginForm.formState.errors.password,
    registerForm.formState.errors.username,
    registerForm.formState.errors.password,
    registerForm.formState.errors.confirmPassword
  ]);
  
  return (
    <div className="flex flex-col md:flex-row h-full min-h-[80vh]">
      {/* Formulario */}
      <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-md mx-auto w-full">
          {/* Tabs de navegación */}
          <div className="flex border-b mb-6">
            <button
              className={`py-2 px-4 font-medium ${isLogin ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
              onClick={() => setIsLogin(true)}
            >
              {translations.loginTab}
            </button>
            <button
              className={`py-2 px-4 font-medium ${!isLogin ? 'border-b-2 border-primary text-primary' : 'text-gray-500'}`}
              onClick={() => setIsLogin(false)}
            >
              {translations.registerTab}
            </button>
          </div>
          
          {/* Formulario de login */}
          {isLogin ? (
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {translations.username}
                </label>
                <input
                  {...loginForm.register('username')}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {translations.password}
                </label>
                <input
                  type="password"
                  {...loginForm.register('password')}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              {translations.loginError && (
                <div className="text-red-500 text-sm">
                  {translations.loginError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={loginMutation.isPending}
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 flex items-center justify-center"
              >
                {loginMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : null}
                {translations.loginButton}
              </button>
            </form>
          ) : (
            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  {translations.username}
                </label>
                <input
                  {...registerForm.register('username')}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {translations.password}
                </label>
                <input
                  type="password"
                  {...registerForm.register('password')}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">
                  {translations.confirmPassword}
                </label>
                <input
                  type="password"
                  {...registerForm.register('confirmPassword')}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              
              {translations.registerError && (
                <div className="text-red-500 text-sm">
                  {translations.registerError}
                </div>
              )}
              
              <button
                type="submit"
                disabled={registerMutation.isPending}
                className="w-full bg-primary text-white py-2 rounded-md hover:bg-primary/90 flex items-center justify-center"
              >
                {registerMutation.isPending ? (
                  <Loader2 className="h-5 w-5 animate-spin mr-2" />
                ) : null}
                {translations.registerButton}
              </button>
            </form>
          )}
        </div>
      </div>
      
      {/* Hero section */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-primary to-primary-dark p-8 text-white flex items-center justify-center">
        <div className="max-w-md">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {translations.welcome}
          </h1>
          <p className="text-lg opacity-90">
            {translations.description}
          </p>
          
          {/* Imágenes de aplicaciones */}
          <div className="mt-8 grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div 
                key={i} 
                className="aspect-square bg-white/10 rounded-lg shadow-lg flex items-center justify-center"
              >
                <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-md bg-white/40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}