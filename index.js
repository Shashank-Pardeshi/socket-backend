import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import { registerSocketEvents } from "./socket/socketHandler.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// const userClasses = new Map();

io.on("connection", (socket) => {
  registerSocketEvents(socket, io);
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
