// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const detectSqlInjection = require('./middleware/sqlInjectionGuard'); // ✅ Import it here

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Cache prevention headers
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
});

// ✅ Setup PostgreSQL pool
const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: process.env.PG_PORT,
});

// ✅ Use routes with SQL Injection middleware
const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');

app.use('/auth', detectSqlInjection, authRoutes);
app.use('/api/auth/leave', detectSqlInjection, leaveRoutes);
app.use('/uploads', express.static('uploads'));

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ PostgreSQL connection error:', err));

app.get('/', (req, res) => {
  res.send('Leave Automation Backend API is running 🚀');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
