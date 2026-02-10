const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get generic user profile by ID
router.get('/:id', async (req, res) => {
    try {
        const { rows: users } = await db.query(
            'SELECT id, username, email, bio, profile_pic_url, created_at FROM users WHERE id = $1',
            [req.params.id]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        const user = users[0];

        // Get followers count
        const { rows: followers } = await db.query('SELECT COUNT(*) as count FROM follows WHERE following_id = $1', [user.id]);
        user.followersCount = parseInt(followers[0].count);

        // Get following count
        const { rows: following } = await db.query('SELECT COUNT(*) as count FROM follows WHERE follower_id = $1', [user.id]);
        user.followingCount = parseInt(following[0].count);

        // Get posts count
        const { rows: posts } = await db.query('SELECT COUNT(*) as count FROM posts WHERE user_id = $1', [user.id]);
        user.postsCount = parseInt(posts[0].count);

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Update profile
const upload = require('../middleware/uploadMiddleware');

router.put('/:id', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err });
        }

        const { bio } = req.body;
        // In a real app, strict auth middleware would check if req.user.id === req.params.id

        try {
            let updateQuery = 'UPDATE users SET bio = $1 WHERE id = $2';
            let params = [bio, req.params.id];

            if (req.file) {
                const profile_pic_url = `/uploads/${req.file.filename}`;
                updateQuery = 'UPDATE users SET bio = $1, profile_pic_url = $2 WHERE id = $3';
                params = [bio, profile_pic_url, req.params.id];
            } else if (req.body.profile_pic_url) {
                // Keep handling generic URL if passed manually (though UI will use file now)
                updateQuery = 'UPDATE users SET bio = $1, profile_pic_url = $2 WHERE id = $3';
                params = [bio, req.body.profile_pic_url, req.params.id];
            }

            await db.query(updateQuery, params);
            res.json({ message: 'Profile updated' });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    });
});

// Follow user
router.post('/:id/follow', async (req, res) => {
    const { currentUserId } = req.body; // In real app, get from session/token
    const targetUserId = req.params.id;

    if (currentUserId == targetUserId) {
        return res.status(400).json({ error: 'Cannot follow yourself' });
    }

    try {
        await db.query(
            'INSERT INTO follows (follower_id, following_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
            [currentUserId, targetUserId]
        );
        res.json({ message: 'Followed successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;
