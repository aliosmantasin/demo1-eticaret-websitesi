import { Prisma, PrismaClient } from '@prisma/client';
import prisma from '../../core/services/prisma.service';

export const getAllProducts = async () => {
  const products = await prisma.product.findMany({
    include: {
      category: true, // Her ürünün kategori bilgisini de getir
    },
  });
  return products;
};

export const createProduct = async (productData: Prisma.ProductCreateInput) => {
  const newProduct = await prisma.product.create({
    data: productData,
  });
  return newProduct;
};
