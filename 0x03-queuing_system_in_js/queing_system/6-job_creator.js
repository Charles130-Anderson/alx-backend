const kue = require('kue');
const queue = kue.createQueue();

// Create an object containing the Job data
const jobData = {
  phoneNumber: '123-456-7890',
  message: 'Hello, this is a notification!'
};

// Create a job in the queue
const job = queue.create('push_notification_code', jobData)
  .save((err) => {
    if (err) {
      console.error('Error creating job:', err);
    } else {
      console.log(`Notification job created: ${job.id}`);
    }
  });

// Handle job completion
job.on('complete', () => {
  console.log('Notification job completed');
});

// Handle job failure
job.on('failed', (errorMessage) => {
  console.log('Notification job failed:', errorMessage);
});
