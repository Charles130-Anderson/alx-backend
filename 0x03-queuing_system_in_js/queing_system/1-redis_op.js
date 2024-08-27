import redis from 'redis';

// Create Redis client
const client = redis.createClient();

client.on('error', (err) => {
  console.error(`Redis client not connected to the server: ${err}`);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

// Function to set a new value in Redis
function setNewSchool(schoolName, value) {
  client.set(schoolName, value, redis.print); // redis.print logs the reply from Redis
}

// Function to display a value from Redis
function displaySchoolValue(schoolName) {
  client.get(schoolName, (err, reply) => {
    if (err) {
      console.error(`Error retrieving value: ${err}`);
      return;
    }
    console.log(reply); // Logs the value to the console
  });
}

// Test the functions
displaySchoolValue('Holberton');
setNewSchool('HolbertonSanFrancisco', '100');
displaySchoolValue('HolbertonSanFrancisco');
