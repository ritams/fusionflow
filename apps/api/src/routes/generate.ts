import express from 'express';
import path from 'path';
import { generateImage, editImage, inpaintImage } from '../services/fal';
import { Asset } from '../models/Asset';
import { authenticateToken } from '../middleware/auth';

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
        console.log('URL does not match upload pattern, returning as-is:', url);
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

        console.log(`Converted ${filename} to base64 (${mimeType})`);
        return `data:${mimeType};base64,${base64}`;
    } catch (err) {
        console.error('Error reading file for base64:', err);
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
        console.log(`Processing ${processedUrls.length} image(s) for edit`);

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

export default router;
