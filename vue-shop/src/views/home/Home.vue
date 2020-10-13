<template>
    <div id="home">
        <div v-if="!showLoading">
            <Header/>
            <Sowing :sowing_list="sowing_list"/>
            <Nav :nav_list="nav_list"/>
            <FlashSale :flash_sale_product_list="flash_sale_product_list"/>
            <YouLike :you_like_product_list="you_like_product_list" class="YouLike"/>
            <MarkPage :scrollToTop="scrollToTop" v-if="showBackStatus"/>
        </div>
        <van-loading
                v-else
                type="spinner"
                color="#75a342"
                style="position: absolute;left: 50%;top: 40%;transform: translate(-50%)"
        >正在拼命加载中...</van-loading>
    </div>
</template>

<script>
    import {getHomeData} from "@/service/api";
    import Header from "./components/header/Header";
    import Sowing from "./components/sowing/Sowing";
    import Nav from "./components/nav/Nav";
    import FlashSale from "./components/flashSale/FlashSale";
    import YouLike from "./components/youlike/YouLike";
    import MarkPage from "./components/markpage/MarkPage";
    //提示组件
    import {Toast} from 'vant'
    //引入处理返回顶部的函数
    import {showBack,animate} from "@/config/global";

    export default {
        name: "Home",
        data(){
            return{
                sowing_list:[],                   //轮播图数据
                nav_list:[],                      //导航数据
                flash_sale_product_list:[],       //秒杀数据
                you_like_product_list:[],         //猜你喜欢数据
                showLoading:true,                 //判断数据是否加载完成
                showBackStatus:false,             //是否显示返回顶部按钮
            }
        },
        created() {

            //同步实现
            this.reqData();
            /*
            异步实现
            getHomeData().then((res) => {
              console.log(res)
              if (res.success){
                  this.sowing_list = res.data.list[0].icon_list;
                  this.nav_list = res.data.list[2].icon_list;
                  this.flash_sale_product_list = res.data.list[3].product_list;
                  this.you_like_product_list = res.data.list[12].product_list;
                  //数据请求完成，隐藏加载动画
                  this.showLoading = false;

                  //开始监听滚动,到达一定位置就显示返回按钮
                  showBack((status)=>{
                      this.showBackStatus = status;
                  });

              }
            }).catch(error => {
              console.log(error);
            })
            */
        },
        components:{
            Header,
            Sowing,
            Nav,
            FlashSale,
            YouLike,
            MarkPage,
        },
        methods:{

            async reqData(){
                let res = await getHomeData();
                console.log(res)
                if (res.success){
                    this.sowing_list = res.data.list[0].icon_list;
                    this.nav_list = res.data.list[2].icon_list;
                    this.flash_sale_product_list = res.data.list[3].product_list;
                    this.you_like_product_list = res.data.list[12].product_list;
                    //数据请求完成，隐藏加载动画
                    this.showLoading = false;

                    //开始监听滚动,到达一定位置就显示返回按钮
                    showBack((status)=>{
                        this.showBackStatus = status;
                    });

                }
            },

            scrollToTop(){
                //做缓动动画，返回顶部
                let docB = document.documentElement || document.body;
                animate(docB,{scrollTop: '0'},400,'ease-out');
            }

        },
    }
</script>

<style lang="less" scoped>
    #home{
        width: 100%;
        height: auto;
        background-color: #f5f5f5;
    }
    .YouLike{
        margin-bottom: 3rem;
    }
</style>