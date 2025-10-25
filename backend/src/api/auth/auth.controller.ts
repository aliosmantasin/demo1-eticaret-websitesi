import express, { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import * as AuthService from './auth.service';

export const authRouter = express.Router();

export const RegisterSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

authRouter.post('/register', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = RegisterSchema.parse(req.body);
    const newUser = await AuthService.createUser(userData);
    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
    });
  } catch (error) {
    next(error);
  }
});

authRouter.post('/login', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const loginData = LoginSchema.parse(req.body);
    const { token } = await AuthService.loginUser(loginData);
    res.json({ token });
  } catch (error) {
    next(error);
  }
});
