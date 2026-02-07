import { fal } from "@fal-ai/client";

// Note: Ensure FAL_KEY is set in your environment
// This service assumes we are running on the server side

/**
 * Generate a new image from a text prompt
 * Uses nano-banana-pro model
 */
export const generateImage = async (prompt: string): Promise<string> => {
    try {
        console.log('Calling fal.ai generate with:', { prompt });
        const result: any = await fal.subscribe("fal-ai/nano-banana-pro", {
            input: {
                prompt: prompt,
            },
            logs: true,
            onQueueUpdate: (update: any) => {
                if (update.status === "IN_PROGRESS" && update.logs) {
                    update.logs.map((log: any) => console.log(log.message));
                }
            },
        });

        if (result.images && result.images.length > 0) {
            return result.images[0].url;
        }
        throw new Error("No image returned");

    } catch (error) {
        console.error("Fal.ai generation error:", error);
        throw error;
    }
};

/**
 * Image editing: transform existing images based on a prompt
 * Uses nano-banana-pro/edit model - supports multiple reference images
 * @param imageUrls - Array of URLs for the source images
 * @param prompt - Text prompt describing the desired transformation
 */
export const editImage = async (
    imageUrls: string[],
    prompt: string
): Promise<string> => {
    try {
        console.log('Calling fal.ai edit with:', { imageCount: imageUrls.length, prompt });
        const result: any = await fal.subscribe("fal-ai/nano-banana-pro/edit", {
            input: {
                prompt: prompt,
                image_urls: imageUrls,
            },
            logs: true,
            onQueueUpdate: (update: any) => {
                if (update.status === "IN_PROGRESS" && update.logs) {
                    update.logs.map((log: any) => console.log(log.message));
                }
            },
        });

        console.log('Fal.ai edit response:', JSON.stringify(result, null, 2));

        // Try different response structures
        if (result.images && result.images.length > 0) {
            return result.images[0].url;
        }
        if (result.data?.images && result.data.images.length > 0) {
            return result.data.images[0].url;
        }
        if (result.image) {
            return result.image.url || result.image;
        }
        if (result.data?.image) {
            return result.data.image.url || result.data.image;
        }

        throw new Error("No edited image returned - response: " + JSON.stringify(Object.keys(result)));

    } catch (error) {
        console.error("Fal.ai edit error:", error);
        throw error;
    }
};

/**
 * Inpainting: fill in masked areas of an image based on a prompt
 * @param imageUrl - URL of the source image
 * @param maskUrl - URL of the mask image (white = area to inpaint)
 * @param prompt - Text prompt describing what to fill in
 */
export const inpaintImage = async (
    imageUrl: string,
    maskUrl: string,
    prompt: string
): Promise<string> => {
    try {
        console.log('Calling fal.ai inpaint with:', { imageUrl, maskUrl, prompt });
        const result: any = await fal.subscribe("fal-ai/flux-pro/v1/fill", {
            input: {
                image_url: imageUrl,
                mask_url: maskUrl,
                prompt: prompt,
            },
            logs: true,
            onQueueUpdate: (update: any) => {
                if (update.status === "IN_PROGRESS" && update.logs) {
                    update.logs.map((log: any) => console.log(log.message));
                }
            },
        });

        if (result.images && result.images.length > 0) {
            return result.images[0].url;
        }
        throw new Error("No inpainted image returned");

    } catch (error) {
        console.error("Fal.ai inpaint error:", error);
        throw error;
    }
};

