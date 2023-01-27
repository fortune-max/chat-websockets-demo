<script setup>
    const props = defineProps(["friend", "userTyping", "typeTimeout"]);
    console.log("props Card", props);
    const userNick = computed(() => props.friend.userNick);
    const isOnline = computed(() => props.friend.isOnline);
    const userTyping = computed(() => props.userTyping);
    const typeTimeout = computed(() => props.typeTimeout);
    const isTyping = computed(() => userTyping.value == userNick && typeTimeout > Date.now());
    const state = computed(() => isOnline ? (isTyping ? "Typing": "Online") : "Offline");
    
    // const isOnline = toRef(props.friend.isOnline);
    // const isTyping = ref(props.friend.lastTypingEvent > Date.now());
    // const state = ref(isOnline ? (isTyping ? "Typing": "Online") : "Offline");
    
    // watch(props, () => {
    //     isTyping.value = props.friend.lastTypingEvent > Date.now();
    //     state.value = isOnline ? ((isTyping && false) ? "Typing": "Online") : "Offline";
    // }, {deep : true});

</script>

<template>
    <div class="inline-block p-2 border-2 border-black border-solid rounded-lg" style="background-color: #057e69;">
        {{ userNick }} [{{ state }}]
    </div>
</template>