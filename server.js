const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Allow requests from all origins

// Add this code before defining your routes

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

app.options('*', cors(corsOptions)); // Enable preflight requests for all routes

// Use the cors middleware with specific options
app.use(cors(corsOptions));


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'myapp'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');
});

// Define the route for the contact form
app.post('/contact', (req, res) => {
    const { email, message, name } = req.body;

    // Validate input
    if (!email || !message || !name) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    // Save the contact information to the database
    const sql = 'INSERT INTO contacts (email, message, name) VALUES (?, ?, ?)';
    connection.query(sql, [email, message, name], (err, result) => {
        if (err) {
            console.error('Error saving contact information:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
        console.log('Contact information saved successfully');
        res.status(200).json({ message: 'Your message has been received. We will get back to you soon.' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


