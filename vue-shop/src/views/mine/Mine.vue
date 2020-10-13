<template>
    <div id="mine" v-if="userInfo.token">
        <van-nav-bar
            title="我的"
            :fixed=true
            :border=false
        />

        <van-cell-group style="margin-top: 2.3rem">
            <van-cell
                style="background-color: #3bba63;color: #FFFFFF"
                :centent=true
                @click="$router.push('/dashboard/mine/userCenter')"
            >
                <!-- 使用 title 插槽来自定义标题 -->
                <template #title>
                   <div class="personMsg">
                       <img :src="getImag(userInfo.icon_url)" alt="">
                       <div class="personInfo">
                           <span>{{userInfo.real_name}}</span>
                           <span v-if="userInfo.user_name!=null">用户名：{{userInfo.user_name}}</span>
                           <span v-else>手机号：{{userInfo.phone}}</span>
                       </div>
                   </div>
                </template>
            </van-cell>
        </van-cell-group>

        <router-link tag="div" :to="{path:'/dashboard/mine/myOrderDetail'}">
            <van-cell-group>
                <van-cell icon="bookmark" title="我的订单" value="查看所有订单信息" @click="goMyOrder" is-link />
                <van-grid>
                    <van-grid-item
                            v-for="(order,index) in orderDate"
                            :key="index"
                            :icon="order.icon"
                            :text="order.text"
                    />
                </van-grid>
            </van-cell-group>
        </router-link>

        <van-cell-group style="margin-top: 0.6rem">
            <van-cell icon="bill" title="我的优惠券" value="2张" is-link />
            <van-cell icon="location" title="我的收货地址" @click="goAddress" is-link>
            </van-cell>

        </van-cell-group>

        <van-cell-group style="margin-top: 0.6rem">
            <van-cell icon="phone" title="联系客服" value="客服时间 7:00-22:00" is-link />
            <van-cell icon="graphic" title="意见反馈" is-link />
        </van-cell-group>

        <van-cell-group style="margin-top: 0.6rem">
            <van-cell icon="award" title="APP下载" value="下载App体验" is-link />
        </van-cell-group>

        <!--        路由出口-->
        <transition name="router-slider" mode="out-in">
            <router-view></router-view>
        </transition>
    </div>
    <SelectLogin v-else/>
</template>

<script>
    import {mapState,mapMutations} from 'vuex'
    import SelectLogin from '../login/SelectLogin'

    export default {
        name: "mine",
        components:{
            SelectLogin
        },
        computed:{
            ...mapState(['userInfo']),
        },
        data(){
            return{
                orderDate:[
                    {icon:"balance-pay",text:"待支付"},
                    {icon:"gift-card-o",text:"待收货"},
                    {icon:"chat-o",text:"待评价"},
                    {icon:"records",text:"售后/退款"}
                ],
            }
        },
        methods:{

            getImag(path){
                return require("../../assets/images/"+path);
            },
            goAddress(){
                this.$router.push('/confirmOrder/myAddress');
            },
            goMyOrder(){
                this.$router.push('/dashboard/mine/myOrderDetail');
            }
        },
    }
</script>

<style lang="less" scoped>
    #mine{
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
    }
    .van-nav-bar{
        background-color: #3bba63;
    }
    //深入覆盖原有样式
    /deep/.van-nav-bar__title{
        color: #FFFFFF;
        font-size: 1rem;
        letter-spacing: 0.1rem;
    }
    .personMsg{
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .personMsg > img{
        width: 4rem;
        height: 4rem;
        border-radius: 2rem;
        border: 0.12rem solid #FFFFFF;
    }
    .personInfo{
        display: flex;
        flex-direction: column;
        margin-left: 0.8rem;
        margin-top: 1.2rem;
    }
    /deep/.van-cell__left-icon{
        color: orangered;
        font-size: 1.2rem;
    }
    .router-slider-enter-active,.router-slider-leave-active{
        transition: all 0.3s;
    }
    .router-slider-enter,.router-slider-leave-active{
        transform: translate3d(2rem,0,0);
        opacity: 0;
    }
</style>