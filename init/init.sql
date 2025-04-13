-- users 테이블: 인증/인가용
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL
);

-- urls 테이블: 단축 URL 저장
CREATE TABLE IF NOT EXISTS urls (
  id SERIAL PRIMARY KEY,
  original_url TEXT NOT NULL,
  short_code VARCHAR(8) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- click_logs 테이블: 클릭 추적 로그
CREATE TABLE IF NOT EXISTS click_logs (
  id SERIAL PRIMARY KEY,
  url_id INTEGER REFERENCES urls(id),
  user_agent TEXT,
  ip_address TEXT,
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);