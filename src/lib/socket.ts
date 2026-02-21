import { Server as HttpServer } from "http";
import { Server } from "socket.io";

let io: Server;

export const initSocket = (httpServer: HttpServer): Server => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.ALLOWED_ORIGINS?.split(","),
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    console.log("Socket.IO initialized");

    io.on("connection", (socket) => {
        console.log("Client connected to WebSocket");

        socket.on("disconnect", () => {
            console.log("Client disconnected");
        });
    });

    return io;
};

export const getIO = (): Server => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};
