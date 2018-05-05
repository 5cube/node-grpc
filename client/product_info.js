const grpc = require('grpc');

const PROTO_PATH = __dirname + '/../protos/product_info.proto';

const proto = grpc.load(PROTO_PATH);
const client = new proto.products.ProductService('localhost:50050', grpc.credentials.createInsecure());

client.List({}, (error, response) => {
  if (!error) {
    console.log('Response: ', response);
  } else {
    console.log('Error: ', error.message);
  }
});

client.get({
  productId: 860294 // parseInt(Math.random() * 1000000)
}, (error, response) => {
  console.log('error, response : ', error, response)
  if (!error) {
    console.log('Response: ', response)
  } else {
    console.log('Error: ', error.message);
  }
});

client.remove({
  productId: 178646 // parseInt(Math.random() * 1000000)
}, (error, response) => {
  if (!error) {
    console.log('Response: ', response)
  } else {
    console.log('Error: ', error.message);
  }
});

client.Insert({
  productId: parseInt(Math.random() * 1000000),
  name: 'Amulya Kashyap'
}, (error, response) => {
  if (!error) {
    console.log('Response : ', response)
  } else {
    console.log('Error :', error.message);
  }
});
