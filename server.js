const express = require('express');
require('dotenv').config();
var jwt = require('express-jwt');
var jwks = require('jwks-rsa');
const checkScope = require('express-jwt-authz');
const app = express();

var jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://bekhzod-akhrorov-dev.eu.auth0.com/.well-known/jwks.json',
  }),
  audience: process.env.REACT_APP_AUTH0_AUDIENCE,
  issuer: 'https://bekhzod-akhrorov-dev.eu.auth0.com/',
  algorithms: ['RS256'],
});

app.get('/public', (req, res) => {
  res.json({
    message: 'Hello from Public API',
  });
});

app.get('/private', jwtCheck, (req, res) => {
  res.json({
    message: 'Hello from Private API',
  });
});

app.get('/courses', jwtCheck, checkScope(['read:courses']), (req, res) => {
  res.json({
    courses: [
      { id: 1, title: 'Build React App with Readux' },
      { id: 2, title: 'Create reusable React Component' },
    ],
  });
});

function checkRole(role) {
  return (req, res, next) => {
    const assignedRoles = req.user['http://localhost:3000/roles'];
    if (Array.isArray(assignedRoles) && assignedRoles.includes(role)) {
      return next();
    } else {
      return res.status(401).send('Insufficient role');
    }
  };
}

app.get('/admin', jwtCheck, checkRole('admin'), (req, res) => {
  res.json({
    message: 'Hello from Admin API',
  });
});

// app.use(jwtCheck);
app.get('/authorized', (req, res) => {
  res.send('Secured Resource');
});

app.listen(3001);
console.log('Api server listening on ' + process.env.REACT_APP_AUTH0_AUDIENCE);
