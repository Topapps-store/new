import { Request, Response } from 'express';
import { db } from '../db';
import { categories } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { log } from '../vite';

/**
 * Create a new category
 */
export async function createCategory(req: Request, res: Response) {
  try {
    const { id, name, icon, color } = req.body;

    if (!id || !name) {
      return res.status(400).json({ error: 'Category ID and name are required' });
    }

    // Validate ID format (only lowercase alphanumeric characters and hyphens)
    if (!/^[a-z0-9-]+$/.test(id)) {
      return res.status(400).json({ error: 'Category ID must contain only lowercase letters, numbers, and hyphens' });
    }

    // Check if category with this ID already exists
    const [existingCategory] = await db.select().from(categories).where(eq(categories.id, id));
    if (existingCategory) {
      return res.status(409).json({ error: 'Category with this ID already exists' });
    }

    // Insert category
    const [newCategory] = await db.insert(categories).values({
      id,
      name,
      icon,
      color,
    }).returning();

    return res.status(201).json(newCategory);
  } catch (error) {
    log(`Error creating category: ${error}`, 'error');
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Delete a category
 */
export async function deleteCategory(req: Request, res: Response) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: 'Category ID is required' });
    }

    // Check if category exists
    const [existingCategory] = await db.select().from(categories).where(eq(categories.id, id));
    if (!existingCategory) {
      return res.status(404).json({ error: 'Category not found' });
    }

    // Delete category
    await db.delete(categories).where(eq(categories.id, id));

    return res.status(200).json({ success: true });
  } catch (error) {
    log(`Error deleting category: ${error}`, 'error');
    return res.status(500).json({ error: 'Server error' });
  }
}

/**
 * Get all categories
 */
export async function getAllCategories(req: Request, res: Response) {
  try {
    const allCategories = await db.select().from(categories);
    return res.status(200).json(allCategories);
  } catch (error) {
    log(`Error getting categories: ${error}`, 'error');
    return res.status(500).json({ error: 'Server error' });
  }
}