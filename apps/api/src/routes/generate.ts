import express from 'express';
import path from 'path';
import { generateImage, editImage, inpaintImage, generateVideo, animateImage } from '../services/fal';
import { Asset } from '../models/Asset';
import { authenticateToken } from '../middleware/auth';
import logger from '../utils/logger';

const router = express.Router();

// All generate routes require authentication
router.use(authenticateToken);

// Generate new image from prompt
router.post('/', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        const imageUrl = await generateImage(prompt);

        const assetData = {
            userId: req.user._id,
            url: imageUrl,
            type: 'image',
            prompt
        };

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

// Helper to convert localhost URLs to base64 data URI
async function urlToBase64(url: string): Promise<string> {
    // If it's already a data URI or external URL, return as-is
    if (url.startsWith('data:') || !url.includes('localhost')) {
        return url;
    }

    // Extract filename from localhost URL
    const match = url.match(/\/uploads\/(.+)$/);
    if (!match) {
        return url;
    }

    const filename = match[1];
    const filePath = path.join(__dirname, '../../public/uploads', filename);

    try {
        const fs = await import('fs/promises');
        const fileBuffer = await fs.readFile(filePath);
        const base64 = fileBuffer.toString('base64');

        // Determine mime type from extension
        const ext = path.extname(filename).toLowerCase();
        const mimeTypes: Record<string, string> = {
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.mp4': 'video/mp4',
        };
        const mimeType = mimeTypes[ext] || 'application/octet-stream';

        logger.debug(`Converted ${filename} to base64`, { context: 'API', data: { mimeType } });
        return `data:${mimeType};base64,${base64}`;
    } catch (err) {
        logger.error('Failed to read file for base64', { context: 'API' });
        return url; // Fallback to original URL
    }
}

// Edit existing image with prompt (img2img) - supports multiple images
router.post('/edit', async (req, res) => {
    const { imageUrls, imageUrl, prompt } = req.body;

    // Support both single imageUrl and array of imageUrls
    const urls: string[] = imageUrls || (imageUrl ? [imageUrl] : []);

    if (urls.length === 0 || !prompt) {
        return res.status(400).json({ error: 'imageUrls (or imageUrl) and prompt are required' });
    }

    try {
        // Convert all localhost URLs to base64 so fal.ai can access them
        const processedUrls = await Promise.all(urls.map(url => urlToBase64(url)));
        logger.api('Processing edit request', { imageCount: processedUrls.length });

        const editedUrl = await editImage(processedUrls, prompt);

        const assetData = {
            userId: req.user._id,
            url: editedUrl,
            type: 'image',
            prompt: `Edit: ${prompt}`
        };

        const asset = new Asset(assetData);
        await asset.save();

        res.json({
            imageUrl: editedUrl,
            asset
        });

    } catch (error) {
        console.error('Edit failed:', error);
        res.status(500).json({ error: 'Failed to edit image' });
    }
});

// Inpaint masked area of image
router.post('/inpaint', async (req, res) => {
    const { imageUrl, maskUrl, prompt } = req.body;

    if (!imageUrl || !maskUrl || !prompt) {
        return res.status(400).json({ error: 'imageUrl, maskUrl, and prompt are required' });
    }

    try {
        const inpaintedUrl = await inpaintImage(imageUrl, maskUrl, prompt);

        const assetData = {
            userId: req.user._id,
            url: inpaintedUrl,
            type: 'image',
            prompt: `Inpaint: ${prompt}`
        };

        const asset = new Asset(assetData);
        await asset.save();

        res.json({
            imageUrl: inpaintedUrl,
            asset
        });

    } catch (error) {
        console.error('Inpaint failed:', error);
        res.status(500).json({ error: 'Failed to inpaint image' });
    }
});

// Text-to-Video generation
router.post('/video', async (req, res) => {
    const { prompt } = req.body;

    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    try {
        logger.api('Processing video request');
        const videoUrl = await generateVideo(prompt);

        const assetData = {
            userId: req.user._id,
            url: videoUrl,
            type: 'video',
            prompt
        };

        const asset = new Asset(assetData);
        await asset.save();

        res.json({
            videoUrl,
            asset
        });

    } catch (error) {
        logger.error('Video generation failed', { context: 'API' });
        res.status(500).json({ error: 'Failed to generate video' });
    }
});

// Image-to-Video (animate)
router.post('/animate', async (req, res) => {
    const { imageUrl, prompt } = req.body;

    if (!imageUrl || !prompt) {
        return res.status(400).json({ error: 'imageUrl and prompt are required' });
    }

    try {
        // Convert localhost URL to base64 if needed
        const processedUrl = await urlToBase64(imageUrl);
        logger.api('Processing animate request');
        const videoUrl = await animateImage(processedUrl, prompt);

        const assetData = {
            userId: req.user._id,
            url: videoUrl,
            type: 'video',
            prompt: `Animate: ${prompt}`
        };

        const asset = new Asset(assetData);
        await asset.save();

        res.json({
            videoUrl,
            asset
        });

    } catch (error) {
        logger.error('Animation failed', { context: 'API' });
        res.status(500).json({ error: 'Failed to animate image' });
    }
});

export default router;
