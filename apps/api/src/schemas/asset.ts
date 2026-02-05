import { z } from 'zod';

export const CreateAssetSchema = z.object({
    url: z.string().url(),
    type: z.enum(['image', 'video', 'text']),
    prompt: z.string().optional(),
    content: z.string().optional(),
    position: z.object({
        x: z.number(),
        y: z.number()
    }).optional(),
    dimensions: z.object({
        width: z.number(),
        height: z.number()
    }).optional(),
    customTitle: z.string().optional(),
    isVisibleOnCanvas: z.boolean().optional()
});

export const UpdateAssetSchema = z.object({
    position: z.object({
        x: z.number(),
        y: z.number()
    }).optional(),
    dimensions: z.object({
        width: z.number(),
        height: z.number()
    }).optional(),
    customTitle: z.string().optional(),
    isVisibleOnCanvas: z.boolean().optional(),
    content: z.string().optional()
});
