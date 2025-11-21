import { Prisma } from '@prisma/client';
import prisma from '../../core/services/prisma.service';

// Prisma'nın nested update tiplerini kullanmak için tip tanımı
type ProductUpdateWithVariants = Omit<Prisma.ProductUpdateInput, 'variants'> & {
  variants?: {
    deleteMany?: {};
    create?: Prisma.ProductVariantCreateWithoutProductInput[];
  };
};

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
      images: true,   // Ürüne ait görselleri de getir
      variants: {     // Ürüne ait varyantları da getir
        include: {
          images: true, // Varyant görsellerini de dahil et
          optionValues: {
            include: {
              option: true,
            },
          },
        },
      },
    } as any, // TypeScript tip uyumsuzluğunu bypass et
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
    const product = await prisma.product.findUnique({
      where: { slug },
    include: {
      category: true,
        images: true,
        reviews: {
          include: {
            user: true,
    },
        },
        variants: {
          include: {
            images: true, // Varyantın özel görsellerini de getir
            optionValues: {
              include: {
                option: true,
              },
            },
          },
        },
    } as any, // TypeScript tip uyumsuzluğunu bypass et
  });
  
    if (!product) {
      return null;
    }
  
    // Ürünün tüm varyantlarındaki seçenekleri topla ve tekilleştir
    const optionsMap = new Map<string, { id: string; name: string; values: Map<string, { id: string; value: string; color: string | null }> }>();

    (product as any).variants?.forEach((variant: any) => {
      variant.optionValues?.forEach((ov: any) => {
        // Ana seçeneği (örn: Aroma) ekle
        if (!optionsMap.has(ov.option.id)) {
          optionsMap.set(ov.option.id, {
            id: ov.option.id,
            name: ov.option.name,
            values: new Map()
          });
        }
        
        // Seçeneğin değerini (örn: Çikolata) ekle
        const option = optionsMap.get(ov.option.id)!;
        if (!option.values.has(ov.id)) {
          option.values.set(ov.id, {
            id: ov.id,
            value: ov.value,
            color: (ov as any).color ?? null
          });
        }
      });
    });

    // Map'i tekrar dizi formatına çevir
    const options = Array.from(optionsMap.values()).map(opt => ({
      ...opt,
      values: Array.from(opt.values.values())
    }));

    return { ...product, options };
  };

// Bu tip, frontend'den gelen ham veriyi temsil eder
interface ProductData {
  name: string;
  slug: string;
  categoryId: string;
  short_explanation?: string;
  badge_primary_text?: string | null;
  badge_primary_hidden?: boolean;
  badge_secondary_text?: string | null;
  badge_secondary_hidden?: boolean;
  expiry_date?: string | null;
  features?: string | null;
  nutritional_content?: string | null;
  usage_instructions?: string | null;
  imageIds?: string[];
  variants?: {
    price: number;
    stock: number;
    discounted_price?: number | null; // Eklendi
    optionValues: { valueId: string }[];
    imageIds?: string[]; // Tekil imageId yerine imageIds dizisi
  }[];
}

/**
 * Creates a new product with its variants.
 * @param productData - The data for the new product.
 * @returns The newly created product.
 */
export const createProduct = async (productData: ProductData) => {
  const { imageIds, variants, categoryId, ...data } = productData;

  // Step 1: Create the product and its nested relations without a complex include.
  const newProduct = await prisma.product.create({
    data: {
      ...data,
      category: {
        connect: { id: categoryId },
      },
      images: {
        connect: imageIds?.map(id => ({ id })),
      },
      variants: {
        create: variants?.map(variant => ({
          price: variant.price,
          stock: variant.stock,
          discounted_price: variant.discounted_price,
          images: variant.imageIds && variant.imageIds.length > 0 ? {
            connect: variant.imageIds.map(id => ({ id }))
          } : undefined,
          optionValues: {
            // Boş valueId'leri filtrele - sadece geçerli olanları bağla
            connect: variant.optionValues
              .filter(ov => ov.valueId && ov.valueId.trim() !== '')
              .map(ov => ({ id: ov.valueId })),
          },
        })),
      },
    } as any, // TypeScript tip uyumsuzluğunu bypass et
  });

  // Step 2: Fetch the newly created product with all the desired relations included.
  // This avoids TypeScript inference issues with complex includes on create.
  return prisma.product.findUnique({
    where: { id: newProduct.id },
    include: {
      images: true,
      category: true,
      variants: {
        include: {
          optionValues: {
            include: {
              option: true,
            },
          },
        },
      },
    } as any, // TypeScript tip uyumsuzluğunu bypass et
  });
};


/**
 * Updates an existing product and its variants.
 * This function uses a transaction to ensure data integrity.
 * It first deletes all existing variants of the product,
 * then updates the product's scalar fields,
 * and finally creates the new variants provided in the input.
 *
 * @param id - The ID of the product to update.
 * @param productData - The new data for the product.
 * @returns The updated product with all its relations.
 */
export const updateProduct = async (id: string, productData: ProductData) => {
  const { categoryId, imageIds, variants, ...rest } = productData;

  // DEBUG: Gelen veriyi logla
  console.log('updateProduct - Gelen veri:', JSON.stringify({ id, variants }, null, 2));

  try {
    // Prisma'nın nested update syntax'ını kullanarak tip güvenli bir şekilde güncelleme yapıyoruz
    const updateData: ProductUpdateWithVariants = {
      ...rest,
      category: categoryId ? { connect: { id: categoryId } } : undefined,
      images: {
        set: imageIds?.map(id => ({ id }))
      },
      variants: variants && variants.length > 0 ? {
        deleteMany: {}, // Önce mevcut tüm varyantları sil
        create: variants.map(variant => ({
          price: variant.price,
          stock: variant.stock,
          discounted_price: variant.discounted_price,
          optionValues: {
            connect: variant.optionValues.map(ov => ({ id: ov.valueId }))
          },
          images: variant.imageIds && variant.imageIds.length > 0 ? {
            connect: variant.imageIds.map(id => ({ id }))
          } : undefined
        }))
      } : {
        deleteMany: {} // Eğer varyant yoksa sadece mevcut varyantları sil
      }
    };

    const result = await prisma.product.update({
      where: { id },
      data: updateData as Prisma.ProductUpdateInput, // Prisma'nın kendi tipine cast ediyoruz
      include: {
        images: true,
        category: true,
        variants: {
          include: {
            images: true, // Varyant görsellerini de dahil et
            optionValues: {
              include: {
                option: true,
              },
            },
          },
        },
      } as Prisma.ProductInclude, // Prisma'nın include tipine cast ediyoruz
    });

    // Prisma'nın include ile döndüğü tipi kullanarak tip güvenli bir şekilde erişiyoruz
    const variantCount = 'variants' in result && Array.isArray(result.variants) ? result.variants.length : 0;
    const variantIds = 'variants' in result && Array.isArray(result.variants) 
      ? result.variants.map((v) => v.id) 
      : [];
    console.log('updateProduct - Prisma işlemi başarılı, dönen sonuç:', JSON.stringify({ 
      productId: result.id, 
      variantCount,
      variantIds
    }, null, 2));
    
    return result;
  } catch (error) {
    console.error('updateProduct - Prisma hatası:', error);
    console.error('updateProduct - Hata mesajı:', error instanceof Error ? error.message : String(error));
    console.error('updateProduct - Hata stack:', error instanceof Error ? error.stack : 'N/A');
    throw error;
  }
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
