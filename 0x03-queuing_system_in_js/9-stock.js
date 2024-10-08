// Import required modules
import express from 'express';
import redis from 'redis';
import { promisify } from 'util';

// Initialize the Express app
const app = express();
const port = 1245;

// Initialize Redis client and promisify it
const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

// Sample data for products
const listProducts = [
  { id: 1, name: 'Suitcase 250', price: 50, stock: 4 },
  { id: 2, name: 'Suitcase 450', price: 100, stock: 10 },
  { id: 3, name: 'Suitcase 650', price: 350, stock: 2 },
  { id: 4, name: 'Suitcase 1050', price: 550, stock: 5 },
];

// Function to get item by ID
function getItemById(id) {
  return listProducts.find(product => product.id === id);
}

// Route to get the list of products
app.get('/list_products', (req, res) => {
  const products = listProducts.map(product => ({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock
  }));
  res.json(products);
});

// Route to get product by ID
app.get('/list_products/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const id = parseInt(itemId, 10);
  const product = getItemById(id);

  if (!product) {
    return res.json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(id);
  const availableStock = product.stock - reservedStock;

  res.json({
    itemId: product.id,
    itemName: product.name,
    price: product.price,
    initialAvailableQuantity: product.stock,
    currentQuantity: availableStock
  });
});

// Function to reserve stock by ID
async function reserveStockById(itemId, stock) {
  await setAsync(`item.${itemId}`, stock);
}

// Function to get current reserved stock by ID
async function getCurrentReservedStockById(itemId) {
  const reservedStock = await getAsync(`item.${itemId}`);
  return parseInt(reservedStock, 10) || 0;
}

// Route to reserve a product
app.get('/reserve_product/:itemId', async (req, res) => {
  const { itemId } = req.params;
  const id = parseInt(itemId, 10);
  const product = getItemById(id);

  if (!product) {
    return res.json({ status: 'Product not found' });
  }

  const reservedStock = await getCurrentReservedStockById(id);
  const availableStock = product.stock - reservedStock;

  if (availableStock <= 0) {
    return res.json({
      status: 'Not enough stock available',
      itemId: id
    });
  }

  await reserveStockById(id, reservedStock + 1);
  res.json({
    status: 'Reservation confirmed',
    itemId: id
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
