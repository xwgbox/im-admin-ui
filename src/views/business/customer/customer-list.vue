<template>
  <div id="app">
    <TUIKit :SDKAppID="0" userID="customer_01" userSig="eJw1zF0LgjAYhuH-suOQd7N9JHSQh1FBKXQYojPehrrmskH03zOzw*d64H6RfJdFg3YkISwCspg2Vrr1WOPE5aP3XaPdBeh895UprMWKJFQAgOQU4PfoYNHp0TnnDP7qsfma5EwsFVdyruB1rMNKhJ7eTl3ZBgoZ3lNGN36-PRhzjmWaH4fiqWNUypo1eX8AhCMzSA__" />
    <TUICallKit class="callkit-container" :allowedMinimized="true" :allowedFullScreen="false" />
  </div>
</template>
<script lang="ts" setup>
import { TUIKit } from '/@/TUIKit';
import { TUICallKit } from '@tencentcloud/call-uikit-vue';
</script>
<style lang="scss">
</style>