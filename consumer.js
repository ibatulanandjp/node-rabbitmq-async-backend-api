const amqp = require("amqplib");

const QUEUE_NAME = "job_queue";
const RABBITMQ_URI = "amqp://localhost:5672";

async function connectToQueue() {
  try {
    const connection = await amqp.connect(RABBITMQ_URI);
    const channel = await connection.createChannel();
    await channel.assertQueue(QUEUE_NAME, { durable: true });
    return channel;
  } catch (error) {
    console.error("Error connecting to the message queue:", error);
    throw error;
  }
}

async function processJob(jobData) {
  // Implement your logic here to process the long-running job.
  // For example, you can call external APIs, perform database operations, etc.
  console.log("Processing job:", jobData);

  // Simulate a delay to represent the long-running nature of the job.
  await new Promise((resolve) => setTimeout(resolve, 5000));

  console.log("Job processed successfully!");
}

async function startWorker() {
  try {
    const channel = await connectToQueue();

    channel.consume(QUEUE_NAME, async (msg) => {
      const jobData = JSON.parse(msg.content.toString());
      await processJob(jobData);
      channel.ack(msg);
    });
  } catch (error) {
    console.error("Error starting the worker:", error);
  }
}

startWorker();
