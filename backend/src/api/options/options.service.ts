import prisma from '../../core/services/prisma.service';
import { Prisma } from '@prisma/client';

// === Option Servisleri ===

export const getAllOptions = async () => {
  return prisma.option.findMany({
    include: { values: true },
    orderBy: { createdAt: 'asc' },
  });
};

export const createOption = async (data: Prisma.OptionCreateInput) => {
  return prisma.option.create({
    data,
  });
};

export const updateOption = async (id: string, data: Prisma.OptionUpdateInput) => {
  return prisma.option.update({
    where: { id },
    data,
  });
};

export const deleteOption = async (id: string) => {
  // İlişkili OptionValue'lar schema'da onDelete: Cascade olduğu için otomatik silinecektir.
  return prisma.option.delete({
    where: { id },
  });
};


// === OptionValue Servisleri ===

export const createOptionValue = async (data: Prisma.OptionValueUncheckedCreateInput) => {
  return prisma.optionValue.create({
    data,
  });
};

export const updateOptionValue = async (id: string, data: Prisma.OptionValueUpdateInput) => {
  return prisma.optionValue.update({
    where: { id },
    data,
  });
};

export const deleteOptionValue = async (id: string) => {
  return prisma.optionValue.delete({
    where: { id },
  });
};

