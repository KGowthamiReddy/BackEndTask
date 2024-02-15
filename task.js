const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Create MySQL connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'tiger',
  database: 'company'
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// Middleware
app.use(bodyParser.json());

// API to manage check-in
app.post('/checkin', (req, res) => {
  const { instructor_id, checkin_time } = req.body;

  // Validate input
  if (!instructor_id || !checkin_time || !isValidDate(checkin_time)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Insert check-in record into database
  const sql = 'INSERT INTO checkin (instructor_id, checkin_time) VALUES (?, ?)';
  connection.query(sql, [instructor_id, checkin_time], (err, result) => {
    if (err) {
      console.error('Error inserting check-in record:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ message: 'Check-in recorded successfully' });
  });
});

// API to manage check-out
app.post('/checkout', (req, res) => {
  const { instructor_id, checkout_time } = req.body;

  // Validate input
  if (!instructor_id || !checkout_time || !isValidDate(checkout_time)) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Insert check-out record into database
  const sql = 'INSERT INTO checkout (instructor_id, checkout_time) VALUES (?, ?)';
  connection.query(sql, [instructor_id, checkout_time], (err, result) => {
    if (err) {
      console.error('Error inserting check-out record:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ message: 'Check-out recorded successfully' });
  });
});

// API for aggregated monthly report
app.get('/monthly-report/:year/:month', (req, res) => {
  const { year, month } = req.params;

  // Validate input
  if (!year || !month) {
    return res.status(400).json({ error: 'Invalid input' });
  }

  // Query database for aggregated monthly report
  const sql = `
    SELECT instructor_id, SUM(TIMESTAMPDIFF(MINUTE, checkin_time, checkout_time)) AS total_minutes
    FROM checkin
    JOIN checkout ON checkin.instructor_id = checkout.instructor_id
    WHERE YEAR(checkin_time) = ? AND MONTH(checkin_time) = ?
    GROUP BY instructor_id
  `;
  connection.query(sql, [year, month], (err, results) => {
    if (err) {
      console.error('Error retrieving monthly report:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ monthly_report: results });
  });
});

// Helper function to check if a string is a valid date
function isValidDate(dateString) {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(dateString);
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
