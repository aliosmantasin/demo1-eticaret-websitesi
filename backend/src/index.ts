import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import { authRouter } from './api/auth/auth.controller';
import { productsRouter } from './api/products/products.controller';
import { cartRouter } from './api/cart/cart.controller';
import { adminRouter } from './api/admin/admin.controller';
import { categoriesRouter } from './api/categories/categories.controller';
import { reviewsRouter } from './api/reviews/reviews.controller';
import imagesRouter from './api/images/images.controller'; // Görsel router'ını import et
import settingsRouter from './api/settings/settings.controller'; // Site ayarları router'ını import et
import footerLinksRouter from './api/footerLinks/footer-links.controller';
import path from 'path'; // path modülünü import et

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

// Yüklenen dosyaları public olarak servis et
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));


app.get('/api', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the E-Commerce API!' });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/admin', adminRouter); // Genel admin rotaları
app.use('/api/products', productsRouter);
app.use('/api/cart', cartRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/reviews', reviewsRouter);
app.use('/api/images', imagesRouter); // Yeni görsel router'ını ekle
app.use('/api/settings', settingsRouter); // Site ayarları router'ını ekle
app.use('/api/footer-links', footerLinksRouter);

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
