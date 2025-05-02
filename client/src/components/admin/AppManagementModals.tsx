import React, { useState, useRef } from 'react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('admin.addNewApp')}</DialogTitle>
          <DialogDescription>
            {t('admin.addNewAppDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id">{t('admin.appId')}</Label>
              <Input 
                id="id" 
                name="id" 
                placeholder="e.g., tiktok, netflix" 
                value={formData.id} 
                onChange={handleChange}
                required
              />
              <p className="text-xs text-gray-500">{t('admin.appIdDescription')}</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="name">{t('admin.appName')}</Label>
              <Input 
                id="name" 
                name="name" 
                placeholder="e.g., TikTok, Netflix" 
                value={formData.name} 
                onChange={handleChange}
                required
              />
            </div>
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
                {categories.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('admin.description')}</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder={t('admin.descriptionPlaceholder')}
              value={formData.description} 
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">{t('admin.rating')}</Label>
              <Input 
                id="rating" 
                name="rating" 
                type="number" 
                min="0" 
                max="5" 
                step="0.1" 
                value={formData.rating.toString()} 
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="version">{t('admin.version')}</Label>
              <Input 
                id="version" 
                name="version" 
                placeholder="e.g., 1.0.0" 
                value={formData.version} 
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="googlePlayUrl">{t('admin.googlePlayUrl')}</Label>
              <Input 
                id="googlePlayUrl" 
                name="googlePlayUrl" 
                placeholder="https://play.google.com/store/apps/..." 
                value={formData.googlePlayUrl} 
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="iosAppStoreUrl">{t('admin.iosAppStoreUrl')}</Label>
              <Input 
                id="iosAppStoreUrl" 
                name="iosAppStoreUrl" 
                placeholder="https://apps.apple.com/app/..." 
                value={formData.iosAppStoreUrl || ''} 
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="developer">{t('admin.developer')}</Label>
            <Input 
              id="developer" 
              name="developer" 
              placeholder="e.g., Google LLC" 
              value={formData.developer} 
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="logo">{t('admin.appLogo')}</Label>
            <div className="flex items-center space-x-4">
              {logoPreview && (
                <div className="w-16 h-16 rounded-md overflow-hidden">
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <Input 
                id="logo" 
                name="logo" 
                type="file" 
                accept="image/*"
                onChange={handleLogoChange}
              />
            </div>
            <p className="text-xs text-gray-500">{t('admin.logoDescription')}</p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('admin.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('admin.creating') : t('admin.createApp')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Edit App Modal
export function EditAppModal({ 
  isOpen, 
  onClose, 
  app,
  onAppUpdated 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  app: AppLegacy;
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
    googlePlayUrl: app.googlePlayUrl,
    iosAppStoreUrl: app.iosAppStoreUrl || '',
    developer: app.developer,
    version: app.version,
    size: app.size,
    requires: app.requires,
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t('admin.editApp')}: {app.name}</DialogTitle>
          <DialogDescription>
            {t('admin.editAppDescription')}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
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
                {categories.map((category: Category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">{t('admin.description')}</Label>
            <Textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleChange}
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="rating">{t('admin.rating')}</Label>
              <Input 
                id="rating" 
                name="rating" 
                type="number" 
                min="0" 
                max="5" 
                step="0.1" 
                value={formData.rating.toString()} 
                onChange={handleChange}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="version">{t('admin.version')}</Label>
              <Input 
                id="version" 
                name="version" 
                value={formData.version} 
                onChange={handleChange}
              />
            </div>
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

          <div className="space-y-2">
            <Label htmlFor="developer">{t('admin.developer')}</Label>
            <Input 
              id="developer" 
              name="developer" 
              value={formData.developer} 
              onChange={handleChange}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              {t('admin.cancel')}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? t('admin.updating') : t('admin.updateApp')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Logo Upload Modal
export function LogoUploadModal({ 
  isOpen, 
  onClose, 
  app,
  onLogoUploaded 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  app: AppLegacy;
  onLogoUploaded: () => void;
}) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(app.iconUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoUrlInput, setLogoUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'url'>('upload');

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
    
    if (!logoFile) {
      toast({
        variant: 'destructive',
        title: t('admin.noLogoSelected'),
        description: t('admin.pleaseSelectLogo'),
      });
      return;
    }

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
        title: t('admin.logoUploaded'),
        description: t('admin.logoUploadedDescription'),
      });

      queryClient.invalidateQueries({ queryKey: ['/api/admin/apps'] });
      onLogoUploaded();
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

  const handleDirectUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!logoUrlInput) {
      toast({
        variant: 'destructive',
        title: t('admin.noUrlProvided'),
        description: t('admin.pleaseProvideUrl'),
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/admin/apps/${app.id}/logo-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ logoUrl: logoUrlInput }),
      });

      if (!response.ok) {
        throw new Error('Failed to update logo URL');
      }

      toast({
        title: t('admin.logoUpdated'),
        description: t('admin.logoUpdatedFromUrl'),
      });

      queryClient.invalidateQueries({ queryKey: ['/api/admin/apps'] });
      onLogoUploaded();
    } catch (error) {
      console.error('Error updating logo URL:', error);
      toast({
        variant: 'destructive',
        title: t('admin.logoUpdateError'),
        description: t('admin.logoUpdateErrorDescription'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{t('admin.updateAppLogo')}: {app.name}</DialogTitle>
          <DialogDescription>
            {t('admin.updateAppLogoDescription')}
          </DialogDescription>
        </DialogHeader>

        <div className="my-4 flex border-b">
          <button
            className={`px-4 py-2 ${activeTab === 'upload' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('upload')}
          >
            {t('admin.uploadImage')}
          </button>
          <button
            className={`px-4 py-2 ${activeTab === 'url' ? 'border-b-2 border-primary' : ''}`}
            onClick={() => setActiveTab('url')}
          >
            {t('admin.useImageUrl')}
          </button>
        </div>

        {activeTab === 'upload' ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-32 h-32 rounded-md overflow-hidden border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50">
                {logoPreview ? (
                  <img 
                    src={logoPreview} 
                    alt="Logo preview" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-500 text-center p-4">
                    {t('admin.noLogoSelected')}
                  </div>
                )}
              </div>
              
              <Input 
                id="logo" 
                name="logo" 
                type="file" 
                accept="image/*"
                ref={fileInputRef}
                onChange={handleLogoChange}
                className="max-w-[300px]"
              />
              
              <p className="text-xs text-gray-500 text-center max-w-[300px]">
                {t('admin.logoUploadInfo')}
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t('admin.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('admin.uploading') : t('admin.uploadLogo')}
              </Button>
            </DialogFooter>
          </form>
        ) : (
          <form onSubmit={handleDirectUrlSubmit} className="space-y-6">
            <div className="space-y-4">
              <Label htmlFor="logoUrl">{t('admin.logoUrl')}</Label>
              <Input 
                id="logoUrl" 
                placeholder="https://example.com/logo.png" 
                value={logoUrlInput} 
                onChange={(e) => setLogoUrlInput(e.target.value)}
                required
              />
              
              <p className="text-xs text-gray-500">
                {t('admin.logoUrlDescription')}
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                {t('admin.cancel')}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? t('admin.updating') : t('admin.useLogo')}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}

// Delete App Confirmation Dialog
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
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('admin.confirmDelete')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('admin.deleteAppWarning', { appName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('admin.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} className="bg-red-600 hover:bg-red-700">
            {t('admin.delete')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}