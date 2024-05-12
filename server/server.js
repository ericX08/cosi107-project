const express = require('express')
const app = express()
const cors = require('cors')
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cors())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    next();
})
app.use(express.json({limit:'10mb'}))

//backend code for SQL injections
let db = new sqlite3.Database('mydb.sqlite3', (err) => {
    if(err){
        console.error(err.message);
    }
    console.log('Connected to the access database.');
})

// app.post('/validatePassword', (req, res) => {
//     const { username, password } = req.body;

//     // Unsafe query for educational/testing purposes
//     const unsafeQuery = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

//     console.log("Executing SQL query:", unsafeQuery);

//     db.get(unsafeQuery, (err, row) => {
//         if (err) {
//             console.error('Database error:', err.message);
//             res.status(500).json({ message: 'An error occurred. Please try again later.' });
//             return;
//         }
//         if (row) {
//             res.json({ validation: true, message: 'Login successful' });
//         } else {
//             res.json({ validation: false, message: 'Username or password is incorrect' });
//         }
//     });    
// });

const crypto = require('crypto');

const RANDOM_KEY = crypto.randomBytes(32).toString('hex');

function randomizeSQL(sql) {
  const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'UNION', 'DROP', 'TABLE'];
  const randomizedKeywords = keywords.map(keyword => keyword + RANDOM_KEY);
  
  let randomizedSQL = sql;
  keywords.forEach((keyword, index) => {
    randomizedSQL = randomizedSQL.replace(new RegExp(keyword, 'gi'), randomizedKeywords[index]);
  });
  
  return randomizedSQL;
}

function derandomizeSQL(sql) {
  const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'UNION', 'DROP', 'TABLE'];
  const randomizedKeywords = keywords.map(keyword => keyword + RANDOM_KEY);
  
  let derandomizedSQL = sql;
  randomizedKeywords.forEach((randomizedKeyword, index) => {
    derandomizedSQL = derandomizedSQL.replace(new RegExp(randomizedKeyword, 'gi'), keywords[index]);
  });
  
  return derandomizedSQL;
}

app.post('/validatePassword', (req, res) => {
  const { username, password } = req.body;

  // Validate and sanitize the input
  if (!username || !password) {
    res.status(400).json({ message: 'Username and password are required' });
    return;
  }

  // Escape special characters in the input
  const sanitizedUsername = username.replace(/[^a-zA-Z0-9]/g, '');
  const sanitizedPassword = password.replace(/[^a-zA-Z0-9]/g, '');

  const query = `SELECT * FROM users WHERE username = '${sanitizedUsername}' AND password = '${sanitizedPassword}'`;
  const randomizedQuery = randomizeSQL(query);

  console.log("Executing randomized SQL query:", randomizedQuery);

  const derandomizedQuery = derandomizeSQL(randomizedQuery);
  console.log("Executing derandomized SQL query:", derandomizedQuery);

  db.get(derandomizedQuery, (err, row) => {
    if (err) {
      console.error('Database error:', err.message);
      res.status(500).json({ message: 'An error occurred. Please try again later.' });
      return;
    }
    if (row) {
      res.json({ validation: true, message: 'Login successful' });
    } else {
      res.json({ validation: false, message: 'Username or password is incorrect' });
    }
  });
});

//backend code for XSS attacks

app.post('/submit-content', (req, res) => {
    const { content } = req.body;
    // Append the content to a text file
    fs.appendFileSync('storedContent.txt', `${content}\n`);
    res.send("Content stored!");
});

// Endpoint to get content
app.get('/get-content', (req, res) => {
    const content = fs.readFileSync('storedContent.txt', 'utf8');
    res.json({ content });
});


app.listen(3001, () => console.log('Listening at port 3001'))