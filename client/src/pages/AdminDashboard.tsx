import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAdmin, AdminGuard } from '@/context/AdminContext';
import { useTheme } from '@/context/ThemeContext';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { Loader2, LogOut, BarChart3, AppWindow, Link as LinkIcon, Settings, RefreshCw } from 'lucide-react';
import type { AppLegacy, AffiliateLink } from '@shared/schema';
import { AppUpdatesTab } from '@/components/admin/AppUpdatesTab';
import { 
  AddAppModal, 
  EditAppModal, 
  LogoUploadModal, 
  DeleteAppDialog 
} from '@/components/admin/AppManagementModals';
import { SimpleThemeToggle } from '@/components/admin/ThemeToggle';

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
    <div className="min-h-screen bg-admin-sidebar transition-colors duration-200">
      {/* Admin Header */}
      <header className="bg-admin border-admin border-b transition-colors duration-200">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">TopApps Admin</h1>
            <span className="text-sm text-admin-muted">
              {t('admin.loggedInAs')} <span className="font-medium">{user?.username}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <SimpleThemeToggle />
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              {t('admin.logout')}
            </Button>
          </div>
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
        <Card className="bg-admin-card border-admin transition-colors duration-200">
          <CardHeader className="pb-2">
            <CardTitle>{t('admin.totalApps')}</CardTitle>
            <CardDescription className="text-admin-muted">{t('admin.appsInSystem')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">42</p>
          </CardContent>
        </Card>
        
        <Card className="bg-admin-card border-admin transition-colors duration-200">
          <CardHeader className="pb-2">
            <CardTitle>{t('admin.affiliateLinks')}</CardTitle>
            <CardDescription className="text-admin-muted">{t('admin.activeLinks')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">38</p>
          </CardContent>
        </Card>
        
        <Card className="bg-admin-card border-admin transition-colors duration-200">
          <CardHeader className="pb-2">
            <CardTitle>{t('admin.linkClicks')}</CardTitle>
            <CardDescription className="text-admin-muted">{t('admin.totalTraffic')}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">1,246</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-admin-card border-admin transition-colors duration-200">
        <CardHeader>
          <CardTitle>{t('admin.affiliatePerformance')}</CardTitle>
          <CardDescription className="text-admin-muted">{t('admin.topPerformingLinks')}</CardDescription>
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
  const { toast } = useToast();
  const [isAddAppModalOpen, setIsAddAppModalOpen] = useState(false);
  const [isEditAppModalOpen, setIsEditAppModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState<AppLegacy | null>(null);
  const [isLogoUploadModalOpen, setIsLogoUploadModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  
  const { data: apps = [], isLoading, refetch } = useQuery<AppLegacy[]>({
    queryKey: ['/api/admin/apps'],
    retry: false,
  });
  
  const handleSyncAllApps = async () => {
    try {
      toast({
        title: t('admin.syncingApps'),
        description: t('admin.syncingAppsDescription'),
      });
      
      // Call API to sync all apps
      await fetch('/api/admin/sync-all-apps', {
        method: 'POST',
      });
      
      toast({
        title: t('admin.syncComplete'),
        description: t('admin.syncCompleteDescription'),
      });
      
      // Refetch apps after sync
      refetch();
    } catch (error) {
      console.error('Error syncing apps:', error);
      toast({
        variant: 'destructive',
        title: t('admin.syncError'),
        description: t('admin.syncErrorDescription'),
      });
    }
  };
  
  const handleEditApp = (app: AppLegacy) => {
    setSelectedApp(app);
    setIsEditAppModalOpen(true);
  };
  
  const handleDeleteApp = (app: AppLegacy) => {
    setSelectedApp(app);
    setIsConfirmDeleteOpen(true);
  };
  
  const handleUploadLogo = (app: AppLegacy) => {
    setSelectedApp(app);
    setIsLogoUploadModalOpen(true);
  };
  
  const handleSyncApp = async (app: AppLegacy) => {
    try {
      toast({
        title: t('admin.syncingApp'),
        description: t('admin.syncingAppDescription', { appName: app.name }),
      });
      
      const response = await fetch(`/api/admin/apps/${app.id}/sync`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Failed to sync app');
      }
      
      const data = await response.json();
      
      toast({
        title: t('admin.syncComplete'),
        description: t('admin.appSyncCompleteDescription', { appName: app.name }),
      });
      
      // Refetch apps after sync
      refetch();
    } catch (error) {
      console.error('Error syncing app:', error);
      toast({
        variant: 'destructive',
        title: t('admin.syncError'),
        description: t('admin.appSyncErrorDescription'),
      });
    }
  };
  
  const confirmDeleteApp = async () => {
    if (!selectedApp) return;
    
    try {
      await fetch(`/api/admin/apps/${selectedApp.id}`, {
        method: 'DELETE',
      });
      
      toast({
        title: t('admin.appDeleted'),
        description: t('admin.appDeletedDescription'),
      });
      
      // Refetch apps after deletion
      refetch();
      setIsConfirmDeleteOpen(false);
    } catch (error) {
      console.error('Error deleting app:', error);
      toast({
        variant: 'destructive',
        title: t('admin.deleteError'),
        description: t('admin.deleteErrorDescription'),
      });
    }
  };
  
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{t('admin.manageApps')}</h2>
        <div className="flex space-x-2">
          <Button 
            variant="outline"
            onClick={() => setIsAddAppModalOpen(true)}
          >
            {t('admin.addNewApp')}
          </Button>
          <Button onClick={handleSyncAllApps}>
            {t('admin.syncAllApps')}
          </Button>
        </div>
      </div>
      
      <Card className="bg-admin-card border-admin transition-colors duration-200">
        <CardHeader>
          <CardTitle>{t('admin.appsList')}</CardTitle>
          <CardDescription className="text-admin-muted">{t('admin.manageAppDetails')}</CardDescription>
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
                    <th className="text-left py-2">{t('admin.icon')}</th>
                    <th className="text-left py-2">{t('admin.appName')}</th>
                    <th className="text-center py-2">{t('admin.category')}</th>
                    <th className="text-center py-2">{t('admin.rating')}</th>
                    <th className="text-center py-2">{t('admin.lastUpdated')}</th>
                    <th className="text-right py-2">{t('admin.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {apps.map((app) => (
                    <tr key={app.id} className="border-b">
                      <td className="py-2">
                        <div className="relative w-10 h-10 rounded-md overflow-hidden">
                          <img 
                            src={app.iconUrl} 
                            alt={app.name}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/80';
                            }}
                          />
                          <button 
                            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                            onClick={() => handleUploadLogo(app)}
                            title={t('admin.changeIcon')}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td className="py-2">{app.name}</td>
                      <td className="text-center">{app.category}</td>
                      <td className="text-center">{app.rating.toFixed(1)}</td>
                      <td className="text-center">{formatDate(app.updated)}</td>
                      <td className="text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mr-2"
                          onClick={() => handleEditApp(app)}
                        >
                          {t('admin.edit')}
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mr-2"
                          onClick={() => handleSyncApp(app)}
                        >
                          <RefreshCw className="h-4 w-4 mr-1" />
                          {t('admin.sync')}
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteApp(app)}
                        >
                          {t('admin.delete')}
                        </Button>
                      </td>
                    </tr>
                  ))}
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
      
      {/* Add App Modal */}
      {isAddAppModalOpen && (
        <AddAppModal 
          isOpen={isAddAppModalOpen} 
          onClose={() => setIsAddAppModalOpen(false)} 
          onAppAdded={() => {
            refetch();
            setIsAddAppModalOpen(false);
          }}
        />
      )}
      
      {/* Edit App Modal */}
      {isEditAppModalOpen && selectedApp && (
        <EditAppModal 
          isOpen={isEditAppModalOpen} 
          onClose={() => setIsEditAppModalOpen(false)} 
          app={selectedApp}
          onAppUpdated={() => {
            refetch();
            setIsEditAppModalOpen(false);
          }}
        />
      )}
      
      {/* Logo Upload Modal */}
      {isLogoUploadModalOpen && selectedApp && (
        <LogoUploadModal 
          isOpen={isLogoUploadModalOpen} 
          onClose={() => setIsLogoUploadModalOpen(false)} 
          app={selectedApp}
          onLogoUploaded={() => {
            refetch();
            setIsLogoUploadModalOpen(false);
          }}
        />
      )}
      
      {/* Confirm Delete Dialog */}
      {isConfirmDeleteOpen && selectedApp && (
        <DeleteAppDialog
          isOpen={isConfirmDeleteOpen}
          onClose={() => setIsConfirmDeleteOpen(false)}
          onConfirm={confirmDeleteApp}
          appName={selectedApp.name}
        />
      )}
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