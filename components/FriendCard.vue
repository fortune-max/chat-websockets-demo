<script setup>
    import { useNow } from '@vueuse/core'
    const props = defineProps(["isOnline", "friendNick", "userTyping", "typeTimeout"]);
    console.log("props Card", props);
    const { isOnline, friendNick, userTyping, typeTimeout } = toRefs(props);
    const now = useNow();
    const state = computed(() => isOnline.value ? (((userTyping.value === friendNick.value) && (typeTimeout.value > now.value)) ? "Typing" : "Online") : "Offline");
</script>

<template>
    <div class="inline-block p-2 border-2 border-black border-solid rounded-lg" style="background-color: #057e69;">
        {{ friendNick }} [{{ state }}]
    </div>
</template>