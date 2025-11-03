import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { authRouter } from './api/auth/auth.controller';
import { productsRouter } from './api/products/products.controller';
import { cartRouter } from './api/cart/cart.controller';
import { adminRouter } from './api/admin/admin.controller';
import { categoriesRouter } from './api/categories/categories.controller';
import { reviewsRouter } from './api/reviews/reviews.controller';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Middleware'ini ekliyoruz
// Frontend'in çalıştığı adresten gelen isteklere izin ver
const allowedOrigins = process.env.FRONTEND_URL 
  ? [process.env.FRONTEND_URL] 
  : ['http://localhost:3000'];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));

app.use(express.json());

app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the E-Commerce API!' });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/admin', adminRouter);

// Basic Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  if (err instanceof Error) {
    return res.status(400).json({
      name: err.name,
      message: err.message,
    });
  }
  return res.status(500).json({
    message: 'Internal Server Error',
  });
});

app.listen(PORT, () => {
  console.log(`Backend server is running at http://localhost:${PORT}`);
});
