import express, { Request, Response, NextFunction } from 'express';
import * as CategoryService from './categories.service';

export const categoriesRouter = express.Router();

// GET /api/categories - Tüm kategorileri getir (herkes erişebilir)
categoriesRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await CategoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
});

// GET /api/categories/:id - Tek bir kategori getir
categoriesRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await CategoryService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    next(error);
  }
});

