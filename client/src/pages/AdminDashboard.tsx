import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAdmin, AdminGuard } from '@/context/AdminContext';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Loader2, LogOut, BarChart3, AppWindow, Link as LinkIcon, Settings, RefreshCw } from 'lucide-react';
import type { AppLegacy, AffiliateLink } from '../../shared/schema';
import { AppUpdatesTab } from '@/components/admin/AppUpdatesTab';

type AdminTab = 'dashboard' | 'apps' | 'affiliate-links' | 'app-updates' | 'settings';

export default function AdminDashboard() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}

function AdminDashboardContent() {
  const { user, logout } = useAdmin();
  const { t } = useLanguage();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  const handleLogout = async () => {
    try {
      await logout();
      toast({
        title: t('admin.logoutSuccess'),
        description: t('admin.comeBackSoon'),
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: 'destructive',
        title: t('admin.logoutError'),
        description: t('admin.tryAgainLater'),
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">TopApps Admin</h1>
            <span className="text-sm text-gray-500">
              {t('admin.loggedInAs')} <span className="font-medium">{user?.username}</span>
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            {t('admin.logout')}
          </Button>
        </div>
      </header>

      {/* Admin Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs 
          defaultValue="dashboard" 
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as AdminTab)}
          className="space-y-4"
        >
          <TabsList className="grid grid-cols-5 w-full max-w-3xl">
            <TabsTrigger value="dashboard">
              <BarChart3 className="h-4 w-4 mr-2" />
              {t('admin.dashboard')}
            </TabsTrigger>
            <TabsTrigger value="apps">
              <AppWindow className="h-4 w-4 mr-2" />
              {t('admin.apps')}
            </TabsTrigger>
            <TabsTrigger value="affiliate-links">
              <LinkIcon className="h-4 w-4 mr-2" />
              {t('admin.affiliateLinks')}
            </TabsTrigger>
            <TabsTrigger value="app-updates">
              <RefreshCw className="h-4 w-4 mr-2" />
              {t('admin.appUpdates')}
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="h-4 w-4 mr-2" />
              {t('admin.settings')}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <DashboardTab />
          </TabsContent>

          <TabsContent value="apps" className="space-y-4">
            <AppsTab />
          </TabsContent>

          <TabsContent value="affiliate-links" className="space-y-4">
            <AffiliateLinksTab />
          </TabsContent>
          
          <TabsContent value="app-updates" className="space-y-4">
            <AppUpdatesTab />
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function DashboardTab() {
  const { t } = useLanguage();
  const { data: analytics = [], isLoading } = useQuery<Array<{appId: string, appName: string, totalClicks: number}>>({
    queryKey: ['/api/admin/affiliate-links/analytics'],
    retry: false,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">{t('admin.dashboardOverview')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t('admin.totalApps')}</CardTitle>
            <CardDescription>{t('admin.appsInSystem')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">42</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t('admin.affiliateLinks')}</CardTitle>
            <CardDescription>{t('admin.activeLinks')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">38</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>{t('admin.linkClicks')}</CardTitle>
            <CardDescription>{t('admin.totalTraffic')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">1,246</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.affiliatePerformance')}</CardTitle>
          <CardDescription>{t('admin.topPerformingLinks')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : analytics && analytics.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">{t('admin.app')}</th>
                    <th className="text-right py-2">{t('admin.clicks')}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* This would normally be analytics data */}
                  <tr className="border-b">
                    <td className="py-2">TikTok</td>
                    <td className="text-right">358</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Netflix</td>
                    <td className="text-right">246</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Spotify</td>
                    <td className="text-right">198</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Instagram</td>
                    <td className="text-right">167</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">WhatsApp</td>
                    <td className="text-right">110</td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {t('admin.noAnalyticsAvailable')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AppsTab() {
  const { t } = useLanguage();
  const { data: apps = [], isLoading } = useQuery<AppLegacy[]>({
    queryKey: ['/api/admin/apps'],
    retry: false,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{t('admin.manageApps')}</h2>
        <Button>
          {t('admin.syncAllApps')}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.appsList')}</CardTitle>
          <CardDescription>{t('admin.manageAppDetails')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : apps && apps.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">{t('admin.appName')}</th>
                    <th className="text-center py-2">{t('admin.category')}</th>
                    <th className="text-center py-2">{t('admin.rating')}</th>
                    <th className="text-center py-2">{t('admin.lastUpdated')}</th>
                    <th className="text-right py-2">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* This would be populated with actual apps data */}
                  <tr className="border-b">
                    <td className="py-2">Netflix</td>
                    <td className="text-center">Entertainment</td>
                    <td className="text-center">4.5</td>
                    <td className="text-center">2023-05-15</td>
                    <td className="text-right">
                      <Button variant="outline" size="sm">
                        {t('admin.edit')}
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Spotify</td>
                    <td className="text-center">Music</td>
                    <td className="text-center">4.7</td>
                    <td className="text-center">2023-05-20</td>
                    <td className="text-right">
                      <Button variant="outline" size="sm">
                        {t('admin.edit')}
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {t('admin.noAppsAvailable')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function AffiliateLinksTab() {
  const { t } = useLanguage();
  const { data: links = [], isLoading } = useQuery<AffiliateLink[]>({
    queryKey: ['/api/admin/affiliate-links'],
    retry: false,
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{t('admin.manageAffiliateLinks')}</h2>
        <Button>
          {t('admin.addNewLink')}
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.affiliateLinksList')}</CardTitle>
          <CardDescription>{t('admin.manageAffiliateLinksDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : links && links.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">{t('admin.app')}</th>
                    <th className="text-left py-2">{t('admin.label')}</th>
                    <th className="text-center py-2">{t('admin.buttonText')}</th>
                    <th className="text-center py-2">{t('admin.clicks')}</th>
                    <th className="text-right py-2">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {/* This would be populated with actual affiliate links data */}
                  <tr className="border-b">
                    <td className="py-2">TikTok</td>
                    <td>Premium Download</td>
                    <td className="text-center">Get Premium</td>
                    <td className="text-center">358</td>
                    <td className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        {t('admin.edit')}
                      </Button>
                      <Button variant="destructive" size="sm">
                        {t('admin.delete')}
                      </Button>
                    </td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2">Netflix</td>
                    <td>Free Trial</td>
                    <td className="text-center">Start Free Trial</td>
                    <td className="text-center">246</td>
                    <td className="text-right">
                      <Button variant="outline" size="sm" className="mr-2">
                        {t('admin.edit')}
                      </Button>
                      <Button variant="destructive" size="sm">
                        {t('admin.delete')}
                      </Button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {t('admin.noAffiliateLinksAvailable')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SettingsTab() {
  const { t } = useLanguage();
  
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold">{t('admin.settings')}</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.generalSettings')}</CardTitle>
          <CardDescription>{t('admin.configureGeneralSettings')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-medium mb-2">{t('admin.appSynchronization')}</h3>
            <p className="text-sm text-gray-600 mb-2">{t('admin.syncScheduleDescription')}</p>
            <Button variant="outline">
              {t('admin.configureSchedule')}
            </Button>
          </div>
          
          <div>
            <h3 className="font-medium mb-2">{t('admin.adminAccount')}</h3>
            <p className="text-sm text-gray-600 mb-2">{t('admin.changePasswordDescription')}</p>
            <Button variant="outline">
              {t('admin.changePassword')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}