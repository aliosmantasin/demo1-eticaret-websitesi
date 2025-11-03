import express, { Response, NextFunction } from 'express';
import { z } from 'zod';
import * as CartService from './cart.service';
import { authenticateToken, AuthenticatedRequest } from '../../core/middleware/auth.middleware';

export const cartRouter = express.Router();

const AddToCartSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

const UpdateQuantitySchema = z.object({
  quantity: z.number().int().positive(),
});

// Sepeti getir
cartRouter.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const cart = await CartService.getOrCreateCart(req.userId);
    res.json(cart);
  } catch (error) {
    next(error);
  }
});

// Sepete ürün ekle
cartRouter.post('/items', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { productId, quantity } = AddToCartSchema.parse(req.body);
    const cartItem = await CartService.addItemToCart(req.userId, productId, quantity);
    res.status(201).json(cartItem);
  } catch (error) {
    next(error);
  }
});

// Sepet öğesinin adetini güncelle
cartRouter.patch('/items/:itemId', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { itemId } = req.params;
    const { quantity } = UpdateQuantitySchema.parse(req.body);
    const updatedItem = await CartService.updateCartItemQuantity(itemId, quantity);
    res.json(updatedItem);
  } catch (error) {
    next(error);
  }
});

// Sepet öğesini sil
cartRouter.delete('/items/:itemId', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const { itemId } = req.params;
    await CartService.removeItemFromCart(itemId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// Sepeti boşalt
cartRouter.delete('/', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    await CartService.clearCart(req.userId);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

