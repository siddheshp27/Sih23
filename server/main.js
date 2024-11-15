require('dotenv').config();

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');

const authRoute = require('./routes/auth');
const userRoute = require('./routes/user');
const organizationRoute = require('./routes/organization');

const app = express();
app.set('trust proxy', 1);

// Generate a random secret for the session
function generateSecret(length) {
  return crypto.randomBytes(length).toString('hex');
}

// Session middleware
app.use(
  session({
    secret: generateSecret(64),
    resave: false,
    saveUninitialized: false,
  })
);

// CORS Configuration to allow requests from your Next.js app (running on port 3000)
app.use(
  cors({
    origin: 'http://localhost:3000',  // Allow requests from Next.js
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed methods
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],  // Allowed headers
    credentials: true,  // Allow cookies and sessions to be sent
  })
);

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());

// CSRF protection (optional, remove if not needed)
// const { csrfSync } = require('csrf-sync');
// const { csrfSynchronisedProtection } = csrfSync();
// app.use(csrfSynchronisedProtection);

// Custom headers for CORS
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');  // Allow Next.js
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');  // Allowed methods
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-CSRF-Token');
  res.header('Access-Control-Allow-Credentials', 'true');  // Allow cookies/sessions
  next();
});

// Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/organization', organizationRoute);

// Middleware for JWT authentication
const authMiddleware = (req, res, next) => {
  const token = req.headers && req.headers['authorization'] ? req.headers['authorization'].split(' ')[1] : undefined;
  if (!token) {
    return res.sendStatus(401); // unauthorized
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, data) => {
    if (err) {
      return res.sendStatus(403); // forbidden
    }
    req.user = data;
    next();
  });
};

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  const userRole = await userUtils.getUserRole(req.user.userId);
  if (userRole === 'admin') {
    next();
  } else {
    res.status(403).send(); // forbidden
  }
};

// Example route protected by auth middleware
app.get('/protected', authMiddleware, (req, res) => {
  res.send('This is a protected route');
});

// Start server
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { authMiddleware, isAdmin };
