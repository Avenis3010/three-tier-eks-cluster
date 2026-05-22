const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

app.use(cors());

const db = mysql.createConnection({
  host: 'mysql-service',
  user: 'root',
  password: 'password123',
  database: 'three_tier_db'
});

db.connect((err) => {
  if (err) {
    console.log('Database connection failed');
  } else {
    console.log('Connected to MySQL');
  }
});

app.get('/', (req, res) => {
  res.send('Backend API Running');
});

app.get('/health', (req, res) => {
  res.status(200).send('Healthy');
});

app.listen(8085, () => {
  console.log('Server running on port 8085');
});