import express, { Request, Response, NextFunction } from 'express';
import * as ProductService from './products.service';

export const productsRouter = express.Router();

productsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.query;
    const products = await ProductService.getAllProducts(category as string | undefined);
    res.json(products);
  } catch (error) {
    next(error);
  }
});

productsRouter.get('/:slug', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slug } = req.params;
    const product = await ProductService.getProductBySlug(slug);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
});

productsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const productData = req.body;
    const newProduct = await ProductService.createProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    next(error);
  }
});
