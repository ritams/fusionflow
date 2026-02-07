import { fal } from "@fal-ai/client";
import logger from "../utils/logger";

// Note: Ensure FAL_KEY is set in your environment
// This service assumes we are running on the server side

/**
 * Generate a new image from a text prompt
 * Uses nano-banana-pro model
 */
export const generateImage = async (prompt: string): Promise<string> => {
    try {
        logger.fal('Generating image', { prompt: prompt.slice(0, 50) });
        const result: any = await fal.subscribe("fal-ai/nano-banana-pro", {
            input: { prompt },
            logs: false,
        });

        if (result.images && result.images.length > 0) {
            logger.fal('Image generated successfully');
            return result.images[0].url;
        }
        throw new Error("No image returned");

    } catch (error) {
        logger.error('Image generation failed', { context: 'FAL', data: { error: String(error) } });
        throw error;
    }
};

/**
 * Image editing: transform existing images based on a prompt
 * Uses nano-banana-pro/edit model - supports multiple reference images
 */
export const editImage = async (
    imageUrls: string[],
    prompt: string
): Promise<string> => {
    try {
        logger.fal('Editing image', { imageCount: imageUrls.length, prompt: prompt.slice(0, 50) });
        const result: any = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
            input: {
                prompt: prompt,
                image_urls: imageUrls,
            },
            logs: false,
        });

        // Try different response structures
        if (result.images && result.images.length > 0) {
            logger.fal('Edit completed successfully');
            return result.images[0].url;
        }
        if (result.data?.images && result.data.images.length > 0) {
            logger.fal('Edit completed successfully');
            return result.data.images[0].url;
        }
        if (result.image) {
            logger.fal('Edit completed successfully');
            return result.image.url || result.image;
        }
        if (result.data?.image) {
            logger.fal('Edit completed successfully');
            return result.data.image.url || result.data.image;
        }

        throw new Error("No edited image returned");

    } catch (error) {
        logger.error('Image edit failed', { context: 'FAL', data: { error: String(error) } });
        throw error;
    }
};

/**
 * Inpainting: fill in masked areas of an image based on a prompt
 */
export const inpaintImage = async (
    imageUrl: string,
    maskUrl: string,
    prompt: string
): Promise<string> => {
    try {
        logger.fal('Inpainting image', { prompt: prompt.slice(0, 50) });
        const result: any = await fal.subscribe("fal-ai/flux-pro/v1/fill", {
            input: {
                image_url: imageUrl,
                mask_url: maskUrl,
                prompt: prompt,
            },
            logs: false,
        });

        if (result.images && result.images.length > 0) {
            logger.fal('Inpaint completed successfully');
            return result.images[0].url;
        }
        throw new Error("No inpainted image returned");

    } catch (error) {
        logger.error('Inpaint failed', { context: 'FAL', data: { error: String(error) } });
        throw error;
    }
};

/**
 * Text-to-Video: Generate a video from a text prompt
 * Uses xai/grok-imagine-video/text-to-video
 */
export const generateVideo = async (prompt: string): Promise<string> => {
    try {
        logger.fal('Generating video', { prompt: prompt.slice(0, 50) });
        const result: any = await fal.subscribe("xai/grok-imagine-video/text-to-video", {
            input: { prompt },
            logs: false,
        });

        // Try different response structures
        if (result.video?.url) {
            logger.fal('Video generated successfully');
            return result.video.url;
        }
        if (result.data?.video?.url) {
            logger.fal('Video generated successfully');
            return result.data.video.url;
        }
        if (result.videos && result.videos.length > 0) {
            logger.fal('Video generated successfully');
            return result.videos[0].url;
        }
        if (result.data?.videos && result.data.videos.length > 0) {
            logger.fal('Video generated successfully');
            return result.data.videos[0].url;
        }

        throw new Error("No video returned");

    } catch (error) {
        logger.error('Video generation failed', { context: 'FAL', data: { error: String(error) } });
        throw error;
    }
};

/**
 * Image-to-Video: Animate an image into a video
 * Uses xai/grok-imagine-video/image-to-video
 */
export const animateImage = async (imageUrl: string, prompt: string): Promise<string> => {
    try {
        logger.fal('Animating image', { prompt: prompt.slice(0, 50) });
        const result: any = await fal.subscribe("xai/grok-imagine-video/image-to-video", {
            input: {
                image_url: imageUrl,
                prompt: prompt,
            },
            logs: false,
        });

        // Try different response structures
        if (result.video?.url) {
            logger.fal('Animation completed successfully');
            return result.video.url;
        }
        if (result.data?.video?.url) {
            logger.fal('Animation completed successfully');
            return result.data.video.url;
        }
        if (result.videos && result.videos.length > 0) {
            logger.fal('Animation completed successfully');
            return result.videos[0].url;
        }
        if (result.data?.videos && result.data.videos.length > 0) {
            logger.fal('Animation completed successfully');
            return result.data.videos[0].url;
        }

        throw new Error("No video returned");

    } catch (error) {
        logger.error('Image-to-video failed', { context: 'FAL', data: { error: String(error) } });
        throw error;
    }
};
