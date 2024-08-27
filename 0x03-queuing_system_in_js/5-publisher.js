import redis from 'redis';

// Create Redis client
const client = redis.createClient();

// On connect
client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// On error
client.on('error', (err) => {
  console.log(`Redis client not connected to the server: ${err}`);
});

// Function to publish messages after a delay
function publishMessage(message, time) {
  setTimeout(() => {
    console.log(`About to send ${message}`);
    client.publish('holberton school channel', message);
  }, time);
}

// Call the publishMessage function with different messages and delays
publishMessage("Holberton Student #1 starts course", 100);
publishMessage("Holberton Student #2 starts course", 200);
publishMessage("KILL_SERVER", 300);
publishMessage("Holberton Student #3 starts course", 400);
