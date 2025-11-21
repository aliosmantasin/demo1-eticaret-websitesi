import { FooterLinkSection } from '@prisma/client';
import prisma from '../../core/services/prisma.service';

export const getFooterLinks = async (section?: FooterLinkSection) => {
  return prisma.footerLink.findMany({
    where: section ? { section } : undefined,
    orderBy: { order: 'asc' },
  });
};

export const createFooterLink = async (data: {
  text: string;
  url: string;
  order?: number;
  section: FooterLinkSection;
}) => {
  return prisma.footerLink.create({
    data,
  });
};

export const updateFooterLink = async (
  id: string,
  data: {
    text?: string;
    url?: string;
    order?: number;
    section?: FooterLinkSection;
  },
) => {
  return prisma.footerLink.update({
    where: { id },
    data,
  });
};

export const deleteFooterLink = async (id: string) => {
  await prisma.footerLink.delete({
    where: { id },
  });
};

