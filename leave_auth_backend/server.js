const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const detectSqlInjection = require('./middleware/sqlInjectionGuard');

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


const authRoutes = require('./routes/authRoutes');
const leaveRoutes = require('./routes/leaveRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

app.use('/api/notifications', notificationRoutes);
app.use('/auth', detectSqlInjection, authRoutes);
app.use('/auth/leave', detectSqlInjection, leaveRoutes);
app.use('/uploads', express.static('uploads'));
app.use('/api/auth/leaves', leaveRoutes);

pool.connect()
  .then(() => console.log('✅ Connected to PostgreSQL'))
  .catch(err => console.error('❌ PostgreSQL connection error:', err));

app.get('/', (req, res) => {
  res.send('Leave Automation Backend API is running 🚀');
});

app.get('/api/leaves/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM leave_applications WHERE applicant_id = $1', [id]);
  res.json(result.rows);
});

app.get('/api/auth/leaves/pending/:role', async (req, res) => {
  const { role } = req.params;

  try {
    const result = await pool.query(
      'SELECT * FROM leave_applications WHERE status = $1 AND current_approver = $2',
      ['pending', role]
    );

    res.json(result.rows);
  } catch (err) {
    console.error('❌ Error fetching pending leaves:', err);
    res.status(500).json({ message: 'Failed to fetch pending leaves' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
