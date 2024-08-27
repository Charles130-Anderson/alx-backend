// Import the necessary modules and functions
import { expect } from 'chai'; // Chai for assertions
import kue from 'kue'; // Kue for creating and managing queues
import createPushNotificationsJobs from './8-job.js'; // The function to test

// Describe the test suite for createPushNotificationsJobs
describe('createPushNotificationsJobs', () => {
  let queue;

  // Before running any tests, set up the Kue queue and enter test mode
  before(() => {
    queue = kue.createQueue(); // Create a Kue queue instance
    queue.testMode.enter(); // Enter test mode to interact with the queue without processing jobs
  });

  // After each test, clear the jobs from the queue
  afterEach(() => {
    queue.testMode.clear(); // Clear all jobs from the queue in test mode
  });

  // After all tests have run, exit test mode
  after(() => {
    queue.testMode.exit(); // Exit test mode to return to normal operation
  });

  // Test case to ensure an error is thrown if jobs is not an array
  it('should display an error message if jobs is not an array', () => {
    expect(() => createPushNotificationsJobs({}, queue)).to.throw(
      'Jobs is not an array' // Expected error message
    );
  });

  // Test case to ensure that jobs are correctly created in the queue
  it('should create two new jobs to the queue', () => {
    const jobs = [
      {
        phoneNumber: '4153518780',
        message: 'This is the code 1234 to verify your account',
      },
      {
        phoneNumber: '4153518781',
        message: 'This is the code 4562 to verify your account',
      },
    ];

    // Call the function to create jobs
    createPushNotificationsJobs(jobs, queue);

    // Verify that two jobs were added to the queue
    expect(queue.testMode.jobs.length).to.equal(2); // Check the number of jobs
    // Verify the details of the first job
    expect(queue.testMode.jobs[0].type).to.equal('push_notification_code_3'); // Check the job type
    expect(queue.testMode.jobs[0].data).to.deep.equal(jobs[0]); // Check the job data
    // Verify the details of the second job
    expect(queue.testMode.jobs[1].type).to.equal('push_notification_code_3'); // Check the job type
    expect(queue.testMode.jobs[1].data).to.deep.equal(jobs[1]); // Check the job data
  });
});
