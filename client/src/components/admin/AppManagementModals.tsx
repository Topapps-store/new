import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { queryClient } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';
import { AppLegacy } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GooglePlayImportSimple } from './GooglePlayImportSimple';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ImageIcon, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Category {
  id: string;
  name: string;
}

// Add App Modal
export function AddAppModal({ 
  isOpen, 
  onClose, 
  onAppAdded 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onAppAdded: () => void;
}) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'manual' | 'import'>('import');
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    categoryId: '',
    description: '',
    rating: 4.0,
    googlePlayUrl: '',
    iosAppStoreUrl: '',
    developer: '',
    version: '1.0',
    size: 'Varies',
    requires: 'Android 5.0+ or iOS 12.0+',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First submit the app data
      const response = await fetch('/api/admin/apps', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to create app');
      }

      const appData = await response.json();

      // If we have a logo, upload it
      if (logoFile) {
        const formData = new FormData();
        formData.append('logo', logoFile);

        const logoResponse = await fetch(`/api/admin/apps/${appData.id}/logo`, {
          method: 'POST',
          body: formData,
        });

        if (!logoResponse.ok) {
          toast({
            variant: 'destructive',
            title: t('admin.logoUploadFailed'),
            description: t('admin.logoUploadFailedDescription'),
          });
        }
      }

      toast({
        title: t('admin.appCreated'),
        description: t('admin.appCreatedDescription'),
      });

      queryClient.invalidateQueries({ queryKey: ['/api/admin/apps'] });
      onAppAdded();
      onClose();
    } catch (error) {
      console.error('Error creating app:', error);
      toast({
        variant: 'destructive',
        title: t('admin.createAppError'),
        description: t('admin.createAppErrorDescription'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories to populate the select dropdown
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    retry: false,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('admin.addNewApp')}</DialogTitle>
          <DialogDescription>
            {t('admin.addNewAppDescription')}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4">
          <GooglePlayImportSimple onAppAdded={() => {
            onAppAdded();
            onClose();
          }} />
      </div>
      </DialogContent>
    </Dialog>
  );
}

// Edit App Modal
export function EditAppModal({ 
  app, 
  isOpen, 
  onClose, 
  onAppUpdated 
}: { 
  app: AppLegacy; 
  isOpen: boolean; 
  onClose: () => void; 
  onAppUpdated: () => void;
}) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: app.name,
    categoryId: app.categoryId,
    description: app.description,
    rating: app.rating,
    googlePlayUrl: app.googlePlayUrl || '',
    iosAppStoreUrl: app.iosAppStoreUrl || '',
    developer: app.developer || '',
    version: app.version || '',
    size: app.size || '',
    requires: app.requires || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/admin/apps/${app.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update app');
      }

      toast({
        title: t('admin.appUpdated'),
        description: t('admin.appUpdatedDescription'),
      });

      queryClient.invalidateQueries({ queryKey: ['/api/admin/apps'] });
      onAppUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating app:', error);
      toast({
        variant: 'destructive',
        title: t('admin.updateAppError'),
        description: t('admin.updateAppErrorDescription'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch categories to populate the select dropdown
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    retry: false,
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('admin.editApp')}: {app.name}</DialogTitle>
          <DialogDescription>
            {t('admin.editAppDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('admin.appName')}</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="categoryId">{t('admin.category')}</Label>
              <Select 
                name="categoryId"
                value={formData.categoryId} 
                onValueChange={(value) => handleSelectChange('categoryId', value)}
              >
                <SelectTrigger>
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
          
          <div className="space-y-2">
            <Label htmlFor="description">{t('admin.description')}</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="developer">{t('admin.developer')}</Label>
              <Input
                id="developer"
                name="developer"
                value={formData.developer}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="rating">{t('admin.rating')}</Label>
              <Input
                id="rating"
                name="rating"
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={formData.rating}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="version">{t('admin.version')}</Label>
              <Input
                id="version"
                name="version"
                value={formData.version}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="size">{t('admin.size')}</Label>
              <Input
                id="size"
                name="size"
                value={formData.size}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="requires">{t('admin.requires')}</Label>
            <Input
              id="requires"
              name="requires"
              value={formData.requires}
              onChange={handleChange}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="googlePlayUrl">{t('admin.googlePlayUrl')}</Label>
              <Input
                id="googlePlayUrl"
                name="googlePlayUrl"
                value={formData.googlePlayUrl}
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="iosAppStoreUrl">{t('admin.iosAppStoreUrl')}</Label>
              <Input
                id="iosAppStoreUrl"
                name="iosAppStoreUrl"
                value={formData.iosAppStoreUrl}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
            >
              {t('admin.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('admin.updating')}
                </>
              ) : (
                t('admin.updateApp')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Logo Upload Modal
export function LogoUploadModal({ 
  app, 
  isOpen, 
  onClose, 
  onLogoUploaded 
}: { 
  app: AppLegacy; 
  isOpen: boolean; 
  onClose: () => void; 
  onLogoUploaded: () => void;
}) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create a preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logoFile) return;
    
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('logo', logoFile);

      const response = await fetch(`/api/admin/apps/${app.id}/logo`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload logo');
      }

      toast({
        title: t('admin.logoUpdated'),
        description: t('admin.logoUpdatedDescription'),
      });

      queryClient.invalidateQueries({ queryKey: ['/api/admin/apps'] });
      onLogoUploaded();
      onClose();
    } catch (error) {
      console.error('Error uploading logo:', error);
      toast({
        variant: 'destructive',
        title: t('admin.logoUploadError'),
        description: t('admin.logoUploadErrorDescription'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('admin.uploadLogoTitle')}</DialogTitle>
          <DialogDescription>
            {t('admin.uploadLogoDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="flex flex-col items-center gap-4">
            <div className="h-32 w-32 rounded-lg border bg-card flex items-center justify-center overflow-hidden">
              {logoPreview ? (
                <img src={logoPreview} alt="App icon preview" className="h-full w-full object-cover" />
              ) : app.iconUrl ? (
                <img src={app.iconUrl} alt={app.name} className="h-full w-full object-cover" />
              ) : (
                <ImageIcon className="h-10 w-10 text-muted-foreground" />
              )}
            </div>
            <Input
              id="logoUpload"
              type="file"
              onChange={handleLogoChange}
              accept="image/*"
            />
            <p className="text-xs text-center text-muted-foreground">
              {t('admin.logoUploadHint')}
            </p>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              type="button" 
              onClick={onClose}
              disabled={isLoading}
            >
              {t('admin.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !logoFile}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('admin.uploading')}
                </>
              ) : (
                t('admin.uploadLogo')
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Delete App Dialog
export function DeleteAppDialog({ 
  isOpen, 
  onClose, 
  onConfirm,
  appName
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void;
  appName: string;
}) {
  const { t } = useLanguage();
  
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('admin.confirmDeleteTitle')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('admin.confirmDeleteDescription', { appName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-destructive text-destructive-foreground">
            {t('admin.deleteApp')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}