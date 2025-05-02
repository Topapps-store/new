import React from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/context/LanguageContext';
import { apiRequest } from '@/lib/queryClient';
import type { AppLegacy, AppVersionHistory } from '@shared/schema';

type AppUpdate = {
  app: AppLegacy;
  versionHistory: AppVersionHistory;
};

export function AppUpdatesTab() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Fetch recent app updates
  const { data: updates = [], isLoading } = useQuery<AppUpdate[]>({
    queryKey: ['/api/app-updates/recent'],
    retry: 1,
  });

  // Mutation to mark app version as notified
  const markAsNotifiedMutation = useMutation({
    mutationFn: async (versionId: number) => {
      return apiRequest(`/api/app-updates/${versionId}/mark-notified`, {
        method: 'PATCH',
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/app-updates/recent'] });
      queryClient.invalidateQueries({ queryKey: ['/api/app-updates/unnotified'] });
      toast({
        title: t('admin.updateNotified'),
        description: t('admin.updateMarkedAsNotified'),
      });
    },
    onError: () => {
      toast({
        variant: 'destructive',
        title: t('admin.errorOccurred'),
        description: t('admin.couldNotMarkAsNotified'),
      });
    },
  });

  const handleMarkAsNotified = (versionId: number) => {
    markAsNotifiedMutation.mutate(versionId);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold">{t('admin.appUpdates')}</h2>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.recentUpdates')}</CardTitle>
          <CardDescription>{t('admin.manageAppUpdateNotifications')}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center p-4">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : updates && updates.length > 0 ? (
            <div className="space-y-4">
              {updates.map((update) => (
                <div 
                  key={update.versionHistory.id} 
                  className={`border rounded-md p-4 ${update.versionHistory.isNotified ? 'bg-gray-50' : 'bg-white'}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{update.app.name}</h3>
                        <Badge variant="outline" className="bg-blue-100 text-blue-800">
                          v{update.versionHistory.version}
                        </Badge>
                        {update.versionHistory.isImportant && (
                          <Badge variant="outline" className="bg-amber-100 text-amber-800">
                            {t('admin.majorUpdate')}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="text-sm text-gray-500 mt-1">
                        {t('admin.updated')}: {new Date(update.versionHistory.updateDate).toLocaleDateString()}
                      </div>
                      
                      <div className="mt-2">
                        <p className="text-sm">
                          {update.versionHistory.releaseNotes || t('admin.noReleaseNotes')}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      {update.versionHistory.isNotified ? (
                        <div className="flex items-center text-green-600 text-sm">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t('admin.notified')}
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          onClick={() => handleMarkAsNotified(update.versionHistory.id)}
                          disabled={markAsNotifiedMutation.isPending}
                        >
                          <Bell className="h-4 w-4 mr-2" />
                          {t('admin.markAsNotified')}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              {t('admin.noAppUpdatesAvailable')}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}