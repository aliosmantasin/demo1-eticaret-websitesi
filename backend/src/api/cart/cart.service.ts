import prisma from '../../core/services/prisma.service';

// Kullanıcının sepetini oluştur veya getir
export const getOrCreateCart = async (userId: string) => {
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            include: {
              category: true,
              images: true,
            },
          },
          variant: {
            include: {
              optionValues: {
                include: {
                  option: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                category: true,
                images: true,
              },
            },
            variant: {
              include: {
                optionValues: {
                  include: {
                    option: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  return cart;
};

// Sepete ürün ekle veya adet artır
export const addItemToCart = async (userId: string, productId: string, quantity: number, variantId?: string) => {
  const cart = await getOrCreateCart(userId);

  // Ürünün bu varyantının sepette olup olmadığını kontrol et
  const existingItem = await prisma.cartItem.findFirst({
    where: {
        cartId: cart.id,
      productId: productId,
      variantId: variantId || null,
    },
  });

  if (existingItem) {
    // Mevcut ise adet artır
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + quantity },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
    return updatedItem;
  } else {
    // Yeni ürün/varyant ekle
    const newItem = await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        productId,
        variantId: variantId || null,
        quantity,
      },
      include: {
        product: {
          include: {
            category: true,
          },
        },
      },
    });
    return newItem;
  }
};

// Sepet öğesinin adetini güncelle
export const updateCartItemQuantity = async (itemId: string, quantity: number) => {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  const updatedItem = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
    include: {
      product: {
        include: {
          category: true,
        },
      },
    },
  });

  return updatedItem;
};

// Sepet öğesini sil
export const removeItemFromCart = async (itemId: string) => {
  await prisma.cartItem.delete({
    where: { id: itemId },
  });
};

// Sepeti boşalt
export const clearCart = async (userId: string) => {
  const cart = await getOrCreateCart(userId);
  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });
};

