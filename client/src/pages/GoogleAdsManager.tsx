import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertCircle, CheckCircle, TrendingUp, DollarSign, Eye, MousePointer, BarChart3, Settings } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';

interface CampaignData {
  name: string;
  budget: number;
  targetCpa?: number;
  keywords: string[];
  landingPageUrl: string;
  adGroups: {
    name: string;
    keywords: string[];
    ads: {
      headlines: string[];
      descriptions: string[];
      finalUrl: string;
    }[];
  }[];
}

interface GoogleAdsStatus {
  configured: boolean;
  message: string;
}

interface CampaignPerformance {
  impressions: number;
  clicks: number;
  ctr: number;
  averageCpc: number;
  cost: number;
  conversions: number;
  costPerConversion: number;
  conversionRate: number;
}

export default function GoogleAdsManager() {
  const [selectedApp, setSelectedApp] = useState('');
  const [campaignForm, setCampaignForm] = useState({
    budget: 50,
    targetLanguage: 'es',
    targetCountry: 'ES'
  });
  const [performanceFilter, setPerformanceFilter] = useState({
    campaignId: '',
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const queryClient = useQueryClient();

  // Verificar estado de configuración de Google Ads
  const { data: adsStatus, isLoading: statusLoading } = useQuery<GoogleAdsStatus>({
    queryKey: ['/api/google-ads/status'],
    retry: 1
  });

  // Obtener aplicaciones disponibles
  const { data: apps = [] } = useQuery({
    queryKey: ['/api/apps'],
    retry: 1
  });

  // Crear campaña para app específica
  const createAppCampaignMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/google-ads/campaigns/app-download', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/google-ads'] });
    }
  });

  // Crear acción de conversión
  const createConversionMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest('/api/google-ads/conversions', {
        method: 'POST',
        body: JSON.stringify(data)
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/google-ads'] });
    }
  });

  // Obtener performance de campaña
  const { data: performance, isLoading: performanceLoading } = useQuery<CampaignPerformance>({
    queryKey: ['/api/google-ads/campaigns', performanceFilter.campaignId, 'performance', performanceFilter.startDate, performanceFilter.endDate],
    enabled: !!performanceFilter.campaignId && !!performanceFilter.startDate && !!performanceFilter.endDate,
    retry: 1
  });

  const handleCreateAppCampaign = async () => {
    if (!selectedApp) {
      alert('Selecciona una aplicación primero');
      return;
    }

    const app = apps.find((a: any) => a.id === selectedApp);
    if (!app) return;

    try {
      await createAppCampaignMutation.mutateAsync({
        appId: app.id,
        appName: app.name,
        budget: campaignForm.budget,
        targetLanguage: campaignForm.targetLanguage,
        targetCountry: campaignForm.targetCountry
      });
      alert('Campaña creada exitosamente');
    } catch (error) {
      console.error('Error creando campaña:', error);
      alert('Error creando campaña');
    }
  };

  const handleCreateConversion = async () => {
    if (!selectedApp) {
      alert('Selecciona una aplicación primero');
      return;
    }

    const app = apps.find((a: any) => a.id === selectedApp);
    if (!app) return;

    try {
      await createConversionMutation.mutateAsync({
        name: `Descarga ${app.name}`,
        value: 5.0, // Valor de conversión por descarga
        currency: 'EUR',
        category: 'DOWNLOAD'
      });
      alert('Acción de conversión creada exitosamente');
    } catch (error) {
      console.error('Error creando conversión:', error);
      alert('Error creando acción de conversión');
    }
  };

  if (statusLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Google Ads Manager</h1>
        <p className="text-gray-600">Gestiona campañas de Google Ads desde Replit para maximizar descargas de apps</p>
      </div>

      {/* Estado de configuración */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {adsStatus?.configured ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            Estado de Google Ads API
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Badge variant={adsStatus?.configured ? "default" : "destructive"}>
              {adsStatus?.configured ? "Configurado" : "No Configurado"}
            </Badge>
            <p className="text-sm text-gray-600">{adsStatus?.message}</p>
          </div>
          
          {!adsStatus?.configured && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <h4 className="font-medium text-yellow-800 mb-2">Configuración requerida</h4>
              <p className="text-sm text-yellow-700 mb-3">
                Para usar Google Ads, configura estas variables de entorno en Replit:
              </p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• <code>GOOGLE_ADS_CLIENT_ID</code></li>
                <li>• <code>GOOGLE_ADS_CLIENT_SECRET</code></li>
                <li>• <code>GOOGLE_ADS_REFRESH_TOKEN</code></li>
                <li>• <code>GOOGLE_ADS_CUSTOMER_ID</code></li>
                <li>• <code>GOOGLE_ADS_DEVELOPER_TOKEN</code></li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      {adsStatus?.configured && (
        <Tabs defaultValue="campaigns" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="campaigns">Crear Campaña</TabsTrigger>
            <TabsTrigger value="conversions">Conversiones</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* Tab: Crear Campaña */}
          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Crear Campaña Optimizada para App</CardTitle>
                <CardDescription>
                  Genera automáticamente campañas de búsqueda con palabras clave y anuncios optimizados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="app-select">Seleccionar Aplicación</Label>
                      <Select value={selectedApp} onValueChange={setSelectedApp}>
                        <SelectTrigger>
                          <SelectValue placeholder="Elige una app..." />
                        </SelectTrigger>
                        <SelectContent>
                          {apps.map((app: any) => (
                            <SelectItem key={app.id} value={app.id}>
                              {app.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="budget">Presupuesto Diario (€)</Label>
                      <Input
                        id="budget"
                        type="number"
                        value={campaignForm.budget}
                        onChange={(e) => setCampaignForm(prev => ({
                          ...prev,
                          budget: Number(e.target.value)
                        }))}
                        min="1"
                        step="1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="language">Idioma Objetivo</Label>
                      <Select
                        value={campaignForm.targetLanguage}
                        onValueChange={(value) => setCampaignForm(prev => ({
                          ...prev,
                          targetLanguage: value
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="es">Español</SelectItem>
                          <SelectItem value="en">Inglés</SelectItem>
                          <SelectItem value="fr">Francés</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="country">País Objetivo</Label>
                      <Select
                        value={campaignForm.targetCountry}
                        onValueChange={(value) => setCampaignForm(prev => ({
                          ...prev,
                          targetCountry: value
                        }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ES">España</SelectItem>
                          <SelectItem value="US">Estados Unidos</SelectItem>
                          <SelectItem value="FR">Francia</SelectItem>
                          <SelectItem value="MX">México</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <h4 className="font-medium text-blue-800 mb-2">Configuración Automática</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>✓ Palabras clave optimizadas</li>
                        <li>✓ Anuncios responsivos de búsqueda</li>
                        <li>✓ Target CPA optimizado (€15)</li>
                        <li>✓ Landing page específica de la app</li>
                        <li>✓ Configuración para Quality Score 10/10</li>
                      </ul>
                    </div>

                    {selectedApp && (
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <h4 className="font-medium text-green-800 mb-2">Vista Previa</h4>
                        <p className="text-sm text-green-700">
                          <strong>Landing Page:</strong> /app/{selectedApp}
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>Presupuesto:</strong> €{campaignForm.budget}/día
                        </p>
                        <p className="text-sm text-green-700">
                          <strong>Target:</strong> {campaignForm.targetLanguage.toUpperCase()} - {campaignForm.targetCountry}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  onClick={handleCreateAppCampaign}
                  disabled={!selectedApp || createAppCampaignMutation.isPending}
                  className="w-full"
                >
                  {createAppCampaignMutation.isPending ? (
                    <>Creando Campaña...</>
                  ) : (
                    <>Crear Campaña Optimizada</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Conversiones */}
          <TabsContent value="conversions">
            <Card>
              <CardHeader>
                <CardTitle>Configurar Seguimiento de Conversiones</CardTitle>
                <CardDescription>
                  Crea acciones de conversión para medir descargas y optimizar campañas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="conv-app-select">Seleccionar Aplicación</Label>
                      <Select value={selectedApp} onValueChange={setSelectedApp}>
                        <SelectTrigger>
                          <SelectValue placeholder="Elige una app..." />
                        </SelectTrigger>
                        <SelectContent>
                          {apps.map((app: any) => (
                            <SelectItem key={app.id} value={app.id}>
                              {app.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                      <h4 className="font-medium text-purple-800 mb-2">Configuración de Conversión</h4>
                      <ul className="text-sm text-purple-700 space-y-1">
                        <li>• <strong>Valor:</strong> €5.00 por descarga</li>
                        <li>• <strong>Categoría:</strong> Descarga de aplicación</li>
                        <li>• <strong>Ventana:</strong> 30 días</li>
                        <li>• <strong>Conteo:</strong> Una por clic</li>
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <h4 className="font-medium text-gray-800 mb-2">Implementación</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        La conversión se activará automáticamente cuando usuarios:
                      </p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>1. Hagan clic en botones de descarga</li>
                        <li>2. Visiten páginas de app stores</li>
                        <li>3. Completen la descarga de la app</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleCreateConversion}
                  disabled={!selectedApp || createConversionMutation.isPending}
                  className="w-full"
                >
                  {createConversionMutation.isPending ? (
                    <>Configurando Conversión...</>
                  ) : (
                    <>Configurar Seguimiento de Conversiones</>
                  )}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Performance */}
          <TabsContent value="performance">
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Performance</CardTitle>
                <CardDescription>
                  Monitorea el rendimiento de tus campañas y optimiza resultados
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="perf-campaign">ID de Campaña</Label>
                    <Input
                      id="perf-campaign"
                      placeholder="123456789"
                      value={performanceFilter.campaignId}
                      onChange={(e) => setPerformanceFilter(prev => ({
                        ...prev,
                        campaignId: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="start-date">Fecha Inicio</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={performanceFilter.startDate}
                      onChange={(e) => setPerformanceFilter(prev => ({
                        ...prev,
                        startDate: e.target.value
                      }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="end-date">Fecha Fin</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={performanceFilter.endDate}
                      onChange={(e) => setPerformanceFilter(prev => ({
                        ...prev,
                        endDate: e.target.value
                      }))}
                    />
                  </div>
                </div>

                {performance && !performanceLoading && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <Eye className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-2xl font-bold">{performance.impressions.toLocaleString()}</p>
                            <p className="text-xs text-gray-600">Impresiones</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <MousePointer className="h-4 w-4 text-green-600" />
                          <div>
                            <p className="text-2xl font-bold">{performance.clicks.toLocaleString()}</p>
                            <p className="text-xs text-gray-600">Clics</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <BarChart3 className="h-4 w-4 text-purple-600" />
                          <div>
                            <p className="text-2xl font-bold">{(performance.ctr * 100).toFixed(2)}%</p>
                            <p className="text-xs text-gray-600">CTR</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-orange-600" />
                          <div>
                            <p className="text-2xl font-bold">€{(performance.cost / 1000000).toFixed(2)}</p>
                            <p className="text-xs text-gray-600">Costo Total</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {performanceLoading && (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}