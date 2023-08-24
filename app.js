'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { expressjwt: jwt } = require("express-jwt");
const jsonwebtoken = require("jsonwebtoken");
const { errorHandler } = require("./middleware/error.middleware.js");
const { requiresTOTP } = require("./middleware/totp.middleware.js");

const JWT_SECRET = "ssshh! super secret!";

const app = module.exports = express();
const port = process.env.SAMPLE_SERVER_PORT || 3000;
const corsOptions = {
  origin: "*",
  methods: ['GET','POST','DELETE','UPDATE','PUT','PATCH'],
  allowedHeaders: "*",
  preflightContinue: false,
  optionsSuccessStatus: 200,
  credentials: true
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  jwt({
    secret: JWT_SECRET,
    algorithms: ["HS256"],
  }).unless({ path: ["/", "/token"] })
);

app.get('/', (req, res) => {
  res.send({ message: 'Hello World! - ExtaAuth demostation server API' });
});

app.post('/token', (req, res) => {
  const user = {
    id: 1,
    username: 'joedoe@extra-auth.com',
    first: 'Joe',
    last: 'Doe',
    email: 'joedoe@exta-auth.com',
    orgId: 1,
    isAdmin: false,
  };

  // for the sake of this demonstration let's assume the username/password was successfully validated
  jsonwebtoken.sign(
    {
      exp: Math.floor(Date.now() / 1000) + (60 * 60),
      user: user
    }, JWT_SECRET, (err, token) => {
      res.send(token);
    });
});

// Requires Authorization header with Bearer JWT
app.get('/sayHello', (req, res) => {
  res.send({ message: `Hello ${req.query.to} - from ExtraAuth demostration server API` });
});

// Requires Authorization header with Bearer JWT and X-Extra-Auth-Totp token
app.get('/sayHelloTOTP', requiresTOTP, (req, res) => {
  res.send({ message: `Hello ${req.query.to} - from ExtraAuth demostration server API with TOTP` });
});

// Requires Authorization header with Bearer JWT and X-Extra-Auth-Totp token
app.get('/pingTOTP', requiresTOTP, (req, res) => {
  res.send({ message: `Pong - from ExtraAuth demostration server API with TOTP - ${new Date()}` });
});

app.use(errorHandler);

if (!module.parent) {
  app.listen(port);
  console.log(`ExtraAuth demostration app listening on port ${port}`);
};
