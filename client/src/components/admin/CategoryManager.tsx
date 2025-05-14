import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/LanguageContext';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2, Plus, Trash2 } from 'lucide-react';
import type { Category, InsertCategory } from '@shared/schema';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { apiRequest } from '@/lib/queryClient';

interface CategoryManagerProps {
  onCategoryAdded?: () => void;
}

export function CategoryManager({ onCategoryAdded }: CategoryManagerProps) {
  const { t } = useLanguage();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [categoryId, setCategoryId] = useState('');
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('');
  const [categoryColor, setCategoryColor] = useState('#4caf50');
  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  // Fetch categories
  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
    retry: false,
  });

  const handleCreate = async () => {
    if (!categoryId || !categoryName) {
      toast({
        variant: 'destructive',
        title: t('admin.missingFields'),
        description: t('admin.pleaseProvideIdAndName'),
      });
      return;
    }

    if (!/^[a-z0-9-]+$/.test(categoryId)) {
      toast({
        variant: 'destructive',
        title: t('admin.invalidCategoryId'),
        description: t('admin.categoryIdFormat'),
      });
      return;
    }

    if (categories.some(c => c.id === categoryId)) {
      toast({
        variant: 'destructive',
        title: t('admin.categoryExists'),
        description: t('admin.categoryIdAlreadyExists'),
      });
      return;
    }

    setIsCreating(true);

    try {
      const newCategory: InsertCategory = {
        id: categoryId,
        name: categoryName,
        icon: categoryIcon || undefined,
        color: categoryColor || undefined,
      };

      await apiRequest('/api/admin/categories', {
        method: 'POST',
        body: JSON.stringify(newCategory),
      });

      toast({
        title: t('admin.categoryCreated'),
        description: t('admin.categoryAddedSuccessfully'),
      });

      // Reset form
      setCategoryId('');
      setCategoryName('');
      setCategoryIcon('');
      setCategoryColor('#4caf50');

      // Invalidate queries to refresh category list
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });

      // Notify parent if callback provided
      if (onCategoryAdded) {
        onCategoryAdded();
      }
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        variant: 'destructive',
        title: t('admin.categoryCreateFailed'),
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (!confirm(t('admin.confirmCategoryDelete'))) {
      return;
    }

    setIsDeleting(categoryId);

    try {
      await apiRequest(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      toast({
        title: t('admin.categoryDeleted'),
        description: t('admin.categoryDeletedSuccessfully'),
      });

      // Invalidate queries to refresh category list
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        variant: 'destructive',
        title: t('admin.categoryDeleteFailed'),
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.addCategory')}</CardTitle>
          <CardDescription>
            {t('admin.createCustomCategory')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="categoryId">{t('admin.categoryId')}</Label>
              <Input
                id="categoryId"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value.toLowerCase())}
                placeholder="category-id"
                disabled={isCreating}
              />
              <p className="text-xs text-muted-foreground">
                {t('admin.categoryIdHelp')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryName">{t('admin.categoryName')}</Label>
              <Input
                id="categoryName"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Category Name"
                disabled={isCreating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryIcon">{t('admin.categoryIcon')} ({t('admin.optional')})</Label>
              <Input
                id="categoryIcon"
                value={categoryIcon}
                onChange={(e) => setCategoryIcon(e.target.value)}
                placeholder="fa-icons-name"
                disabled={isCreating}
              />
              <p className="text-xs text-muted-foreground">
                {t('admin.categoryIconHelp')}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="categoryColor">{t('admin.categoryColor')} ({t('admin.optional')})</Label>
              <div className="flex space-x-2">
                <Input
                  id="categoryColor"
                  type="color"
                  value={categoryColor}
                  onChange={(e) => setCategoryColor(e.target.value)}
                  className="w-12 h-10 p-1"
                  disabled={isCreating}
                />
                <Input
                  value={categoryColor}
                  onChange={(e) => setCategoryColor(e.target.value)}
                  placeholder="#4caf50"
                  disabled={isCreating}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <Button
            onClick={handleCreate}
            disabled={isCreating || !categoryId || !categoryName}
            className="w-full mt-4"
          >
            {isCreating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('admin.creating')}
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" />
                {t('admin.createCategory')}
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('admin.existingCategories')}</CardTitle>
          <CardDescription>
            {t('admin.manageCategoriesHelp')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">
              {t('admin.noCategories')}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('admin.id')}</TableHead>
                  <TableHead>{t('admin.name')}</TableHead>
                  <TableHead className="text-right">{t('admin.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-mono">{category.id}</TableCell>
                    <TableCell>{category.name}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(category.id)}
                        disabled={isDeleting === category.id}
                      >
                        {isDeleting === category.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                        <span className="sr-only">{t('admin.delete')}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}