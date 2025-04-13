import express from 'express';
import { pool } from './db.js';
import { verifyToken } from './middleware/auth.js';

const app = express();
const PORT = 3002;

// short_code 접속 → 원래 URL 찾고 로그 기록
app.get('/:code', async (req, res) => {
    const { code } = req.params;

    try {
        const result = await pool.query(
            'SELECT original_url FROM urls WHERE short_code = $1',
            [code]
        );

        if (result.rowCount === 0) {
            return res.status(404).send('Short URL not found');
        }

        const original_url = result.rows[0].original_url;

        // IP, User-Agent 추출
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
        const userAgent = req.headers['user-agent'] || '';

        // click_logs에 기록
        await pool.query(
            `INSERT INTO click_logs (short_code, ip_address, user_agent)
            VALUES ($1, $2, $3)`,
            [code, ip, userAgent]
        );

        res.redirect(original_url);
    } catch (err) {
        console.error('DB Error:', err);
        res.status(500).send('Database error');
    }
});

// 통계 조회 API
app.get('/stats/:code', verifyToken, async (req, res) => {
    const { code } = req.params;

    try {
        const stats = await pool.query(
            `SELECT COUNT(*) AS clicks,
                    MAX(clicked_at) AS last_click
            FROM click_logs
            WHERE short_code = $1`,
            [code]
        );

        const recentLogs = await pool.query(
            `SELECT clicked_at, ip_address, user_agent
            FROM click_logs
            WHERE short_code = $1
            ORDER BY clicked_at DESC
            LIMIT 10`,
            [code]
        );

        res.json({
            short_code: code,
            total_clicks: parseInt(stats.rows[0].clicks),
            last_click: stats.rows[0].last_click,
            recent_logs: recentLogs.rows,
            requested_by: req.user.email  // 토큰에서 가져온 사용자 이메일
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Redirect Service running on http://localhost:${PORT}`);
});