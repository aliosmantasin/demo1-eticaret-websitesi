import express, { Response, NextFunction } from 'express';
import * as ProductService from '../products/products.service';
import * as CategoryService from '../categories/categories.service';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../../core/middleware/auth.middleware';
import optionsRouter from '../options/options.controller';

export const adminRouter = express.Router();

// Tüm admin route'larını koru
adminRouter.use(authenticateToken);
adminRouter.use(requireAdmin);

// Options rotalarını /options altında kullan
adminRouter.use('/options', optionsRouter);

// === Product Management ===

// POST /api/admin/products - Yeni ürün ekle
adminRouter.post('/products', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const newProduct = await ProductService.createProduct(req.body);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/products/:id - Ürünü güncelle
adminRouter.put('/products/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    console.log('PUT /api/admin/products/:id - İstek alındı, productId:', req.params.id);
    console.log('PUT /api/admin/products/:id - Gelen body:', JSON.stringify(req.body, null, 2));
    const updatedProduct = await ProductService.updateProduct(req.params.id, req.body);
    const variantCount = (updatedProduct as any)?.variants?.length || 0;
    console.log('PUT /api/admin/products/:id - Güncelleme başarılı, dönen ürün:', JSON.stringify({ id: updatedProduct?.id, variantCount }, null, 2));
    res.json(updatedProduct);
  } catch (error) {
    console.error('PUT /api/admin/products/:id - HATA:', error);
    console.error('PUT /api/admin/products/:id - Hata detayı:', error instanceof Error ? error.message : String(error));
    console.error('PUT /api/admin/products/:id - Hata stack:', error instanceof Error ? error.stack : 'N/A');
    next(error);
  }
});

// DELETE /api/admin/products/:id - Ürünü sil
adminRouter.delete('/products/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await ProductService.deleteProduct(req.params.id);
    res.json({ message: 'Ürün başarıyla silindi' });
  } catch (error) {
    next(error);
  }
});

// === Category Management ===

// POST /api/admin/categories - Yeni kategori ekle
adminRouter.post('/categories', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const newCategory = await CategoryService.createCategory(req.body);
    res.status(201).json(newCategory);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/categories/:id - Kategoriyi güncelle
adminRouter.put('/categories/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    console.log('PUT /api/admin/categories/:id - İstek alındı, categoryId:', req.params.id);
    console.log('PUT /api/admin/categories/:id - Gelen body:', JSON.stringify(req.body, null, 2));
    const updatedCategory = await CategoryService.updateCategory(req.params.id, req.body);
    console.log('PUT /api/admin/categories/:id - Güncelleme başarılı');
    res.json(updatedCategory);
  } catch (error) {
    console.error('PUT /api/admin/categories/:id - HATA:', error);
    console.error('PUT /api/admin/categories/:id - Hata detayı:', error instanceof Error ? error.message : String(error));
    next(error);
  }
});

// DELETE /api/admin/categories/:id - Kategoriyi sil
adminRouter.delete('/categories/:id', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await CategoryService.deleteCategory(req.params.id);
    res.json({ message: 'Kategori başarıyla silindi' });
  } catch (error) {
    next(error);
  }
});