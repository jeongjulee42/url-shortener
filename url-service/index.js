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
// 내 URL 목록 조회
app.get('/my-urls', verifyToken, async (req, res) => {
    const user_id = req.user.userId;
    
        try {
        const result = await pool.query(
                `SELECT short_code, original_url, created_at,
                        (SELECT COUNT(*) FROM click_logs WHERE click_logs.short_code = urls.short_code) AS click_count
                FROM urls
                WHERE user_id = $1
                ORDER BY created_at DESC`,
                [user_id]
            );
    
        const urls = result.rows.map(row => ({
            short_url: `http://localhost/${row.short_code}`,
            original_url: row.original_url,
            created_at: row.created_at,
            click_count: parseInt(row.click_count)
        }));
    
        res.json({ urls });
        } catch (err) {
        console.error('My URLs Error:', err);
        res.status(500).json({ error: 'Failed to fetch URLs' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ URL Service running on http://localhost:${PORT}`);
});