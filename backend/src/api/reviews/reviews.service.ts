import { Prisma } from '@prisma/client';
import prisma from '../../core/services/prisma.service';

interface CreateReviewInput {
  rating: number;
  title: string | null;
  comment: string;
  user: { connect: { id: string } };
  product: { connect: { id: string } };
}

/**
 * Bir ürüne ait tüm yorumları getirir.
 * Kullanım: Ürün detay sayfasında yorumları göstermek.
 * 
 * @param productId - Ürün ID'si
 * @returns Yorum listesi (kullanıcı bilgileri ile birlikte)
 */
export const getReviewsByProductId = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
  return reviews;
};

/**
 * Yeni bir yorum oluşturur.
 * Kullanım: Kullanıcıların ürün yorumu yapması.
 * 
 * @param reviewData - Yorum verisi (userId, productId, rating, title, comment)
 * @returns Oluşturulan yorum
 */
export const createReview = async (reviewData: CreateReviewInput) => {
  const newReview = await prisma.review.create({
    data: reviewData,
    include: {
      user: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      },
    },
  });

  // Ürünün yorum sayısını ve ortalama puanını güncelle
  await updateProductReviewStats(reviewData.product.connect?.id || '');

  return newReview;
};

/**
 * Bir yorumu siler.
 * Kullanım: Admin panelinde yorum silme işlemi.
 * 
 * @param reviewId - Silinecek yorumun ID'si
 */
export const deleteReview = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
  });

  if (!review) {
    throw new Error('Yorum bulunamadı');
  }

  await prisma.review.delete({
    where: { id: reviewId },
  });

  // Ürünün yorum sayısını ve ortalama puanını güncelle
  await updateProductReviewStats(review.productId);
};

/**
 * Ürünün yorum sayısını ve ortalama puanını hesaplar ve günceller.
 * 
 * @param productId - Ürün ID'si
 */
const updateProductReviewStats = async (productId: string) => {
  const reviews = await prisma.review.findMany({
    where: { productId },
    select: { rating: true },
  });

  const commentCount = reviews.length;
  const averageStar = reviews.length > 0
    ? reviews.reduce((sum: number, r) => sum + r.rating, 0) / reviews.length
    : 0;

  await prisma.product.update({
    where: { id: productId },
    data: {
      comment_count: commentCount,
      average_star: averageStar,
    },
  });
};

