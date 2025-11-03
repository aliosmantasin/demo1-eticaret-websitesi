import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../core/services/prisma.service';
import { z } from 'zod';

// Servisin ihtiyaç duyduğu veri yapısını tanımlıyoruz.
// Bu, controller'daki Zod şemasından bağımsızdır.
interface CreateUserInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

// Extend LoginSchema to be used in the service
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
type LoginUserInput = z.infer<typeof LoginSchema>;

export const createUser = async (userData: CreateUserInput) => {
  const { email, password, firstName, lastName } = userData;

  // E-postanın zaten kayıtlı olup olmadığını kontrol et
  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    // Zaten kayıtlı bir e-posta varsa hata fırlat
    throw new Error('This email is already registered.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  
  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      firstName,
      lastName,
    },
  });
  return newUser;
};

export const loginUser = async (loginData: LoginUserInput) => {
  const { email, password } = loginData;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Invalid email or password');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // NOTE: JWT_SECRET should be in .env file in a real application
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '1h',
  });

  return { token };
};

/**
 * Kullanıcı bilgilerini getirir.
 * Kullanım: JWT token'dan kullanıcı profilini çekmek.
 * 
 * @param userId - Kullanıcı ID'si
 * @returns Kullanıcı bilgileri (şifre hariç)
 */
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

/**
 * Kullanıcı bilgilerini günceller.
 * Kullanım: Profil sayfasında ad-soyad güncelleme işlemi.
 * 
 * @param userId - Güncellenecek kullanıcının ID'si
 * @param updateData - Güncellenecek alanlar (firstName, lastName)
 * @returns Güncellenmiş kullanıcı bilgileri (şifre hariç)
 */
export const updateUserProfile = async (userId: string, updateData: { firstName?: string; lastName?: string }) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: updateData,
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      createdAt: true,
    },
  });

  return user;
};
