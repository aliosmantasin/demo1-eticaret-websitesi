import { Router, Request, Response, NextFunction } from 'express';
import * as SettingsService from './settings.service';
import { authenticateToken, requireAdmin, AuthenticatedRequest } from '../../core/middleware/auth.middleware';

const router = Router();

/**
 * GET /api/settings
 * Site ayarlarını getirir (herkese açık)
 */
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const settings = await SettingsService.getSiteSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
});

/**
 * PUT /api/settings
 * Site ayarlarını günceller (admin only)
 */
router.put('/', authenticateToken, requireAdmin, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const updatedSettings = await SettingsService.updateSiteSettings(req.body);
    res.json(updatedSettings);
  } catch (error) {
    next(error);
  }
});

export default router;

