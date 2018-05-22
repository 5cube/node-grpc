const PROTO_PATH = __dirname + '/../protos/product_info.proto';
const HOST = 'product-info.igorserver.ru';
const PORT = '9001';

const grpc = require('grpc');
const proto = grpc.load(PROTO_PATH);

function list (client) {
  client.list({}, (error, response) => {
    if (!error) {
      console.log('Response: ', response);
    } else {
      console.log('Error: ', error.message);
    }
  });
}

function get (client, id) {
  client.get({ productId: id }, (error, response) => {
    if (!error) {
      console.log('Response: ', response);
    } else {
      console.log('Error: ', error.message);
    }
  });
}

function remove (client, id) {
  client.remove({ productId: id }, (error, response) => {
    if (!error) {
      console.log('Response: ', response);
    } else {
      console.log('Error: ', error.message);
    }
  });
}

function insert (client, payload) {
  client.insert({ name: payload.name }, (error, response) => {
    if (!error) {
      console.log('Response : ', response);
    } else {
      console.log('Error :', error.message);
    }
  });
}

function main () {
  const client = new proto.products.ProductService(`${HOST}:${PORT}`, grpc.credentials.createInsecure());
  if (process.argv.length >= 3) {
    if (process.argv[2] === 'get') {
      get(client, Number.parseInt(process.argv[3]));
    } else if (process.argv[2] === 'remove') {
      remove(client, Number.parseInt(process.argv[3]));
    } else if (process.argv[2] === 'insert') {
      insert(client, JSON.parse(process.argv[3]));
    } else {
      console.log('Incorrect argv.');
    }
  } else {
    list(client);
  }
}

main();
