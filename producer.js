const amqp = require("amqplib");

const QUEUE_NAME = "job_queue";
const RABBITMQ_URI = "amqp://localhost:5672";

let channel = null;

async function connectToQueue() {
  try {
    if (!channel) {
      const connection = await amqp.connect(RABBITMQ_URI);
      channel = await connection.createChannel();
      await channel.assertQueue(QUEUE_NAME, { durable: true });
    }
    return channel;
  } catch (error) {
    console.error("Error connecting to the message queue:", error);
    throw error;
  }
}

async function publishToQueue(channel, jobData) {
  try {
    await channel.sendToQueue(
      QUEUE_NAME,
      Buffer.from(JSON.stringify(jobData)),
      {
        persistent: true,
      }
    );
    console.log("Job sent to the queue:", jobData);
  } catch (error) {
    console.error("Error publishing to the queue:", error);
    throw error;
  }
}

module.exports = {
  connectToQueue,
  publishToQueue,
};
