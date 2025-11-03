import { Prisma } from '@prisma/client';
import prisma from '../../core/services/prisma.service';

/**
 * Tüm ürünleri getirir veya belirli bir kategorideki ürünleri filtreler.
 * Kullanım: Frontend'de ürün listesi göstermek, admin panelinde ürün yönetimi.
 * 
 * @param categorySlug - Opsiyonel. Kategori slug'ı (örn: "protein", "spor-gidalari")
 * @returns Ürün listesi ve kategori bilgileri
 */
export const getAllProducts = async (categorySlug?: string) => {
  const where: Prisma.ProductWhereInput = {};

  // Eğer kategori slug'ı varsa ve "tum-urunler" değilse filtre uygula
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

/**
 * Slug'a göre tek bir ürün getirir.
 * Kullanım: Frontend'de ürün detay sayfası göstermek.
 * 
 * @param slug - Ürün slug'ı (örn: "whey-protein")
 * @returns Ürün ve kategori bilgisi (varsa null)
 */
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

/**
 * Yeni bir ürün oluşturur.
 * Kullanım: Admin panelinde ürün ekleme işlemi.
 * 
 * @param productData - Ürün verisi (isim, fiyat, kategori, vs.)
 * @returns Oluşturulan ürün
 */
export const createProduct = async (productData: Prisma.ProductCreateInput) => {
  const newProduct = await prisma.product.create({
    data: productData,
  });
  return newProduct;
};

/**
 * Bir ürünü günceller.
 * Kullanım: Admin panelinde ürün düzenleme işlemi.
 * 
 * @param productId - Güncellenecek ürünün ID'si
 * @param productData - Güncellenecek ürün verisi
 * @returns Güncellenmiş ürün
 */
export const updateProduct = async (productId: string, productData: Prisma.ProductUpdateInput) => {
  const updatedProduct = await prisma.product.update({
    where: { id: productId },
    data: productData,
  });
  return updatedProduct;
};

/**
 * Bir ürünü veritabanından siler.
 * Kullanım: Admin panelinde ürün silme işlemi.
 * 
 * @param productId - Silinecek ürünün ID'si
 */
export const deleteProduct = async (productId: string) => {
  await prisma.product.delete({
    where: { id: productId },
  });
};
