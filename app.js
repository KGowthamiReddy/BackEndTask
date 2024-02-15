const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// MySQL database connection
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'user',
  password: 'tiger',
  database: 'company'
});

connection.connect();

// Middleware
app.use(bodyParser.json());

// API to manage check-in
app.post('/checkin', (req, res) => {
  const { instructor_id, checkin_time } = req.body;

  // Validate input
  if (!instructor_id || !checkin_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Insert check-in record into database
  const sql = 'INSERT INTO checkin (instructor_id, checkin_time) VALUES ?';
  const value = [
    [1, '9am'],
    [2, '10am'],
    [3, '9:30am'],
    [4, '7.30pm'],
    [5, '11am'],
    [6, '10:35am']
  ];
  connection.query(sql, [value], (err, result) => {
    if (err) {
      console.error('Error inserting check-in record:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log(result);
    res.json({ message: 'Check-in recorded successfully' });
  });
});

// API to manage check-out
app.post('/checkout', (req, res) => {
  const { instructor_id, checkout_time } = req.body;

  // Validate input
  if (!instructor_id || !checkout_time) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Insert check-out record into database
  const sql1 = 'INSERT INTO checkout (instructor_id, checkout_time) VALUES ?';
  const values = [
    [1, '9pm'],
    [2, '6:30pm'],
    [3, '10pm'],
    [4, '7:30pm'],
    [5, '9pm'],
    [6, '5:35pm']
  ];
  connection.query(sql1, [values], (err, result) => {
    if (err) {
      console.error('Error inserting check-out record:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    console.log(result);
    res.json({ message: 'Check-out recorded successfully' });
  });
});

// API for aggregated monthly report
app.get('/monthly-report', (req, res) => {
  const { month, year } = req.query;

  // Validate input
  if (!month || !year) {
    return res.status(400).json({ error: 'Month and year are required' });
  }

  // Compute aggregated monthly report
  const sql2 = `
    SELECT instructor_id, SUM(TIMESTAMPDIFF(MINUTE, checkin_time, checkout_time)) AS total_minutes
    FROM checkin
    JOIN checkout ON checkin.instructor_id = checkout.instructor_id
    WHERE MONTH(checkin_time) = ? AND YEAR(checkin_time) = ?
    GROUP BY instructor_id
  `;
  connection.query(sql2, [month, year], (err, results) => {
    if (err) {
      console.error('Error retrieving monthly report:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
    res.json({ monthly_report: results });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
