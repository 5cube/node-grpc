const mongoose = require('mongoose');

const counterSchema = mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});
const counter = mongoose.model('counter', counterSchema);

const productSchema = mongoose.Schema({
  productId: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: [
      'created',
      'updated',
      'deleted'
    ],
    default: 'created'
  },
  name: { type: String, required: true }
});

productSchema.pre('update', function () {
  this.update({}, { $set: { updatedAt: new Date(), status: 'updated' } });
});

productSchema.pre('save', function (next) {
  const doc = this;
  counter.findByIdAndUpdate(
    { _id: 'productId' },
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
    function (error, counter) {
      if (error) {
        return next(error);
      }
      doc.productId = counter.seq;
      next();
    }
  );
});

module.exports = mongoose.model('Product', productSchema);
