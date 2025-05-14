import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import type { Category } from '@shared/schema';

interface GooglePlayImportProps {
  onAppAdded: () => void;
}

export function GooglePlayImport({ onAppAdded }: GooglePlayImportProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [googlePlayUrl, setGooglePlayUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customAppId, setCustomAppId] = useState('');
  const [isImporting, setIsImporting] = useState(false);

  // Fetch available categories
  const { data: categories = [], isLoading: isCategoriesLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    retry: false,
  });

  // Extract package name from Google Play URL or ID
  const extractPackageName = (url: string) => {
    const urlPattern = /https:\/\/play\.google\.com\/store\/apps\/details\?id=([^&]+)/;
    const urlMatch = url.match(urlPattern);
    
    if (urlMatch && urlMatch[1]) {
      return urlMatch[1];
    }
    
    // Return as-is if it seems to be just a package name
    return url.trim();
  };
  
  // Generate a simpler app ID from the package name
  const generateAppId = (packageName: string) => {
    // Extract the last part after the last dot
    const parts = packageName.split('.');
    let appId = parts[parts.length - 1].toLowerCase();
    
    // Clean up app ID (only lowercase letters, numbers, and dashes)
    appId = appId.replace(/[^a-z0-9-]/g, '-');
    
    return appId;
  };

  const handleImport = async () => {
    if (!googlePlayUrl) {
      toast({
        variant: 'destructive',
        title: t('admin.validationError'),
        description: t('admin.googlePlayUrlRequired'),
      });
      return;
    }

    if (!selectedCategory) {
      toast({
        variant: 'destructive',
        title: t('admin.validationError'),
        description: t('admin.categoryRequired'),
      });
      return;
    }

    setIsImporting(true);

    try {
      const packageName = extractPackageName(googlePlayUrl);
      const appId = customAppId || generateAppId(packageName);
      
      // First, create the app with minimal data
      const createResponse = await fetch('/api/admin/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: appId,
          name: appId, // Temporary name, will be updated by the sync
          categoryId: selectedCategory,
          description: '',
          originalAppId: packageName, // Set the package name as originalAppId
          googlePlayUrl: `https://play.google.com/store/apps/details?id=${packageName}`,
        }),
      });

      if (!createResponse.ok) {
        throw new Error(`Failed to create app: ${createResponse.statusText}`);
      }

      toast({
        title: t('admin.appCreated'),
        description: t('admin.syncingFromGooglePlay'),
      });

      // Then trigger a sync to fetch all data from Google Play
      const syncResponse = await fetch(`/api/admin/apps/${appId}/sync`, {
        method: 'POST',
      });

      if (!syncResponse.ok) {
        throw new Error(`Failed to sync app: ${syncResponse.statusText}`);
      }

      toast({
        title: t('admin.importSuccessful'),
        description: t('admin.appImportedFromGooglePlay'),
      });

      // Reset form
      setGooglePlayUrl('');
      setCustomAppId('');
      
      // Invalidate queries to refresh app lists
      queryClient.invalidateQueries({ queryKey: ['/api/admin/apps'] });
      
      // Notify parent that app was added
      onAppAdded();
    } catch (error) {
      console.error('Error importing app:', error);
      toast({
        variant: 'destructive',
        title: t('admin.importError'),
        description: String(error) || t('admin.importErrorDescription'),
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Card className="bg-admin-card border-admin transition-colors duration-200">
      <CardHeader>
        <CardTitle>{t('admin.importFromGooglePlay')}</CardTitle>
        <CardDescription className="text-admin-muted">
          {t('admin.importFromGooglePlayDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="googlePlayUrl">{t('admin.googlePlayUrlOrPackageName')}</Label>
          <Input
            id="googlePlayUrl"
            placeholder="https://play.google.com/store/apps/details?id=com.example.app"
            value={googlePlayUrl}
            onChange={(e) => setGooglePlayUrl(e.target.value)}
            disabled={isImporting}
          />
          <p className="text-sm text-admin-muted">
            {t('admin.googlePlayUrlHint')}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="customAppId">{t('admin.customAppId')} ({t('admin.optional')})</Label>
          <Input
            id="customAppId"
            placeholder="my-app"
            value={customAppId}
            onChange={(e) => setCustomAppId(e.target.value)}
            disabled={isImporting}
          />
          <p className="text-sm text-admin-muted">
            {t('admin.customAppIdHint')}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="categoryId">{t('admin.category')}</Label>
          <Select 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            disabled={isImporting || isCategoriesLoading}
          >
            <SelectTrigger id="categoryId">
              <SelectValue placeholder={t('admin.selectCategory')} />
            </SelectTrigger>
            <SelectContent>
              {isCategoriesLoading ? (
                <SelectItem value="loading" disabled>{t('admin.loading')}</SelectItem>
              ) : (
                categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>

        <Button 
          onClick={handleImport} 
          disabled={isImporting || !googlePlayUrl || !selectedCategory}
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
      </CardContent>
    </Card>
  );
}