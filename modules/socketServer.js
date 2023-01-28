import { Server } from 'socket.io';
import { defineNuxtModule } from '@nuxt/kit';

const userMap = {}; // map userNick to { isOnline boolean, socket object }

function sendSystemMessage(socket, message){
    socket.broadcast.emit("system-message", message);
}

function handleNewUser(socket, userNick){
    userMap[userNick] = {
        isOnline: true,
        socket,     // only used on server side for private messages
    }
    socket.broadcast.emit("add-user", userNick);
    sendSystemMessage(socket, `${userNick} just joined`);
    console.log("sent add-user", userNick);
}

function handleDisconnect(socket, userNick){
    console.log("Disconnect 2: ", userNick);
    sendSystemMessage(socket, `${userNick} just left`);
    socket.broadcast.emit("remove-user", userNick);
    userMap.isOnline = false;
}

function handleIncomingMessage(socket, userNick, message){
    console.log(`Message from ${userNick}: ${message}`);
    socket.broadcast.emit("message", { userNick, message });
}

function handleTyping(socket, userNick){
    console.log("BC Typing: ", userNick);
    socket.broadcast.emit("typing", userNick);
}

function userMapToOnlineStatus(userMap){
    return Object.keys(userMap).reduce((acc, userNick) => {
        acc[userNick] = userMap[userNick].isOnline;
        return acc;
    }, {});
}

export default defineNuxtModule({
    setup(_, nuxt) {
        nuxt.hook("listen", (server) => {
            console.log("Socket listen", server.address());
            const io = new Server(server, { cors: { origin: "*" } });

            io.on("connection", (socket) => {
                socket.emit("handshake", userMapToOnlineStatus(userMap));
                socket.on("identity", (userNick) => {
                    handleNewUser(socket, userNick);
                });
            });

            io.on("connect", (socket) => {
                socket.on("message", ({userNick, message}) => {
                    console.log("usernick:", userNick, "message:", message);
                    handleIncomingMessage(socket, userNick, message);
                });

                socket.on("typing", (userNick) => {
                    console.log("Typing event rcvd: ", userNick);
                    handleTyping(socket, userNick);
                });

                socket.on("logout", (userNick) => {
                    console.log("Disconnect: ", userNick);
                    handleDisconnect(socket, userNick);
                });

                socket.on("priv-msg", ({to, userNick, message}) => {
                    userMap[to].socket.emit("priv-msg", {userNick, message});
                });
            });

            nuxt.hook("close", () => io.close());
        });
    }
});