const kue = require('kue');
const queue = kue.createQueue();

// Array of blacklisted phone numbers
const blacklistedNumbers = [
  '4153518780',
  '4153518781'
];

// Function to send notifications
const sendNotification = (phoneNumber, message, job, done) => {
  // Track progress of the job
  job.progress(0, 100);

  // Check if phoneNumber is blacklisted
  if (blacklistedNumbers.includes(phoneNumber)) {
    // Fail the job if phone number is blacklisted
    return done(new Error(`Phone number ${phoneNumber} is blacklisted`));
  }

  // Simulate sending the notification
  console.log(`Sending notification to ${phoneNumber}, with message: ${message}`);
  
  // Track progress to 50%
  job.progress(50, 100);
  
  // Complete the job
  done();
};

// Create a queue process
queue.process('push_notification_code_2', 2, (job, done) => {
  const { phoneNumber, message } = job.data;
  sendNotification(phoneNumber, message, job, done);
});

// Handle job completion, failure, and progress
queue.on('job complete', (id) => {
  console.log(`Notification job #${id} completed`);
});

queue.on('job failed', (id, error) => {
  console.log(`Notification job #${id} failed: ${error}`);
});

queue.on('job progress', (id, progress) => {
  console.log(`Notification job #${id} ${progress}% complete`);
});
