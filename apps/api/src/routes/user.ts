import express from 'express';
import { User } from '../models/User';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware if strictly needed, or just for sync?
// "Sync" is usually the login step, so it might NOT need auth if it effectively IS the auth step.
// But wait, /sync is called after Google Sign In on the frontend.
// So we SHOULD verify the token sent.

router.post('/sync', authenticateToken, async (req, res) => {
    // We can trust req.user from middleware if we want, OR we use the body as before but verify via token.
    // Actually, middleware sets req.user.
    // The previous logic took email, name, image, googleId from body.
    // If we use ID tokens, we can extract this info from the token itself!
    // But for refactor minimal change: Let's verify token matches the email.

    const { email, name, image, googleId } = req.body;

    if (req.user.email !== email) {
        return res.status(403).json({ error: "Token email does not match body email" });
    }

    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({ email, name, image, googleId });
            await user.save();
        } else {
            // Update basic info just in case
            user.name = name;
            user.image = image;
            // Handle sparse googleId: if googleId is null/undefined in DB, update it.
            if (googleId) user.googleId = googleId;
            await user.save();
        }

        res.json(user);
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ error: 'Failed to sync user' });
    }
});

export default router;
