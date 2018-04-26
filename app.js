const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const mysql = require('mysql');

// const productsRoutes = require('./api/routes/products');
// const ordersRoutes = require('./api/routes/orders');
const filesRoutes = require('./api/routes/files');

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, PATCH, DELETE');
    return res.status(200).json({});
  }
  next();
});

// Routes
// app.use('/products', productsRoutes);
// app.use('/orders', ordersRoutes);
app.use('/files', filesRoutes);

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

module.exports = app;
