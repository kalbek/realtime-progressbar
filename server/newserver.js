const express = require("express");
const cors = require("cors");
const http = require("http");
const session = require("express-session");

const app = express();
const allowedOrigins = ["http://localhost:5173"];
const httpServer = http.createServer(app);

app.use(cors(allowedOrigins));
app.use(
  session({
    secret: "process.env.SESSION_SECRET",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true, httpOnly: true },
  })
);

// Simulated progress logic (replace with your actual data retrieval process)
app.get("/api/data", async (req, res) => {
  console.log("got mee");
  const expectedDataSize = 10000; // Replace with actual expected size (if known)
  const chunkSize = 100; // Size of simulated progress chunks

  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });

  let sentBytes = 0;

  const sendProgressUpdate = async () => {
    if (sentBytes < expectedDataSize) {
      const progress = (sentBytes / expectedDataSize) * 100;
      res.write(`data: ${progress}\n\n`); // Send progress data as SSE event
      sentBytes += chunkSize;
      await new Promise((resolve) => setTimeout(resolve, 100)); // Simulate delay
      sendProgressUpdate();
    } else {
      res.write(`data: Done\n\n`); // Signal completion
      res.end(); // Close the SSE connection
    }
  };

  sendProgressUpdate();
});

httpServer.listen(4000, () => {
  console.log("Server listening on port 4000");
});
