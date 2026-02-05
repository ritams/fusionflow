import { Request, Response } from 'express';
import { AssetService } from '../services/assetService';
import { CreateAssetSchema, UpdateAssetSchema } from '../schemas/asset';

export class AssetController {
    static async getAssets(req: Request, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
            const assets = await AssetService.getAssetsByUser(req.user._id);
            res.json(assets);
        } catch (error) {
            console.error('Fetch assets error:', error);
            res.status(500).json({ error: 'Failed to fetch assets' });
        }
    }

    static async createAsset(req: Request, res: Response) {
        try {
            if (!req.user) return res.status(401).json({ error: 'Unauthorized' });

            const validation = CreateAssetSchema.safeParse(req.body);
            if (!validation.success) {
                return res.status(400).json({ error: validation.error.flatten() });
            }

            const asset = await AssetService.createAsset(req.user._id, validation.data);
            res.json(asset);
        } catch (error) {
            console.error('Save asset error:', error);
            res.status(500).json({ error: 'Failed to save asset' });
        }
    }

    static async updateAsset(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const validation = UpdateAssetSchema.safeParse(req.body);

            if (!validation.success) {
                return res.status(400).json({ error: validation.error.flatten() });
            }

            const asset = await AssetService.updateAsset(id, validation.data);
            if (!asset) return res.status(404).json({ error: 'Asset not found' });

            res.json(asset);
        } catch (error) {
            console.error('Update asset error:', error);
            res.status(500).json({ error: 'Failed to update asset' });
        }
    }

    static async deleteAsset(req: Request, res: Response) {
        try {
            const { id } = req.params;
            await AssetService.deleteAsset(id);
            res.json({ success: true });
        } catch (error) {
            console.error('Delete asset error:', error);
            res.status(500).json({ error: 'Failed to delete asset' });
        }
    }
}
