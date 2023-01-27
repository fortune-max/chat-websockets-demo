<script setup>
    const props = defineProps(["friend", "userTyping", "typeTimeout"]);
    console.log("props Card", props); // toRef(props, 'typeTimeout');
    
    const isOnline = computed(() => props.friend.isOnline);
    const { friend } = toRefs(props);
    const { userTyping } = toRefs(props);
    const { typeTimeout } = toRefs(props);
    const userNick = computed(() => props.friend.userNick);
    const isTyping = computed(() => (userTyping.value == userNick) && (typeTimeout > Date.now()));
    // const state = computed(() => isOnline ? (isTyping ? "Typing": "Online") : "Offline");
    const state = computed(() => props.friend.isOnline ? "Online" : "Offline");
    
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