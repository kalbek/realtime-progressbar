const express = require("express");
const cors = require("cors");

const app = express();
const allowedOrigins = ["http://localhost:5173"];

app.use(cors(allowedOrigins));

const socketio = require("socket.io");
const http = require("http");
const httpServer = http.createServer(app);
const session = require("express-session");
const io = socketio(httpServer, {
  origin: "http://localhost:5173",
});

const sessionMiddleware = session({
  secret: "process.env.SESSION_SECRET",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true, httpOnly: true },
});
app.use(sessionMiddleware);
io.engine.use(sessionMiddleware);
app.set("socketio", io);
// Simulated progress logic (replace with your actual data retrieval process)
app.get("/api/data", (req, res) => {
  console.log("Client connected!");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const expectedDataSize = 10000; // Replace with actual expected size (if known)
  const chunkSize = 100; // Size of simulated progress chunks

  let sentBytes = 0;

  //   res.writeHead(200, {
  //     "Content-Type": "text/event-stream",
  //     "Cache-Control": "no-cache",
  //     Connection: "keep-alive",
  //   });
  const intervalId = setInterval(() => {
    const date = new Date().toDateString();
    let progress;

    if (sentBytes < expectedDataSize) {
      progress = ((sentBytes / expectedDataSize) * 100).toLocaleString();
      console.log("progress: ", progress);
      console.log("typeof progress ", typeof progress.toLocaleString());
      //   res.write(JSON.stringify({ progress }));
      res.write(`data: ${progress}\n\n`);
      //   res.write(`${progress}`);
      //   res.write(progress.toString());
      res.status(200);
      sentBytes += chunkSize;
      //   setTimeout(sendProgressUpdate, 100); // Simulate delay between chunks
    } else {
      res.end(JSON.stringify({ data: "Your actual data" })); // Send actual data
    }
  }, 1000);
  const sendProgressUpdate = async () => {
    // const io = require("socket.io")(server, {
    //   pingTimeout: 60000,
    //   cors: { origin: "http://localhost:3000" },
    // });
    // if (sentBytes < expectedDataSize) {
    //   const progress = (sentBytes / expectedDataSize) * 100;
    //   res.write(JSON.stringify({ progress }));
    //   res.status(200);
    //   sentBytes += chunkSize;
    //   setTimeout(sendProgressUpdate, 100); // Simulate delay between chunks
    // } else {
    //   res.end(JSON.stringify({ data: "Your actual data" })); // Send actual data
    // }
  };

  sendProgressUpdate();

  res.on("close", () => {
    console.log("Client closed connection.");
    clearInterval(intervalId);
    res.end();
  });
});

httpServer.listen(4000, () => {
  console.log("Server listening on port 4000");
});

// io.on("connection", (socket) => {
//   console.log("connected to soccet.io");
// });
