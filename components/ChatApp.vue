<script setup>
    import io from 'socket.io-client'
    let socket;
    const onlineStatus = ref({});       // map userNick to isOnline boolean
    const messages = ref([]);
    const textBox = ref("");
    const userTyping = ref("");
    const typeTimeout = ref(0);
    const nickName = ref(false);
    const inputPlaceholder = computed(() => nickName.value ? "Send a message..." : "Enter your nickname...");
    
    function setNick(userNick) {
        console.log("setting nick to", userNick);
        socket.emit("identity", userNick);
        messages.value.push({"message": `You joined the chat as ${userNick}`, isSystemMessage: true});
    }

    function sendMessage(message) {
        socket.emit("message", {userNick: nickName.value, message});
        messages.value.push({"message": message, isOwnMessage: true});
    }

    function sendPrivateMessage(nick, message) {
        socket.emit("priv-msg", {to: nick, userNick: nickName.value, message});
        messages.value.push({"message": message, isOwnMessage: true, userNick: `PM to ${nick}`});
    }

    function sendButton() {
        if (nickName.value === false) {
            setNick(textBox.value);
            nickName.value = textBox.value;
        } else {
            if (textBox.value.startsWith("/pm")){
                const pmNick = textBox.value.split(' ')[1];
                const pmMsg = textBox.value.split(' ').splice(2).join(" ");
                sendPrivateMessage(pmNick, pmMsg);
            } else {
                sendMessage(textBox.value);
            }
        }
        textBox.value = "";
    }

    function sendTyping() {
        if (nickName.value){
            socket.emit("typing", nickName.value);
        }
    }

    function logOut() {
        socket.emit("logout", nickName.value);
        messages.value.push({message: "You left the chat", isSystemMessage: true});
        nickName.value = false;
    }

    function handleReceivedMessage(messageBundle) {
        console.log("rcvd msg =>", messageBundle.userNick, messageBundle.message);
        messages.value.push({message: messageBundle.message, userNick: messageBundle.userNick});
    }

    function handlePrivateMessage(userNick, message){
        messages.value.push({message: message, userNick: `PM from ${userNick}`});
    }

    async function handleTyping (userNick) {
        console.log(userNick, "is typing");
        userTyping.value = userNick;
        typeTimeout.value = Date.now() + 3000;
    }

    function handleSystemMessage(message){
        messages.value.push({message: message, isSystemMessage: true});
    }

    onMounted(() => {
        // only runs on the client
        socket = io();
        socket.on('handshake', (onlineStatus) => {
            console.log("connected to server");
            onlineStatus.value = onlineStatus;
        });

        socket.on('message', (messageBundle) => {
            handleReceivedMessage(messageBundle);
        });

        socket.on("typing", (userNick) => {
            console.log("Recv typing", userNick);
            handleTyping(userNick);
        });

        socket.on("system-message", (message) => {
            handleSystemMessage(message);
        });

        socket.on("priv-msg", ({userNick, message}) => {
            handlePrivateMessage(userNick, message);
        })

        socket.on("add-user", (userNick) => {
            console.log("adduser", userNick);
            onlineStatus.value[userNick] = true;
            console.log(onlineStatus.value);
        });

        socket.on("remove-user", (userNick) => {
            console.log("rmuser", userNick);
            onlineStatus.value[userNick] = false;
        });
    });
</script>

<template>
    <div class="flex items-center gap-2 m-40">
        <FriendsList :friendsOnlineStatus="onlineStatus" :userTyping="userTyping" :typeTimeout="typeTimeout" />
        <div class="flex flex-col items-center gap-2">
            <ChatView :messages="messages"/>
            <div class="flex gap-2">
                <input type="text" v-model="textBox" :placeholder="inputPlaceholder" @input="sendTyping" @keyup.enter="sendButton" class="input input-bordered input-accent w-full max-w-xs"/>
                <button class="btn btn-success" @click="sendButton">Send</button>
                <button class="btn btn-error" @click="logOut">Log Out</button>
            </div>
        </div>
    </div>
</template>
