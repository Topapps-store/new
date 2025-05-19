import React from 'react';
import { useQuery } from '@tanstack/react-query';
import type { AppVersionHistory as VersionHistory } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Loader2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

type AppVersionHistoryProps = {
  appId: string;
};

export function AppVersionHistory({ appId }: AppVersionHistoryProps) {
  const { t } = useLanguage();
  
  const { data: versionHistory = [], isLoading } = useQuery<VersionHistory[]>({
    queryKey: [`/api/app-updates/${appId}`],
    retry: 1,
    enabled: !!appId,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (versionHistory.length === 0) {
    return (
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>{t('appDetail.versionHistory')}</CardTitle>
          <CardDescription>{t('appDetail.noVersionHistory')}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>{t('appDetail.versionHistory')}</CardTitle>
        <CardDescription>{t('appDetail.recentUpdates')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {versionHistory.map((version, index) => (
            <div key={version.id} className="border-b pb-4 last:border-b-0 last:pb-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold">{t('appDetail.version')} {version.version}</span>
                {version.isImportant && (
                  <Badge variant="outline" className="bg-amber-100 text-amber-800">
                    {t('appDetail.majorUpdate')}
                  </Badge>
                )}
                {index === 0 && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {t('appDetail.latest')}
                  </Badge>
                )}
              </div>
              
              <p className="text-sm text-slate-700 mb-2">
                {version.releaseNotes || t('appDetail.noReleaseNotes')}
              </p>
              
              <div className="text-xs text-slate-500">
                {t('appDetail.updated')}: {version.updateDate ? new Date(version.updateDate).toLocaleDateString() : ''}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}