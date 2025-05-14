import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import type { Category } from '@shared/schema';

interface GooglePlayImportSimpleProps {
  onAppAdded: () => void;
}

export function GooglePlayImportSimple({ onAppAdded }: GooglePlayImportSimpleProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [googlePlayUrl, setGooglePlayUrl] = useState('');
  const [appStoreUrl, setAppStoreUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customAppId, setCustomAppId] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios'>('android');

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    retry: false,
  });

  const handleImport = async () => {
    const url = activeTab === 'android' ? googlePlayUrl : appStoreUrl;
    
    if (!url) {
      toast({
        variant: 'destructive',
        title: activeTab === 'android' ? t('admin.googlePlayUrlRequired') : t('admin.appStoreUrlRequired'),
        description: activeTab === 'android' ? t('admin.pleaseEnterGooglePlayUrl') : t('admin.pleaseEnterAppStoreUrl'),
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        variant: 'destructive',
        title: t('admin.categoryRequired'),
        description: t('admin.pleaseSelectCategory'),
      });
      return;
    }

    setIsImporting(true);

    try {
      const response = await fetch('/api/admin/import-google-play', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          googlePlayUrl: activeTab === 'android' ? googlePlayUrl : '',
          appStoreUrl: activeTab === 'ios' ? appStoreUrl : '',
          categoryId: selectedCategory,
          customAppId: customAppId || undefined,
          storeType: activeTab,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to import app');
      }

      const data = await response.json();

      toast({
        title: t('admin.importSuccessful'),
        description: t('admin.appImportedSuccessfully'),
      });

      // Reset form
      setGooglePlayUrl('');
      setAppStoreUrl('');
      setCustomAppId('');
      setSelectedCategory('');

      // Invalidate queries to refresh app lists
      queryClient.invalidateQueries({ queryKey: ['/api/admin/apps'] });

      // Notify parent
      onAppAdded();
    } catch (error) {
      console.error('Error importing app:', error);
      toast({
        variant: 'destructive',
        title: t('admin.importFailed'),
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="android" value={activeTab} onValueChange={(value) => setActiveTab(value as 'android' | 'ios')}>
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="android">Google Play</TabsTrigger>
          <TabsTrigger value="ios">App Store</TabsTrigger>
        </TabsList>
        
        <TabsContent value="android">
          <div className="space-y-2">
            <Label htmlFor="googlePlayUrl">{t('admin.googlePlayUrl')}</Label>
            <Input
              id="googlePlayUrl"
              value={googlePlayUrl}
              onChange={(e) => setGooglePlayUrl(e.target.value)}
              placeholder="https://play.google.com/store/apps/details?id=com.example.app"
              disabled={isImporting}
            />
            <p className="text-xs text-muted-foreground">
              {t('admin.enterFullGooglePlayUrl')}
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="ios">
          <div className="space-y-2">
            <Label htmlFor="appStoreUrl">{t('admin.appStoreUrl')}</Label>
            <Input
              id="appStoreUrl"
              value={appStoreUrl}
              onChange={(e) => setAppStoreUrl(e.target.value)}
              placeholder="https://apps.apple.com/app/id123456789"
              disabled={isImporting}
            />
            <p className="text-xs text-muted-foreground">
              {t('admin.enterFullAppStoreUrl')}
            </p>
          </div>
        </TabsContent>
      </Tabs>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="customAppId">{t('admin.customAppId')} ({t('admin.optional')})</Label>
          <Input
            id="customAppId"
            value={customAppId}
            onChange={(e) => setCustomAppId(e.target.value)}
            placeholder="my-app"
            disabled={isImporting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">{t('admin.category')}</Label>
          <Select
            value={selectedCategory}
            onValueChange={setSelectedCategory}
            disabled={isImporting}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder={t('admin.selectCategory')} />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-sm text-center text-muted-foreground">
        {t('admin.autoImportDescription')}
      </p>

      <Button
        onClick={handleImport}
        disabled={isImporting || (activeTab === 'android' ? !googlePlayUrl : !appStoreUrl) || !selectedCategory}
        className="w-full"
      >
        {isImporting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('admin.importing')}
          </>
        ) : (
          t('admin.importApp')
        )}
      </Button>
    </div>
  );
}