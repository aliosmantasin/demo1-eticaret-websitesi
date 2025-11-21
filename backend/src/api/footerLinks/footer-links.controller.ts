import { Router, Request, Response, NextFunction } from 'express';
import { FooterLinkSection } from '@prisma/client';
import { authenticateToken, requireAdmin } from '../../core/middleware/auth.middleware';
import * as FooterLinksService from './footer-links.service';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { section } = req.query;
    const parsedSection = section && typeof section === 'string' && Object.values(FooterLinkSection).includes(section as FooterLinkSection)
      ? (section as FooterLinkSection)
      : undefined;

    const links = await FooterLinksService.getFooterLinks(parsedSection);
    res.json(links);
  } catch (error) {
    next(error);
  }
});

router.use(authenticateToken, requireAdmin);

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const link = await FooterLinksService.createFooterLink(req.body);
    res.status(201).json(link);
  } catch (error) {
    next(error);
  }
});

router.put('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const link = await FooterLinksService.updateFooterLink(req.params.id, req.body);
    res.json(link);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await FooterLinksService.deleteFooterLink(req.params.id);
    res.json({ message: 'Footer link silindi' });
  } catch (error) {
    next(error);
  }
});

export default router;

