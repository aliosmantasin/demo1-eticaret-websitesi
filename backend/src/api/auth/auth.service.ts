import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../core/services/prisma.service';
import { z } from 'zod';
import { RegisterSchema } from './auth.controller';

type RegisterUserInput = z.infer<typeof RegisterSchema>;

// Extend LoginSchema to be used in the service
const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});
type LoginUserInput = z.infer<typeof LoginSchema>;

export const createUser = async (userData: RegisterUserInput) => {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const userToCreate = {
    ...userData,
    password: hashedPassword,
  };
  const newUser = await prisma.user.create({
    data: userToCreate,
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
