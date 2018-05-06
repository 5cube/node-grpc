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
const productService = require('../services/products');

function main () {
  const server = new grpc.Server();

  server.addService(proto.products.ProductService.service, {
    list (call, callback) {
      productService.findAll(callback);
    },
    get (call, callback) {
      productService.findById(call.request.productId, callback);
    },
    remove (call, callback) {
      productService.remove(call.request.productId, callback);
    },
    insert (call, callback) {
      const payload = {
        name: call.request.name
      };
      const product = new productService(payload);
      product.add(callback);
    }
  });

  server.bind('0.0.0.0:50050', grpc.ServerCredentials.createInsecure());
  server.start();
  console.log('grpc server running on port:', '0.0.0.0:50050');
}

main();
