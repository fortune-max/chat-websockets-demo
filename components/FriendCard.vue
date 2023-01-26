<script setup>
    const props = defineProps(["friend"]);
    const isOnline = computed(() => props.friend.isOnline);
    const isTyping = computed(() => props.friend.isTyping);
</script>

<template>
    <div class="inline-block p-2 bg-pink-500 border-2 border-black border-solid">
        {{ props.friend.name }} [{{ isOnline ? (isTyping ? 'Typing': 'Online') : 'Offline' }}]
    </div>
</template>