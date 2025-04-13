import express from 'express';
import { nanoid } from 'nanoid';
import { pool } from './db.js';
import { verifyToken } from './middleware/auth.js';

const app = express();
const PORT = 3001;

app.use(express.json());

// 인증된 사용자만 단축 URL 생성 가능
app.post('/shorten', verifyToken, async (req, res) => {
    const { original_url } = req.body;
    const user_id = req.user.userId; // JWT에서 추출한 사용자 ID

    if (!original_url) {
        return res.status(400).json({ error: 'original_url is required' });
    }

    const short_code = nanoid(8);

    try {
        const query = `
        INSERT INTO urls (original_url, short_code, user_id)
        VALUES ($1, $2, $3)
        RETURNING short_code
        `;

        const result = await pool.query(query, [original_url, short_code, user_id]);

        res.status(201).json({
        short_url: `http://localhost/${result.rows[0].short_code}`,
        code: result.rows[0].short_code
        });
    } catch (err) {
        console.error('DB Insert Error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ URL Service running on http://localhost:${PORT}`);
});