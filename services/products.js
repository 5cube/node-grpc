const ProductModel = require('../models/product');

const Product = class {
   constructor(payload) {
      this.payload = payload;
   }

   static list(cb) {
      const criteria = {};
      const projections = {
         _id: 0,
         __v: 0
      };
      const options = {
         lean: true
      };
      ProductModel.find(criteria, projections, options, cb);
   }

   add(cb) {
      new ProductModel(this.payload).save(cb);
   }

   fetch(cb) {
      const criteria = this.payload.criteria;
      const projections = this.payload.projections;
      const options = this.payload.options;
      ProductModel.find(criteria, projections, options, cb)
   }

   remove(cb) {
      const criteria = this.payload;
      ProductModel.remove(criteria, cb);
   }
};

module.exports = Product;
