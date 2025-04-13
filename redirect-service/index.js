const express = require('express');
const app = express();
const PORT = 3002;

app.get('/:code', (req, res) => {
    const { code } = req.params;
    console.log(`[Redirect] Received code: ${code}`);

  // 나중에 DB에서 원래 URL 조회하는 로직 추가 예정
    const original_url = "https://example.com"; // 임시 값
    res.redirect(original_url);
});

app.listen(PORT, () => {
    console.log(`Redirect Service listening on port ${PORT}`);
});