const express = require("express");
const { connectToQueue, publishToQueue } = require("./producer");

const app = express();
const port = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/process-job", async (req, res) => {
  try {
    const jobData = req.body; // Assuming you will send job data in the request body.

    const channel = await connectToQueue();
    await publishToQueue(channel, jobData);

    res.status(202).json({ message: "Job added to the queue successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to add job to the queue." });
  }
});

app.listen(port, () => {
  console.log(`Backend API listening at http://localhost:${port}`);
});
