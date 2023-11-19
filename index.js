const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = 3000;

// Use the cors middleware
app.use(cors());

// Middleware to parse JSON requests
app.use(bodyParser.json());

// MongoDB connection string (replace with your MongoDB connection string)
const mongoURI = 'mongodb://localhost:27017/signup';

// Route to handle signup
app.post('/signup', async (req, res) => {
  const { email, password } = req.body;

  // Connect to MongoDB
  const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();

    // Access the database
    const db = client.db();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Store user in the MongoDB collection
    await db.collection('users').insertOne({ email, password });

    return res.status(201).json({ message: 'User registered successfully' });
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
