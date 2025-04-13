-- users 테이블: 인증/인가용
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- urls 테이블: 단축 URL 저장
CREATE TABLE IF NOT EXISTS urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_url TEXT NOT NULL,
  short_code VARCHAR(12) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  user_id INTEGER,
  CONSTRAINT urls_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id)
);

-- click_logs 테이블: 클릭 추적 로그
CREATE TABLE IF NOT EXISTS click_logs (
  id SERIAL PRIMARY KEY,
  short_code VARCHAR(20) NOT NULL,
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  user_agent TEXT
);