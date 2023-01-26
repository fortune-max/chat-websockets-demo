<script setup>
  import io from 'socket.io-client'
  let socket;
  const textBox = ref("");

  /*
  Events:
    - handshake, message, typing, identity, system-message
  */

  function setNick(userNick) {
    console.log("setting nick to", userNick);
    socket.emit("identity", userNick + Math.floor(Math.random() * 1000));
  }

  function sendMessage(message) {
    socket.emit("message", message );
  }

  function sendButton() {
    sendMessage(textBox.value);
  }

  function sendTyping() {
    socket.emit("typing", true);
  }

  function handleReceivedMessage(messageBundle) {
    // todo render on DOM
    console.log("rcvd msg =>", messageBundle.userNick, messageBundle.message);
  }

  async function handleTyping (userNick) {
    console.log(userNick, "is typing");
    // todo render on DOM
    // set x user is typing
    await new Promise(resolve => setTimeout(resolve, 1000));
    // set x user is not typing
    console.log(userNick, "is not typing");
  }

  onMounted(() => {
    // only runs on the client
    socket = io();
    socket.on('handshake', () => {
      setNick("Nicky");
    });
    sendMessage("Hello from Nicky");

    socket.on('message', (messageBundle) => {
      handleReceivedMessage(messageBundle);
    });

    socket.on("typing", (userNick) => {
      handleTyping(userNick);
    });
  });

  const dummyFriends = [
    { id: 1, name: 'John', isOnline: true, isTyping: false },
    { id: 2, name: 'Jane', isOnline: false, isTyping: false },
    { id: 3, name: 'Jack', isOnline: true, isTyping: true },
    { id: 4, name: 'Dean', isOnline: false, isTyping: true }
  ]

</script>

<template>
  <div class="bg-emerald-500">
    hello world
  </div>
  <FriendsList :friends="dummyFriends" />
  <input type="text" @input="sendTyping" v-model="textBox" @keyup.enter="sendButton"/>
  <button @click="sendButton">Send</button>
</template>
