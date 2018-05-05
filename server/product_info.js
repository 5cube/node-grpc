const grpc = require('grpc');
const mongoose = require('mongoose');

const dbHost = process.env.DB_HOST || 'localhost';
const dbPort = process.env.DB_PORT || '27017';
const dbName = process.env.DB_NAME || 'test';
const mongoURI = `mongodb://${dbHost}:${dbPort}/${dbName}`;
const connection = mongoose.connection;
mongoose.connect(mongoURI);
connection.on('error', function () {
  throw new Error('Unable to connect to database: ' + mongoURI);
});
mongoose.Promise = global.Promise;

const PROTO_PATH = __dirname + '/../protos/product_info.proto';

const proto = grpc.load(PROTO_PATH);
const server = new grpc.Server();
const productService = require('../services/products');

server.addService(proto.products.ProductService.service, {

  List(call, callback) {
    productService.list(callback);
  },

  get(call, callback) {
    const payload = {
      criteria: {
        productId: call.request.productId
      },
      projections: {
        _id: 0, __v: 0
      },
      options: {
        lean: true
      }
    };
    const product = new productService(payload);
    product.fetch(callback);
  },

  Insert(call, callback) {
    const product = new productService({
      productId: call.request.productId,
      name: call.request.name
    });
    product.add(callback);
  },

  remove(call, callback) {
    const criteria = {
      productId: call.request.productId,
    };
    const product = new productService(criteria);
    product.remove(criteria, callback);
  },
});


server.bind('0.0.0.0:50050', grpc.ServerCredentials.createInsecure());

server.start();
console.log('grpc server running on port:', '0.0.0.0:50050');
