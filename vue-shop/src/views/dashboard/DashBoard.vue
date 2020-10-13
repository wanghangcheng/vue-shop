<template>
    <div id="dashboard">
        <van-tabbar v-model="active" active-color="#75A342">
            <van-tabbar-item replace to="/dashboard/home">
                <span>首页</span>
                <img slot="icon" slot-scope="props" :src="props.active ? home_icon.active : home_icon.normal" />
            </van-tabbar-item>
            <van-tabbar-item replace to="/dashboard/category">
                <span>分类</span>
                <img slot="icon" slot-scope="props" :src="props.active ? category_icon.active : category_icon.normal" />
            </van-tabbar-item>
            <!-- :badge="goodsNum > 0 ? goodsNum : ''" 动态绑定徽标显示购物车数量-->
            <van-tabbar-item replace to="/dashboard/cart" :badge="goodsNum > 0 ? goodsNum : ''">
                <span>购物车</span>
                <img slot="icon" slot-scope="props" :src="props.active ? cart_icon.active : cart_icon.normal" />
            </van-tabbar-item>
            <van-tabbar-item replace to="/dashboard/mine">
                <span>我的</span>
                <img slot="icon" slot-scope="props" :src="props.active ? mine_icon.active : mine_icon.normal" />
            </van-tabbar-item>
        </van-tabbar>
        <keep-alive>
            <router-view v-if="$route.meta.keepalive"/>
        </keep-alive>
        <router-view v-if="!$route.meta.keepalive"/>

    </div>
</template>

<script>

    import {mapState,mapMutations,mapActions} from 'vuex'
    import state from "@/store/state";
    import {queryUserCart} from "@/service/api";
    import {setStore} from "@/config/global";

    export default {
        name: "DashBoard",
        data() {
            return {
                active: Number(sessionStorage.getItem('tabBarActiveIndex')) || 0,
                home_icon: {
                    normal: require('@/assets/images/tabbar/home_default.png'),
                    active: require('@/assets/images/tabbar/home_selected.png'),
                },
                category_icon: {
                    normal: require('@/assets/images/tabbar/category_default.png'),
                    active: require("@/assets/images/tabbar/category_selected.png"),
                },
                cart_icon: {
                    normal: require('@/assets/images/tabbar/shoppingcart_default.png'),
                    active: require('@/assets/images/tabbar/shoppingcart_selected.png'),
                },
                mine_icon: {
                    normal: require('@/assets/images/tabbar/mine_default.png'),
                    active: require('@/assets/images/tabbar/mine_selected.png'),
                },
            };
        },
        watch : {
            active(value){
                let tabBarActiveIndex = value>0 ? value : 0
                //缓存到本地
                sessionStorage.setItem('tabBarActiveIndex',value);
            }
        },
        computed : {
            //展开state中的shopCart购物车数组数据
            ...mapState(['shopCart','userInfo']),
            //计算购物车中商品的总数量
            goodsNum(){
                //如果购物车中存在商品则计算否则返回0
                if(this.shopCart){
                    //初始化总数量
                    let num = 0;
                    //通过Object对象的values方法可以获取数组中所有键值，
                    //Object.keys()可以获取所有的键名，
                    //之后进行遍历获取商品的num数量，并进行累计
                    Object.values(this.shopCart).forEach((goods,index)=>{
                        num += goods.num;
                    });
                    return num
                }else {
                    return 0;
                }
            },
        },
        mounted(){
            //调用INIT_SHOP_CART方法对购物车数据进行初始化
            //this.INIT_SHOP_CART();
            //用户自动登录
            this.reqUserInfo();
            //this.INIT_USER_INFO();
            this.initShopCart()
        },
        //展开mutation中INIT_SHOP_CART方法
        methods : {
            ...mapMutations(['INIT_SHOP_CART']),
            ...mapActions(['reqUserInfo']),

            //请求服务端用户商品数据
            async initShopCart(){
                if(this.userInfo.token){//存在登录用户
                    let result = await queryUserCart(this.userInfo.token);
                    //console.log(result)
                    if(result.success_code === 200){
                        //获取商品数据以及定义shopCart对象
                        let resultList = result.data;
                        let shopCart ={};
                        //遍历结果以对象格式存储到shopCart中
                        resultList.forEach((value)=>{
                            shopCart[value.goods_id]={
                                'num':value.num,
                                'id':value.goods_id,
                                'name':value.goods_name,
                                'smallImage':value.small_image,
                                'price':value.goods_price,
                                'checked':value.checked,
                            }
                        })
                        //同步到本地和vuex中
                        setStore('shopCart',shopCart);
                        this.INIT_SHOP_CART()
                    }
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    #dashboard{
        width: 100%;
        height: 100%;
        background-color: chocolate;
    }
</style>