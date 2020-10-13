<template>
    <div id="orderDetail">
        <!--导航栏-->
        <van-nav-bar
                title="商品清单"
                left-arrow
                :border=true
                :fixed=true
                @click-left="onClickLeft"
        />
        <van-cell-group style="margin-top: 3rem">
            <van-cell title="商品" :value="`共${checkGoodsCount}件`"/>
            <!--商品卡片-->
            <van-card v-for="(goods,index) in list"
                    :key="goods.id"
                    :num="goods.num"
                    :price="goods.price"
                    :title="goods.name"
                    :thumb="goods.smallImage"
            />
        </van-cell-group>
    </div>
</template>

<script>
    import {Toast,Card} from 'vant'

    export default {
        name: "OrderDetail",
        data(){
            return{
                list:[],                          //商品列表
                checkGoodsCount:0,                //商品件数
            }
        },
        methods: {
            onClickLeft(){
                //返回上一级路由
                this.$router.go(-1);
            },
        },
        mounted(){
            if(this.$route.params.dataList){
                this.list = this.$route.params.dataList;
                this.checkGoodsCount = this.list.length;
            };
        },
    }
</script>

<style lang="less" scoped>
    #orderDetail{
        position: fixed;
        top: 0;
        bottom: 0;
        right: 0;
        left: 0;
        background-color: #f5f5f5;
        z-index: 200;
    }
</style>