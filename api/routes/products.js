const express = require('express');
const router = express.Router();
const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'geoaction'
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log('Mysql Connected')
});

// GET all products
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handle GET req to /products'
  });
});

// create product
router.post('/', (req, res, next) => {
  const product = {
    name: req.body.name,
    price: req.body.price
  };
  let sql = 'INSERT INTO products(name, price) VALUES(?, ?)';
  let query = db.query(sql, [req.body.name, req.body.price], function (error, result, fields) {
    if (error) throw error;
    console.log(result);
    res.status(201).json({
      message: 'Product created',
      createdProduct: product,
      result: result,
      fields: fields
    });
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  if (id === 'special') {
    res.status(200).json({
      message: 'Special id',
      id: id
    });
  } else {
    res.status(200).json({
      message: 'An id',
      id: id
    });
  }
});

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Updated product!'
  });
});

router.delete('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Deleted product!'
  });
});

module.exports = router;