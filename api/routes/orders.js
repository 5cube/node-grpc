const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handle GET req to /orders'
  });
});

router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity
  }
  res.status(201).json({
    message: 'Order created',
    order: order
  });
});

router.get('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
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

router.patch('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Updated order!'
  });
});

router.delete('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Deleted order!'
  });
});

module.exports = router;