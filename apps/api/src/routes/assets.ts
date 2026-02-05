import express from 'express';
import { AssetController } from '../controllers/assetController';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken); // Enforce auth

router.get('/', AssetController.getAssets);
router.post('/', AssetController.createAsset);
router.patch('/:id', AssetController.updateAsset);
router.delete('/:id', AssetController.deleteAsset);

export default router;
