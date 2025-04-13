import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const PORT = 3003;

app.use(express.json());
app.use('/auth', authRoutes);

app.listen(PORT, () => {
    console.log(`✅ Auth Service running on http://localhost:${PORT}`);
});