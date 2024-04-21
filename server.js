const express = require('express');
const app = express();

app.get('/', () => {

});

app.use('/api/v1', require('./api/index.js'));

app.listen(3000, () => console.log(`listening on port 3000`));



const pool = new Pool({
  user: 'your_username',
  host: 'localhost',
  database: 'fitness-trackr',
  password: 'your_password',
  port: 5432,
});

// Routes

app.get('/api/v1/activities', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM activities');
    res.json(rows);
  } catch (error) {
    console.error('Error getting activities:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// get activity by ID
app.get('/api/v1/activities/:activityId', async (req, res) => {
  const { activityId } = req.params;
  try {
    const { rows } = await pool.query('SELECT * FROM activities WHERE id = $1', [activityId]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Activity not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (error) {
    console.error('Error getting activity by ID:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// post new activity
app.post('/api/v1/activities', async (req, res) => {
  const { name, description } = req.body;
  try {
    const { rows } = await pool.query('INSERT INTO activities (name, description) VALUES ($1, $2) RETURNING *', [name, description]);
    res.status(201).json(rows[0]);
  } catch (error) {
    console.error('Error adding activity:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});



// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
