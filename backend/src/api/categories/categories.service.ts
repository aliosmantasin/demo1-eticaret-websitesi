import { Prisma } from '@prisma/client';
import prisma from '../../core/services/prisma.service';

/**
 * Tüm kategorileri getirir.
 * Kullanım: Frontend'de kategori listesi göstermek, admin panelinde kategori yönetimi.
 * 
 * @returns Kategori listesi
 */
export const getAllCategories = async () => {
  return prisma.category.findMany({
    include: {
      image: true, // İlişkili görseli de getir
    },
    orderBy: {
      createdAt: 'asc',
    },
  });
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

interface CategoryData {
  name: string;
  slug: string;
  imageId?: string | null;
  showInNavbar?: boolean;
}

/**
 * Yeni bir kategori oluşturur.
 * Kullanım: Admin panelinde kategori ekleme işlemi.
 * 
 * @param categoryData - Kategori verisi (isim, slug)
 * @returns Oluşturulan kategori
 */
export const createCategory = async (categoryData: CategoryData) => {
  const { imageId, ...data } = categoryData;
  const newCategory = await prisma.category.create({
    data: {
      ...data,
      ...(imageId && { image: { connect: { id: imageId } } }),
    },
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
export const updateCategory = async (categoryId: string, categoryData: CategoryData) => {
  const { imageId, showInNavbar, ...data } = categoryData;
  
  console.log('updateCategory - Gelen veri:', JSON.stringify({ categoryId, showInNavbar, imageId }, null, 2));
  
  const updateData: any = {
    ...data,
  };
  
  // showInNavbar alanını ekle (undefined değilse)
  // false değeri de geçerli bir değer olduğu için kontrol ediyoruz
  if (showInNavbar !== undefined && showInNavbar !== null) {
    updateData.showInNavbar = showInNavbar;
  }
  
  // imageId işlemi
  if (imageId !== undefined) {
    updateData.image = imageId ? { connect: { id: imageId } } : { disconnect: true };
  }
  
  console.log('updateCategory - Prisma update data:', JSON.stringify(updateData, null, 2));
  
  const updatedCategory = await prisma.category.update({
    where: { id: categoryId },
    data: updateData,
  });
  
  console.log('updateCategory - Güncellenmiş kategori:', JSON.stringify({ id: updatedCategory.id, showInNavbar: (updatedCategory as any).showInNavbar }, null, 2));
  
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

