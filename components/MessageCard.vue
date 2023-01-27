<script setup>
    const props = defineProps(["message"]);
    const isOwnMessage = computed(() => props.message.isOwnMessage);
    const isSystemMessage = computed(() => props.message.isSystemMessage);
    const message = computed(() => props.message.message);
    const userNick = computed(() => props.message.userNick);
</script>

<template>
    <div v-if="isSystemMessage">
        <div class="system-message">{{ message }}</div>
    </div>
    <div class="chat chat-end" v-else-if="isOwnMessage">
        <div class="chat-header">{{ userNick }}</div>
        <div class="chat-bubble chat-bubble-primary">{{ message }}</div>
    </div>
    <div class="chat chat-start"  v-else>
        <div class="chat-header">{{ userNick }}</div>
        <div class="chat-bubble chat-bubble-secondary">{{ message }} </div>
    </div>
</template>

<style scoped>

.system-message {
    margin-left: 200px;
    margin-right: 200px;
    text-align: center;
    border-radius: 10px;
    
    color: #52656f;
    background-color: #fefefe;
}

.chat-header {
    color: black;
}

.chat-bubble-primary {
    background-color: #dff9d5;
    color: black;
}

.chat-bubble-secondary {
    background-color: #f8f8f8;
    color: black;
}

</style>