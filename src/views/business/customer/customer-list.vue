<template>
  <div v-if="imConfig.SDKAppID">
    <TUIKit :SDKAppID="imConfig.SDKAppID" :userID="imConfig.userID" :userSig="imConfig.userSig"/>
    <TUICallKit class="callkit-container" :allowedMinimized="true" :allowedFullScreen="false"/>
  </div>
</template>
<script setup>
import { TUIKit} from '/@/TUIKit';
import { TUICallKit } from '@tencentcloud/call-uikit-vue';
import {customerApi} from '/@/api/business/im/im-api';
import {smartSentry} from "/@/lib/smart-sentry";

const imConfig = {
  SDKAppID: null,
  userID: "",
  userSig: "",
};

// 查询数据并在组件创建时调用
queryLoginInfo();

async function queryLoginInfo() {
  try {
    let queryResult = await customerApi.queryCustomer();
    imConfig.SDKAppID = queryResult.data.sdkAppId;
    imConfig.userSig = queryResult.data.userSig;
    imConfig.userID = queryResult.data.userId;
  } catch (e) {
    smartSentry.captureError(e);
  } finally {
  }
}

console.log(imConfig)


// TUILogin.login({
//   SDKAppID: 1600075100,
//   userID: 'customer_01',
//   userSig: 'eJw1zE0LgkAUheH-MuuQO8o0JLQojAhCEgecViHNNa5mjR9ZEf33zGx5ngPvi6lt7HRYM5*5DrDJsMngpaWMBj7emvZaYn0APt6NKVJryTCfTwFACg7we-BhqcbehRAu-LWl8mtSuJILz5uNFTr19c2iiLosXmqdr-NdflehTasowKSxSXxe7YGHzyrTClU0Z*8Pooo0Xg__',
//   useUploadPlugin: true,
//   framework,
// }).then(() => {
//   console.log("登录成功")
// })
//     .catch((error) => {console.log("登录失败")})
</script>
<style scoped>
/*.callkit-container {*/
/*  width: 100%;*/
/*  height: 100%;*/
/*}*/
</style>