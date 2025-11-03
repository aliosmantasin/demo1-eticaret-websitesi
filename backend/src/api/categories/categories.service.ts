import { Prisma } from '@prisma/client';
import prisma from '../../core/services/prisma.service';

/**
 * Tüm kategorileri getirir.
 * Kullanım: Frontend'de kategori listesi göstermek, admin panelinde kategori yönetimi.
 * 
 * @returns Kategori listesi
 */
export const getAllCategories = async () => {
  const categories = await prisma.category.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return categories;
};

/**
 * ID'ye göre tek bir kategori getirir.
 * Kullanım: Admin panelinde kategori düzenleme.
 * 
 * @param categoryId - Kategori ID'si
 * @returns Kategori (varsa null)
 */
export const getCategoryById = async (categoryId: string) => {
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
  });
  return category;
};

/**
 * Yeni bir kategori oluşturur.
 * Kullanım: Admin panelinde kategori ekleme işlemi.
 * 
 * @param categoryData - Kategori verisi (isim, slug)
 * @returns Oluşturulan kategori
 */
export const createCategory = async (categoryData: Prisma.CategoryCreateInput) => {
  const newCategory = await prisma.category.create({
    data: categoryData,
  });
  return newCategory;
};

/**
 * Bir kategoriyi günceller.
 * Kullanım: Admin panelinde kategori düzenleme işlemi.
 * 
 * @param categoryId - Güncellenecek kategorinin ID'si
 * @param categoryData - Güncellenecek kategori verisi
 * @returns Güncellenmiş kategori
 */
export const updateCategory = async (categoryId: string, categoryData: Prisma.CategoryUpdateInput) => {
  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: categoryData,
  });
  return updatedCategory;
};

/**
 * Bir kategoriyi veritabanından siler.
 * Kullanım: Admin panelinde kategori silme işlemi.
 * 
 * @param categoryId - Silinecek kategorinin ID'si
 */
export const deleteCategory = async (categoryId: string) => {
  await prisma.category.delete({
    where: { id: categoryId },
  });
};

