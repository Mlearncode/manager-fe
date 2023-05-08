<template>
  <div class="welcome">
    <div class="content">
      <div class="sub-title">欢迎体验</div>  
      <div class="title">Koa通用后台管理系统</div>  
      <div class="desc">-Vue3+ElementPlus+Koa+MongoDB打造通用后台管理系统</div>  
    </div>
    <div class="img"></div>
  </div>
</template>

<script setup>

</script>

<style lang="scss">
.welcome{
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  .content{
    position: relative;
    bottom: 40px;
    .sub-title{
      font-size: 40px;
      line-height: 42px;
      color: #333;
    }
    .title{
      font-size: 50px;
      line-height: 90px;
      color: #3ba87a;
    }
    .desc{
      text-align: right;
      font-size: 16px;
      color: #999;
    }
  }
  .img{
    margin-left: 105px;
    background-image: url('./../assets/Vue.png');
    background-size:100% 100%;
    width: 400px;
    height: 371px;
  }
}
</style>
