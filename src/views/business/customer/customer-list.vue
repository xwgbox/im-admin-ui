<template>
  <div id="app">
    <TUIKit :SDKAppID="1600075100" userID="customer_01" userSig="eJw1zE0LgkAUheH-MuuQO8o0JLQojAhCEgecViHNNa5mjR9ZEf33zGx5ngPvi6lt7HRYM5*5DrDJsMngpaWMBj7emvZaYn0APt6NKVJryTCfTwFACg7we-BhqcbehRAu-LWl8mtSuJILz5uNFTr19c2iiLosXmqdr-NdflehTasowKSxSXxe7YGHzyrTClU0Z*8Pooo0Xg__" />
    <TUICallKit class="callkit-container" :allowedMinimized="true" :allowedFullScreen="false" />
  </div>
</template>
<script setup>
import { TUIKit } from '/@/TUIKit';
import { TUICallKit } from '@tencentcloud/call-uikit-vue';
</script>
<style lang="scss">
</style>