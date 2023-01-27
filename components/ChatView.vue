<script setup>
    import { useScroll } from "@vueuse/core";
    const props = defineProps(["messages"]);
    
</script>

<template>
    <div class="inline-flex flex-col gap-1 px-2 py-6 max-w-3xl max-h-96 border-2 border-black overflow-scroll" style="width:700px; height: 1200px; background-image: url('whatsapp_bg.png');">
        <MessageCard v-for="message in props.messages" :message="message" :key="message.id" />
    </div>
</template>