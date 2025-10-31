import { Prisma } from '@prisma/client';
import prisma from '../../core/services/prisma.service';

export const getAllProducts = async (categorySlug?: string) => {
  const where: Prisma.ProductWhereInput = {};

  if (categorySlug && categorySlug !== 'tum-urunler') {
    where.category = {
      slug: categorySlug,
    };
  }

  const products = await prisma.product.findMany({
    where,
    include: {
      category: true, // Her ürünün kategori bilgisini de getir
    },
  });
  return products;
};

export const getProductBySlug = async (slug: string) => {
  const product = await prisma.product.findFirst({
    where: {
      slug,
    },
    include: {
      category: true,
    },
  });
  return product;
};

export const createProduct = async (productData: Prisma.ProductCreateInput) => {
  const newProduct = await prisma.product.create({
    data: productData,
  });
  return newProduct;
};
