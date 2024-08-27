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

// Subscribe to the channel
client.subscribe('holberton school channel');

// When a message is received
client.on('message', (channel, message) => {
  console.log(message);

  // If the message is 'KILL_SERVER', unsubscribe and quit
  if (message === 'KILL_SERVER') {
    client.unsubscribe();
    client.quit();
  }
});
