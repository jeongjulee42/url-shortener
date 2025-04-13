const express = require('express');
const app = express();
const PORT = 3001;

app.use(express.json());

app.post('/shorten', (req, res) => {
    const { original_url } = req.body;
    const short_code = Math.random().toString(36).substring(2, 8); 

  // 나중에 DB에 저장하는 로직 추가 예정
    console.log(`[Shorten] ${original_url} -> ${short_code}`);
    res.json({ short_url: `http://localhost/${short_code}`, code: short_code });
});

app.listen(PORT, () => {
    console.log(`URL Service listening on port ${PORT}`);
});