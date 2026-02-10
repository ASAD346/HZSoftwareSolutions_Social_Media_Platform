const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Get all posts (Feed)
router.get('/', async (req, res) => {
    try {
        const { user_id } = req.query;
        let query = `
            SELECT p.*, u.username, u.profile_pic_url, 
            (SELECT COUNT(*) FROM likes WHERE post_id = p.id) as likesCount,
            (SELECT COUNT(*) FROM comments WHERE post_id = p.id) as commentsCount
            FROM posts p
            JOIN users u ON p.user_id = u.id
        `;

        const params = [];
        if (user_id) {
            query += ' WHERE p.user_id = $1';
            params.push(user_id);
        }

        query += ' ORDER BY p.created_at DESC';

        const { rows: posts } = await db.query(query, params);
        res.json(posts);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Create post
const upload = require('../middleware/uploadMiddleware');

router.post('/', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ error: err });
        } else {
            const { user_id, content } = req.body;
            let image_url = null;

            if (req.file) {
                image_url = `/uploads/${req.file.filename}`;
            }

            if (!user_id || !content) {
                return res.status(400).json({ error: 'User ID and content are required' });
            }

            try {
                const { rows: result } = await db.query(
                    'INSERT INTO posts (user_id, content, image_url) VALUES ($1, $2, $3) RETURNING id',
                    [user_id, content, image_url]
                );
                res.status(201).json({ message: 'Post created', postId: result[0].id });
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Server error' });
            }
        }
    });
});

// Delete post
router.delete('/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM posts WHERE id = $1', [req.params.id]);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Like/Unlike post (Toggle)
router.post('/:id/like', async (req, res) => {
    const { user_id } = req.body;
    const post_id = req.params.id;

    try {
        // Check if already liked
        const { rows: existing } = await db.query(
            'SELECT * FROM likes WHERE user_id = $1 AND post_id = $2',
            [user_id, post_id]
        );

        if (existing.length > 0) {
            // Unlike
            await db.query('DELETE FROM likes WHERE user_id = $1 AND post_id = $2', [user_id, post_id]);
            return res.json({ message: 'Unliked' });
        } else {
            // Like
            await db.query('INSERT INTO likes (user_id, post_id) VALUES ($1, $2)', [user_id, post_id]);
            return res.json({ message: 'Liked' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Add comment
router.post('/:id/comments', async (req, res) => {
    const { user_id, content } = req.body;
    const post_id = req.params.id;

    try {
        await db.query(
            'INSERT INTO comments (post_id, user_id, content) VALUES ($1, $2, $3)',
            [post_id, user_id, content]
        );
        res.status(201).json({ message: 'Comment added' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get comments for a post
router.get('/:id/comments', async (req, res) => {
    try {
        const query = `
            SELECT c.*, u.username, u.profile_pic_url 
            FROM comments c
            JOIN users u ON c.user_id = u.id
            WHERE c.post_id = $1
            ORDER BY c.created_at ASC
        `;
        const { rows: comments } = await db.query(query, [req.params.id]);
        res.json(comments);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;
