import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];

    // Authorization 헤더가 없거나 Bearer 형식이 아닌 경우
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Missing or invalid token' });
    }

    const token = authHeader.split(' ')[1];

    try {
        // JWT 토큰 검증
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 검증 성공 시 사용자 정보 요청 객체에 추가
        req.user = decoded;

        next(); // 다음 미들웨어 또는 라우터로 이동
    } catch (err) {
        // 토큰 만료 또는 변조 시
        return res.status(403).json({ error: 'Invalid or expired token' });
  }
}