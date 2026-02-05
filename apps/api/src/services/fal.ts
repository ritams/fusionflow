import { fal } from "@fal-ai/client";

// Note: Ensure FAL_KEY is set in your environment
// This service assumes we are running on the server side

export const generateImage = async (prompt: string): Promise<string> => {
    try {
        const result: any = await fal.subscribe("fal-ai/fast-sdxl", {
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
