<template>
    <div id="myOrderDetail">
        <!--导航栏-->
        <van-nav-bar
                title="我的订单"
                left-arrow
                :border=true
                :fixed=true
                @click-left="onClickLeft"
        />
        <van-tabs
                v-model="activeName"
                style="margin-top: 2rem"
                @click="dealWithTabClick"
        >
            <van-tab title="全部" name="a">
                <MineOrderItem v-for="(order, index) in allOrderArr" :order="order" :key="order._id"/>
            </van-tab>
            <van-tab title="待支付" name="b">
                <MineOrderItem v-for="(order, index) in allWillOrderArr" :order="order" :key="order._id"/>
            </van-tab>
            <van-tab title="待收货" name="c">
                <MineOrderItem v-for="(order, index) in allPayOrderArr" :order="order" :key="order._id"/>
            </van-tab>
        </van-tabs>
    </div>
</template>

<script>
    import MineOrderItem from "../children/components/MineOrderItem";
    import {mapState} from "vuex"
    import {getOrders} from "@/service/api";
    import {Toast} from 'vant'

    export default {
        name: "MyOrderDetail",
        data(){
            return{
                activeName: 'a',                           //选中的标签下标
                allOrderArr:null,                          //全部订单
                allWillOrderArr:null,                      //全部未支付的订单
                allPayOrderArr:null,                       //全部已支付的订单
            }
        },
        computed:{
            ...mapState(['userInfo'])
        },
        components:{
            MineOrderItem
        },
        methods: {
            onClickLeft(){
                //返回上一级路由
                this.$router.go(-1);
            },

            async initOrders(){
                let result = await getOrders(this.userInfo.token);
                console.log(result);
                if(result.success_code === 200){
                    this.allOrderArr = result.data;
                }else{
                    Toast({
                        message:"订单获取失败！",
                        duration:800,
                    })
                }
            },
            async dealWithTabClick(name,title){
                if(name === 'a'){
                    this.allOrderArr = await this.getTabOrder()
                }else if(name === 'b'){
                    this.allWillOrderArr = await this.getTabOrder('will')
                }else if(name === 'c'){
                    this.allPayOrderArr = await this.getTabOrder('pay')
                }
            },
            async getTabOrder(status){
                let result = await getOrders(this.userInfo.token,status);
                console.log(result);
                if(result.success_code === 200){
                    return result.data;
                }else{
                    Toast({
                        message:"订单获取失败！",
                        duration:800,
                    })
                }
            }
        },
        mounted(){
            //获取订单数据
            this.initOrders()
        },
    }
</script>

<style lang="less" scoped>
    #myOrderDetail{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        height: 120%;
        background-color: #f5f5f5;
        z-index: 200;
    }
    //深入覆盖原有样式
    /deep/.van-nav-bar__title{
        color: #000000;
        font-size: 1rem;
        letter-spacing: 0.1rem;
    }
    /deep/.van-tabs__line{
        background-color:#75A342;
    }
    /deep/.van-tab--active{
        color:#75A342;
        font-size: 0.9rem;
    }
</style>