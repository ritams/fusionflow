import express from 'express'
import multer from 'multer'
import path from 'path'
import { Asset } from '../models/Asset'
import { User } from '../models/User'

const router = express.Router()

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Save to public/uploads
        // Ensure this directory exists or create it
        const uploadPath = path.join(__dirname, '../../public/uploads')
        console.log(`[Upload Debug] Saving file to: ${uploadPath}`)
        cb(null, uploadPath)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({ storage })

// Middleware to mock auth or extract user
const extractUser = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'Unauthorized' })

    const token = authHeader.split(' ')[1]
    console.log(`[Upload Debug] Token/Email: ${token}`)

    // Try to find user by email directly for this simple implementation
    const user = await User.findOne({ email: token })
    console.log(`[Upload Debug] User found: ${user ? user._id : 'No'}`)

    if (!user) {
        console.error(`[Upload Debug] User lookup failed for token: ${token}`)
        return res.status(401).json({ error: 'User not found', token })
    }

    (req as any).user = user
    next()
}

router.post('/', extractUser, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'No file uploaded' })
        }

        const user = (req as any).user
        const baseUrl = process.env.API_BASE_URL || 'http://localhost:3001'
        const fileUrl = `${baseUrl}/uploads/${req.file.filename}`

        const type = req.file.mimetype.startsWith('video') ? 'video' : 'image'

        const asset = await Asset.create({
            userId: user._id,
            url: fileUrl,
            type,
            prompt: 'Uploaded file'
        })

        res.status(201).json(asset)
    } catch (error) {
        console.error('Upload error:', error)
        res.status(500).json({ error: 'Upload failed' })
    }
})

export default router
