import express from 'express';
import { nanoid } from 'nanoid';

const app = express();
const PORT = 3001;

app.use(express.json());

// POST /shorten
app.post('/shorten', (req, res) => {
    const { original_url } = req.body;

    if (!original_url) {
        return res.status(400).json({ error: "original_url is required" });
    }

    const short_code = nanoid(8);
    console.log(`[Shorten] ${original_url} -> ${short_code}`);

    res.json({
        short_url: `http://localhost/${short_code}`,
        code: short_code
    });
});

app.listen(PORT, () => {
    console.log(`✅ URL Service is running on http://localhost:${PORT}`);
});