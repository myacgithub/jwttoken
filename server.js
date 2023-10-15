const express = require('express');

const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');

 

const app = express();

 

app.use(bodyParser.json());

 

// Dummy database to store user data

const users = [];

 

// Secret key for JWT

const secretKey = 'your-secret-key'; // Replace with a strong secret key

 

// API to create a new user

app.post('/create-user', (req, res) => {

  const { username, password } = req.body;

 

  if (!username || !password) {

    return res.status(400).json({ message: 'Username and password are required' });

  }

 

  // Assuming you're storing the user in a database

  users.push({ username, password });

 

  res.json({ message: 'User created successfully' });

});

 

// API to login and get JWT token

app.post('/login-user', (req, res) => {

  const { username, password } = req.body;

 

  const user = users.find(user => user.username === username && user.password === password);

 

  if (!user) {

    return res.status(401).json({ message: 'Invalid username or password' });

  }

 

  const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });

 

  res.json({ token });

});

 

// Middleware to verify JWT token

function verifyToken(req, res, next) {

  const token = req.headers.authorization;

 

  if (!token) {

    return res.status(401).json({ message: 'Token not provided' });

  }

 

  jwt.verify(token.replace('Bearer ', ''), secretKey, (err, decoded) => {

    if (err) {

      return res.status(401).json({ message: 'Invalid token' });

    }

 

    // Attach the decoded user information to the request object for further use

    req.user = decoded;

    next();

  });

}

 

// API to validate user using JWT token

app.get('/validate-user', verifyToken, (req, res) => {

  res.json({ valid: true });

});

 

const PORT = 3000;

app.listen(PORT, () => {

  console.log(`Server is running on http://localhost:${PORT}`);

});