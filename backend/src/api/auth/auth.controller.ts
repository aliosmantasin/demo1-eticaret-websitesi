import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as AuthService from './auth.service';
import { authenticateToken, AuthenticatedRequest } from '../../core/middleware/auth.middleware';

export const authRouter = express.Router();

export const RegisterSchema = z.object({
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz." }),
  password: z.string().min(8, { message: "Şifre en az 8 karakter olmalıdır." }),
  name: z.string().min(3, { message: "Ad Soyad en az 3 karakter olmalıdır." }),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, name } = RegisterSchema.parse(req.body);

    // 'name' alanını 'firstName' ve 'lastName' olarak ayır
    const nameParts = name.trim().split(' ');
    const firstName = nameParts.shift() || '';
    const lastName = nameParts.join(' ');

    const newUser = await AuthService.createUser({
      email,
      password,
      firstName,
      lastName,
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  } catch (error) {
    // Zod validation hatası ise kullanıcı dostu mesaj döndür
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.errors[0].message,
      });
    }
    next(error);
  }
});

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginData = LoginSchema.parse(req.body);
    const { token } = await AuthService.loginUser(loginData);
    res.json({ token });
  } catch (error) {
    // Zod validation hatası ise kullanıcı dostu mesaj döndür
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.errors[0].message,
      });
    }
    next(error);
  }
});

// GET /api/auth/me - Mevcut kullanıcı bilgilerini getir
authRouter.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const user = await AuthService.getUserById(req.userId!);
    res.json(user);
  } catch (error) {
    next(error);
  }
});

// PUT /api/auth/me - Kullanıcı profil bilgilerini güncelle
authRouter.put('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const UpdateProfileSchema = z.object({
      firstName: z.string().min(1, { message: "Ad alanı boş olamaz" }).optional(),
      lastName: z.string().min(1, { message: "Soyad alanı boş olamaz" }).optional(),
    });

    const updateData = UpdateProfileSchema.parse(req.body);

    const user = await AuthService.updateUserProfile(req.userId!, updateData);
    res.json(user);
  } catch (error) {
    // Zod validation hatası ise kullanıcı dostu mesaj döndür
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        message: error.errors[0].message,
      });
    }
    next(error);
  }
});
