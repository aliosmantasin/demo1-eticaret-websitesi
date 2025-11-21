import express, { Request, Response, NextFunction } from 'express';
import * as OptionService from './options.service';
import { authenticateToken, requireAdmin } from '../../core/middleware/auth.middleware';

const router = express.Router();

// Tüm option route'larını admin yetkisiyle koru
router.use(authenticateToken, requireAdmin);

// === Option Endpoint'leri ===

// GET /api/admin/options - Tüm option'ları ve value'larını getir
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const options = await OptionService.getAllOptions();
    res.json(options);
  } catch (error) {
    next(error);
  }
});

// POST /api/admin/options - Yeni bir option oluştur (örn: "Aroma")
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newOption = await OptionService.createOption(req.body);
    res.status(201).json(newOption);
  } catch (error) {
    next(error);
  }
});

// PUT /api/admin/options/:id - Bir option'ı güncelle
router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedOption = await OptionService.updateOption(req.params.id, req.body);
      res.json(updatedOption);
    } catch (error) {
      next(error);
    }
  });

// DELETE /api/admin/options/:id - Bir option'ı sil
router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await OptionService.deleteOption(req.params.id);
      res.json({ message: 'Option başarıyla silindi' });
    } catch (error) {
      next(error);
    }
  });


// === OptionValue Endpoint'leri ===

// POST /api/admin/option-values - Yeni bir option value oluştur (örn: "Çilek")
router.post('/values', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const newValue = await OptionService.createOptionValue(req.body);
      res.status(201).json(newValue);
    } catch (error) {
      next(error);
    }
  });
  
// PUT /api/admin/option-values/:id - Bir option value'yu güncelle
router.put('/values/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedValue = await OptionService.updateOptionValue(req.params.id, req.body);
      res.json(updatedValue);
    } catch (error) {
      next(error);
    }
  });
  
// DELETE /api/admin/option-values/:id - Bir option value'yu sil
router.delete('/values/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
      await OptionService.deleteOptionValue(req.params.id);
      res.json({ message: 'OptionValue başarıyla silindi' });
    } catch (error) {
      next(error);
    }
  });
  
export default router;

