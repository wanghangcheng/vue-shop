<template>
    <div id="userCenter">
        <!--导航条-->
        <van-nav-bar
            title="用户中心"
            left-arrow
            :border=true
            :fixed=true
            @click-left="$router.go(-1)"
        />
        <van-button class="logout" type="danger" @click="logOut">退出登录</van-button>
    </div>

</template>

<script>
    import {Button,NavBar,Toast} from 'vant'
    import {LogOut} from "@/service/api";
    import {mapMutations} from 'vuex'

    export default {

        name: "UserCenter",
        data(){
            return{

            }
        },
        methods:{

            ...mapMutations(['CLEAR_USER_INFO']),

            async logOut(){

                let result = await LogOut();
                if(result.success_code === 200){
                    this.CLEAR_USER_INFO();
                    Toast({
                        message: '退出登录成功',
                        duration: 800,
                    });
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    #userCenter{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 200;
    }
    /deep/.van-nav-bar__title{
        color: #323233;
        font-size: 1rem;
    }
    .logout{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        height: 2rem;
        width: 80%;
        border-radius: 3rem;
    }
</style>