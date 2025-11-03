import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as ReviewService from './reviews.service';
import { authenticateToken, AuthenticatedRequest } from '../../core/middleware/auth.middleware';

export const reviewsRouter = express.Router();

// Tüm yorumları getir (korumalı değil, herkes görebilir)
reviewsRouter.get('/product/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { productId } = req.params;
    const reviews = await ReviewService.getReviewsByProductId(productId);
    res.json(reviews);
  } catch (error) {
    next(error);
  }
});

// Yeni yorum oluştur (sadece giriş yapmış kullanıcılar)
reviewsRouter.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const ReviewSchema = z.object({
      productId: z.string(),
      rating: z.number().min(1).max(5),
      title: z.string().optional(),
      comment: z.string().min(1, 'Yorum boş olamaz'),
    });

    const { productId, rating, title, comment } = ReviewSchema.parse(req.body);

    const review = await ReviewService.createReview({
      rating,
      title: title || null,
      comment,
      user: {
        connect: { id: req.userId! },
      },
      product: {
        connect: { id: productId },
      },
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
});

// Yorum sil (sadece giriş yapmış kullanıcılar - kendi yorumları veya admin)
reviewsRouter.delete('/:reviewId', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await ReviewService.deleteReview(req.params.reviewId);
    res.json({ message: 'Yorum başarıyla silindi' });
  } catch (error) {
    next(error);
  }
});

