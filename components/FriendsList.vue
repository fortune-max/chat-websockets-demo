<script setup>
    const props = defineProps(["friends"]);
</script>

<template>
    <div class="inline-flex flex-col gap-1 p-1">
        <FriendCard v-for="friend in props.friends" :friend="friend" :key="friend.id" />
    </div>
</template>