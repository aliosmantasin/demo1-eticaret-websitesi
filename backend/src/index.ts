import express, { Request, Response, NextFunction } from 'express';
import { authRouter } from './api/auth/auth.controller';
import { productsRouter } from './api/products/products.controller';

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Welcome to the E-Commerce API!' });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/products', productsRouter);

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

app.listen(port, () => {
  console.log(`Backend server is running at http://localhost:${port}`);
});
