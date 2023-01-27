<script setup>
    const props = defineProps(["friends", "userTyping", "typeTimeout"]);
    console.log("props List", props);
    const userTyping = computed(() => props.userTyping);
    const typeTimeout = computed(() => props.typeTimeout);
</script>

<template>
    <div class="inline-flex flex-col gap-1 p-1">
        <FriendCard :userTyping="userTyping" :typeTimeout="typeTimeout" v-for="(friend, id) in props.friends" :friend="friend" :key="id" />
    </div>
</template>