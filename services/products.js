const ProductModel = require('../models/product');

const Product = class {
  constructor(payload) {
    this.payload = payload || {};
  }

  static findAll (cb, offset, limit) {
    offset = offset ? Number(offset) : undefined;
    limit = limit ? Number(limit) : undefined;
    ProductModel.count({}, (err, count) => {
      if (err) {
        console.log(err);
        cb(err, null);
      }
      ProductModel.find()
        .skip(offset)
        .limit(limit)
        .exec()
        .then(docs => {
          const response = {
            total: count,
            result: docs.map(doc => {
              return {
                productId: doc.productId,
                createdAt: Math.round(new Date(doc.createdAt).getTime() / 1000),
                updatedAt: Math.round(new Date(doc.updatedAt).getTime() / 1000),
                status: doc.status,
                name: doc.name
              };
            })
          };
          cb(null, response);
        })
        .catch(err => {
          console.log(err);
          cb(err, null);
        });
    });
  }

  static findById (id, cb) {
    ProductModel.findOne({
      productId: id
    })
      .exec()
      .then(doc => {
        if (!doc) {
          const err = new Error('Not found.');
          console.log(err);
          cb(err, null);
          return false;
        }
        const response = {
          productId: doc.productId,
          createdAt: Math.round(new Date(doc.createdAt).getTime() / 1000),
          updatedAt: Math.round(new Date(doc.updatedAt).getTime() / 1000),
          status: doc.status,
          name: doc.name
        }
        cb(null, response);
      })
      .catch(err => {
        console.log(err);
        cb(err, null);
      });
  }

  static remove (id, cb) {
    ProductModel.remove({
      productId: id
    })
      .exec()
      .then(result => {
        cb(null, { message: 'Deleted.' });
      })
      .catch(err => {
        console.log(err);
        cb(err, null);
      });
  }

  add (cb) {
    const product = new ProductModel(this.payload);
    product.save()
      .then(result => {
        const response = {
          productId: result.productId,
          createdAt: Math.round(new Date(result.createdAt).getTime() / 1000),
          updatedAt: Math.round(new Date(result.updatedAt).getTime() / 1000),
          status: result.status,
          name: result.name
        }
        cb(null, response);
      })
      .catch(err => {
        console.log(err);
        cb(err, null);
      });
  }
};

module.exports = Product;
