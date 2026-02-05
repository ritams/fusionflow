import express from 'express';
import { generateImage } from '../services/fal';
import { Asset } from '../models/Asset';

const router = express.Router();

router.post('/', async (req, res) => {
    const { prompt, userId } = req.body;

    if (!prompt || !userId) {
        return res.status(400).json({ error: 'Prompt and UserId are required' });
    }

    try {
        const imageUrl = await generateImage(prompt);

        // Setup asset data
        const assetData = {
            userId,
            url: imageUrl,
            type: 'image',
            prompt
        };

        // Create asset
        const asset = new Asset(assetData);
        await asset.save();

        res.json({
            imageUrl,
            asset
        });

    } catch (error) {
        console.error('Generation failed:', error);
        res.status(500).json({ error: 'Failed to generate image' });
    }
});

export default router;
