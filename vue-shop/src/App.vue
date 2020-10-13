<template>
    <div id="app">
        <transition name="router-slider" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
</template>
<style lang="less">
    #app {
        width: 100%;
        height: 100%;
    }
    .router-slider-enter-active,.router-slider-leave-active{
        transition: all 0.3s;
    }
    .router-slider-enter,.router-slider-leave-active{
        transform: translate3d(2rem,0,0);
        opacity: 0;
    }
</style>
