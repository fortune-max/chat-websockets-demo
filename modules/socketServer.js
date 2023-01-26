import { Server } from 'socket.io';
import { defineNuxtModule } from '@nuxt/kit';

const userMap = {}; // map socket.id to user nick

// Events: typing, message, system-message; identity, handshake

function sendSystemMessage(socket, message){
    socket.broadcast.emit("system-message", message);
}

function handleNewUser(socket, userNick){
    userMap[socket.id] = userMap[socket.id] || userNick;
    console.log("ID: ", userNick, userMap[socket.id]);
    console.log("UserMap: ", userMap);
    sendSystemMessage(socket, `${userNick} just joined`);
}

function handleDisconnect(socket){
    const userNick = userMap[socket.id];
    console.log("Disconnect: ", userNick, socket.id);
    sendSystemMessage(socket, `${userNick} just left`);
}

function handleIncomingMessage(socket, message){
    const userNick = userMap[socket.id] || "Anonymous";
    console.log(`Message from ${userNick}: ${message}`);
    socket.broadcast.emit("message", { userNick, message });
}

function handleTyping(socket, userNick){
    console.log("Typing: ", userNick);
    socket.broadcast.emit("typing", userNick);
}

export default defineNuxtModule({
    setup(_, nuxt) {
        nuxt.hook("listen", (server) => {
            console.log("Socket listen", server.address(), server.eventNames());
            const io = new Server(server, { cors: { origin: "*" } });

            io.on("connection", (socket) => {
                socket.emit("handshake", "HELO");
                socket.on("identity", (userNick) => {
                    handleNewUser(socket, userNick);
                });
            });

            io.on("connect", (socket) => {
                socket.on("message", (message) => {
                    handleIncomingMessage(socket, message);
                });

                socket.on("typing", () => {
                    handleTyping(socket, userMap[socket.id]);
                });

                socket.on("disconnect", () => {
                    handleDisconnect(socket);
                });
            });

            nuxt.hook("close", () => io.close());
        });
    }
});