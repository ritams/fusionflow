import { FFmpeg } from '@ffmpeg/ffmpeg'
import { fetchFile, toBlobURL } from '@ffmpeg/util'
import type { EditorClip, TransitionType, FilterType } from '@/context/EditorContext'

// Singleton FFmpeg instance
let ffmpeg: FFmpeg | null = null
let isLoaded = false

/**
 * Get or create the FFmpeg instance (lazy loaded)
 */
export async function getFFmpeg(onProgress?: (progress: number) => void): Promise<FFmpeg> {
    if (ffmpeg && isLoaded) {
        return ffmpeg
    }

    ffmpeg = new FFmpeg()

    // Log progress during load
    ffmpeg.on('log', ({ message }) => {
        console.log('[FFmpeg]', message)
    })

    // Progress callback for encoding
    ffmpeg.on('progress', ({ progress }) => {
        if (onProgress) {
            onProgress(Math.round(progress * 100))
        }
    })

    // Load FFmpeg with CDN URLs (lazy load ~25MB)
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm'

    await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    })

    isLoaded = true
    return ffmpeg
}

/**
 * Generate a thumbnail from a video at a specific time
 */
export async function generateThumbnail(
    videoUrl: string,
    timeSeconds: number = 0
): Promise<string> {
    const ff = await getFFmpeg()

    const inputName = 'input_thumb.mp4'
    const outputName = 'thumb.jpg'

    // Fetch and write the video file
    await ff.writeFile(inputName, await fetchFile(videoUrl))

    // Extract a single frame
    await ff.exec([
        '-ss', String(timeSeconds),
        '-i', inputName,
        '-vframes', '1',
        '-q:v', '2',
        '-vf', 'scale=160:-1',
        outputName
    ])

    // Read the output
    const data = await ff.readFile(outputName)
    const blob = new Blob([new Uint8Array(data as Uint8Array)], { type: 'image/jpeg' })

    // Cleanup
    await ff.deleteFile(inputName)
    await ff.deleteFile(outputName)

    return URL.createObjectURL(blob)
}

/**
 * Get video duration
 */
export async function getVideoDuration(videoUrl: string): Promise<number> {
    return new Promise((resolve) => {
        const video = document.createElement('video')
        video.preload = 'metadata'
        video.onloadedmetadata = () => {
            resolve(video.duration)
            URL.revokeObjectURL(video.src)
        }
        video.onerror = () => {
            resolve(0)
        }
        video.src = videoUrl
    })
}

/**
 * Build filter string for FFmpeg
 */
function buildFilterString(filter: FilterType): string {
    switch (filter) {
        case 'grayscale':
            return 'colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3'
        case 'sepia':
            return 'colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131'
        case 'vintage':
            return 'curves=vintage'
        case 'contrast':
            return 'eq=contrast=1.3'
        case 'brightness':
            return 'eq=brightness=0.1'
        default:
            return ''
    }
}

/**
 * Build transition filter complex
 */
function buildTransitionFilter(
    transition: TransitionType,
    duration: number = 0.5
): string {
    switch (transition) {
        case 'fade':
            return `fade=t=in:st=0:d=${duration}`
        case 'fade-black':
            return `fade=t=in:st=0:d=${duration}:c=black`
        case 'crossfade':
            return `xfade=transition=fade:duration=${duration}`
        case 'slide-left':
            return `xfade=transition=slideleft:duration=${duration}`
        case 'slide-right':
            return `xfade=transition=slideright:duration=${duration}`
        default:
            return ''
    }
}

/**
 * Create video from image with Ken Burns effect
 */
export async function createImageVideo(
    imageUrl: string,
    duration: number,
    kenBurns?: { startZoom: number; endZoom: number; panX: number; panY: number }
): Promise<Uint8Array> {
    const ff = await getFFmpeg()

    const inputName = 'input_img.jpg'
    const outputName = 'output_img.mp4'

    await ff.writeFile(inputName, await fetchFile(imageUrl))

    let filterComplex = ''
    if (kenBurns) {
        // Ken Burns: zoom and pan animation
        const { startZoom, endZoom, panX, panY } = kenBurns
        filterComplex = [
            `scale=1920:1080`,
            `zoompan=z='${startZoom}+(${endZoom}-${startZoom})*on/${duration * 25}':x='${panX}':y='${panY}':d=${Math.round(duration * 25)}:s=1920x1080:fps=25`
        ].join(',')
    } else {
        filterComplex = 'scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2'
    }

    await ff.exec([
        '-loop', '1',
        '-i', inputName,
        '-vf', filterComplex,
        '-t', String(duration),
        '-c:v', 'libx264',
        '-pix_fmt', 'yuv420p',
        '-r', '25',
        outputName
    ])

    const data = await ff.readFile(outputName)

    await ff.deleteFile(inputName)
    await ff.deleteFile(outputName)

    return data as Uint8Array
}

/**
 * Trim a video clip
 */
export async function trimVideo(
    videoUrl: string,
    startTime: number,
    endTime: number,
    speed: number = 1,
    filter?: FilterType
): Promise<Uint8Array> {
    const ff = await getFFmpeg()

    const inputName = 'input_trim.mp4'
    const outputName = 'output_trim.mp4'

    await ff.writeFile(inputName, await fetchFile(videoUrl))

    const args = [
        '-ss', String(startTime),
        '-i', inputName,
        '-t', String(endTime - startTime),
    ]

    // Build video filter
    const filters: string[] = []

    if (speed !== 1) {
        filters.push(`setpts=${1 / speed}*PTS`)
    }

    if (filter && filter !== 'none') {
        const filterStr = buildFilterString(filter)
        if (filterStr) filters.push(filterStr)
    }

    if (filters.length > 0) {
        args.push('-vf', filters.join(','))
    }

    // Audio speed adjustment
    if (speed !== 1) {
        args.push('-af', `atempo=${speed}`)
    }

    args.push(
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-strict', 'experimental',
        outputName
    )

    await ff.exec(args)

    const data = await ff.readFile(outputName)

    await ff.deleteFile(inputName)
    await ff.deleteFile(outputName)

    return data as Uint8Array
}

/**
 * Merge multiple clips into a single video
 */
export async function mergeClips(
    clips: EditorClip[],
    onProgress?: (progress: number) => void
): Promise<Blob> {
    const ff = await getFFmpeg(onProgress)

    const processedFiles: string[] = []

    // Process each clip
    for (let i = 0; i < clips.length; i++) {
        const clip = clips[i]
        const outputName = `clip_${i}.mp4`

        if (clip.type === 'image') {
            // Convert image to video
            const data = await createImageVideo(
                clip.sourceUrl,
                clip.duration,
                clip.kenBurns
            )
            await ff.writeFile(outputName, data)
        } else {
            // Process video
            const data = await trimVideo(
                clip.sourceUrl,
                clip.trimStart,
                clip.trimStart + clip.duration / clip.speed,
                clip.speed,
                clip.filterEffect
            )
            await ff.writeFile(outputName, data)
        }

        processedFiles.push(outputName)

        if (onProgress) {
            onProgress(Math.round(((i + 1) / clips.length) * 50))
        }
    }

    // Create concat file
    const concatContent = processedFiles.map(f => `file '${f}'`).join('\n')
    await ff.writeFile('concat.txt', concatContent)

    // Merge all clips
    const finalOutput = 'final_output.mp4'
    await ff.exec([
        '-f', 'concat',
        '-safe', '0',
        '-i', 'concat.txt',
        '-c:v', 'libx264',
        '-c:a', 'aac',
        '-strict', 'experimental',
        finalOutput
    ])

    if (onProgress) {
        onProgress(90)
    }

    // Read final output
    const data = await ff.readFile(finalOutput)
    const blob = new Blob([new Uint8Array(data as Uint8Array)], { type: 'video/mp4' })

    // Cleanup
    for (const file of processedFiles) {
        await ff.deleteFile(file)
    }
    await ff.deleteFile('concat.txt')
    await ff.deleteFile(finalOutput)

    if (onProgress) {
        onProgress(100)
    }

    return blob
}

/**
 * Export editor timeline to a video file
 */
export async function exportTimeline(
    clips: EditorClip[],
    onProgress?: (progress: number) => void
): Promise<Blob> {
    if (clips.length === 0) {
        throw new Error('No clips to export')
    }

    // Sort clips by start time
    const sortedClips = [...clips].sort((a, b) => a.startTime - b.startTime)

    return mergeClips(sortedClips, onProgress)
}
