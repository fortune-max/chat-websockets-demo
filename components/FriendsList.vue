<script setup>
    const props = defineProps(["friendsOnlineStatus", "userTyping", "typeTimeout"]);
    console.log("props List", props);
    const { friendsOnlineStatus, userTyping, typeTimeout } = toRefs(props)
</script>

<template>
    <div class="inline-flex flex-col gap-1 p-1">
        <FriendCard v-for="(isOnline, friendNick, index) in friendsOnlineStatus" :isOnline="isOnline" :friendNick="friendNick" :key="index" :userTyping="userTyping" :typeTimeout="typeTimeout" />
    </div>
</template>