import express, { Response, NextFunction } from 'express';
import * as ProductService from '../products/products.service';
import * as CategoryService from '../categories/categories.service';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../../core/middleware/auth.middleware';

export const adminRouter = express.Router();

// Tüm admin route'larını koru
adminRouter.use(authenticateToken);
adminRouter.use(requireAdmin);

// POST /api/admin/products - Yeni ürün ekle
adminRouter.post('/products', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const productData = req.body;
    const newProduct = await ProductService.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id - Ürün güncelle
adminRouter.put('/products/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const productData = req.body;
    const updatedProduct = await ProductService.updateProduct(id, productData);
    res.json(updatedProduct);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/products/:id - Ürün sil
adminRouter.delete('/products/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await ProductService.deleteProduct(id);
    res.json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/categories - Yeni kategori ekle
adminRouter.post('/categories', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const categoryData = req.body;
    const newCategory = await CategoryService.createCategory(categoryData);
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/categories/:id - Kategori güncelle
adminRouter.put('/categories/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const categoryData = req.body;
    const updatedCategory = await CategoryService.updateCategory(id, categoryData);
    res.json(updatedCategory);
  } catch (error) {
    next(error);
  }
});

// DELETE /api/admin/categories/:id - Kategori sil
adminRouter.delete('/categories/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await CategoryService.deleteCategory(id);
    res.json({ message: 'Kategori başarıyla silindi' });
  } catch (error) {
    next(error);
  }
});

