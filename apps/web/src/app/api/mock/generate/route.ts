import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { model, prompt } = body;

        // Simulate network delay (2-3 seconds)
        await new Promise((resolve) => setTimeout(resolve, 2000));

        // Mock responses based on model type
        let result = {
            image: "https://images.unsplash.com/photo-1709884735626-d380e2d3df21?q=80&w=2670&auto=format&fit=crop", // Abstract 3D
            status: "success",
            metadata: {
                steps: 25,
                seed: Math.floor(Math.random() * 1000000),
                model: model || "FLUX.1-Pro"
            }
        };

        if (model?.includes('video') || model?.includes('runway')) {
            // Return a static image that looks like a video thumbnail for now
            result.image = "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2670&auto=format&fit=crop"; // Cinematic scene
        }

        return NextResponse.json(result);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to generate' }, { status: 500 });
    }
}
