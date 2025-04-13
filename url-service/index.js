import express from 'express';
import { nanoid } from 'nanoid';
import { pool } from './db.js';

const app = express();
const PORT = 3001;

app.use(express.json());

app.post('/shorten', async (req, res) => {
    const { original_url } = req.body;

    if (!original_url) {
        return res.status(400).json({ error: 'original_url is required' });
    }

    const short_code = nanoid(8);

    try {
            const query = `
                INSERT INTO urls (original_url, short_code)
                VALUES ($1, $2)
                RETURNING short_code
                `;
            const result = await pool.query(query, [original_url, short_code]);

            res.json({
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