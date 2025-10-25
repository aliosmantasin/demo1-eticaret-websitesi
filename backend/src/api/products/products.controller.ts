import express, { Request, Response, NextFunction } from 'express';
import * as ProductService from './products.service';

export const productsRouter = express.Router();

productsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await ProductService.getAllProducts();
    res.json(products);
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
