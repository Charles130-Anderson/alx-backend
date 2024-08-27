import redis from 'redis';
import { promisify } from 'util';

// Create Redis client
const client = redis.createClient();

// Listen for connection events
client.on('connect', () => {
  console.log('Redis client connected to the server');
});
client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

// Promisify the get method of Redis client
const getAsync = promisify(client.get).bind(client);

// Function to set a new school in Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, redis.print);
}

// Function to display the value of a school using async/await
async function displaySchoolValue(schoolName) {
  try {
    const value = await getAsync(schoolName);
    console.log(value);
  } catch (err) {
    console.error(err);
  }
}

// Example usage
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
