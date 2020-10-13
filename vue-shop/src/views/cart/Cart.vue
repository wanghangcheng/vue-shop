<template>
    <div id="cart" v-if="userInfo.token">
        <!--头部区域-->
        <header class="titleWrapper">
            <h4><strong style="color: #323233">购物车</strong></h4>
            <button class="clearCart" @click="clearCart">清空购物车</button>
        </header>
        <div class="contentWrapper">
            <!--中间内容-->
            <main class="contentWrapperList">
                <section>
                    <div class="shopCartListCon" v-for="(goods,index) in shopCart" :key="goods.id">
                        <div class="left">
                            <a  href="javascript:;"
                                class="cartCheckBox"
                                :checked="goods.checked"
                                @click.stop="singerGoodsSelected(goods.id)"
                            ></a>
                        </div>
                        <div class="center">
                            <img :src="goods.smallImage" alt="">
                        </div>
                        <div class="right">
                            <a href="#">{{goods.name}}</a>
                            <div class="bottomContent">
                                <p class="shopPrice">{{goods.price|moneyFormat}}</p>
                                <div class="shopDeal">
                                    <span @click="removeOutCart(goods.id,goods.num)">-</span>
                                    <input disabled type="number" v-model="goods.num">
                                    <span @click="addToCart(goods.id,goods.name,goods.smallImage,goods.price)">+</span>
                                </div>
                            </div>
                        </div>
<!--                        <button class="delete-button">删除</button>-->
                    </div>
                </section>
            </main>
            <!--底部通栏-->
            <div class="tabBar">
                <div class="tabBarLeft">
                    <a
                            href="javascript:;"
                            class="cartCheckBox"
                            :checked="isSelectedAll"
                            @click.stop="selectedAll(isSelectedAll)"></a>
                    <span style="font-size: 16px;">全选</span>
                    <div class="selectAll">
                        合计：<span class="totalPrice">{{totalPrice | moneyFormat}}</span>
                    </div>
                </div>
                <div class="tabBarRight">
                    <button class="pay" @click="toPay">
                        去结算({{checkGoodsCount}})
                    </button>
                </div>
            </div>
        </div>
    </div>
    <SelectLogin v-else/>

</template>

<script>

    import {mapState,mapMutations} from 'vuex'
    import {Dialog,Toast,SwipeCell,Cart} from 'vant'
    import SelectLogin from '../login/SelectLogin'
    import {allGoodsSelect, chageGoodsNum, clearUserCart, singerGoodsSelect} from "@/service/api";

    export default {
        name: "cart",
        components:{
            SelectLogin,
        },
        // 使用vuex中的辅助函数mapState，对state中的shopCart对象数组进行展开。
        // 注：mapState操作数组对象时前缀要加...,而且mapState只能放在computed中
        computed:{
            ...mapState(['shopCart','userInfo']),

            //商品总件数
            goodsCount(){
              return Object.values(this.shopCart).length;
            },

            //选中的商品件数
            checkGoodsCount(){
                let count =0;
                Object.values(this.shopCart).forEach((goods,index)=>{
                    if(goods.checked){
                        count++;
                    }
                })
                return count;
            },

            //商品全选,存在商品时 tag为true，遍历商品数组当里面商品全为选中则不触发if tag还是true则全选按钮选中
            //当存在商品没有选中，则触发if tag变为false，全选按钮没有选中
            //当不存在商品时，初始化tag为false
            isSelectedAll(){
                let tag = this.goodsCount > 0;
                Object.values(this.shopCart).forEach((goods,index)=>{
                    if(!goods.checked){
                        tag=false;
                    }
                });
                return tag;
            },
            //商品总价
            totalPrice(){

                let totalPrice = 0;
                Object.values(this.shopCart).forEach((goods,index)=>{
                    if(goods.checked){
                        totalPrice += goods.price * goods.num;
                    }
                });
                return totalPrice;
            },
        },
        methods:{
            ...mapMutations(['REDUCE_CART','ADD_GOODS',
                             'SELECTED_SINGER_GOODS',
                             'SELECTED_ALL_GOODS',
                             'CLEAR_CART'
            ]),
            //数量减少以及移出购物车
            async removeOutCart(goodsId,goodsNum){
                // console.log(goodsNum)
                if(goodsNum>1){
                    let result = await chageGoodsNum(this.userInfo.token,goodsId,'reduce')
                    console.log(result)
                    if(result.success_code === 200){ //数量减少成功
                        this.REDUCE_CART({goodsId});
                    }else{
                        Toast({
                            message: '出了点小问题！',
                            duration: 500,
                        });
                    }
                }else if(goodsNum === 1 ){
                    Dialog.confirm({
                        title: '温馨提示',
                        message: '确定删除该商品吗？',
                    }).then(async () => { //确定
                        let result = await chageGoodsNum(this.userInfo.token,goodsId,'reduce')
                        //console.log(result)
                        if(result.success_code === 200){ //数量减少成功
                            this.REDUCE_CART({goodsId});
                        }else{
                            Toast({
                                message: '出了点小问题！',
                                duration: 500,
                            });
                        }
                    }).catch(()=>{  //取消

                    })
                }
            },
            //添加到购物车
            async addToCart(goodsId,goodsname,smallImage,goodsPrice){
                let result = await chageGoodsNum(this.userInfo.token,goodsId,'add')
                console.log(result)
                if(result.success_code === 200){ //数量增加成功
                    this.ADD_GOODS({
                        goodsId,
                        goodsname,
                        smallImage,
                        goodsPrice
                    })
                }else{
                    Toast({
                        message: '出了点小问题！',
                        duration: 500,
                    });
                }
            },
            //单个商品的选中和取消选中
            async singerGoodsSelected(goodsId){

                let result = await singerGoodsSelect(this.userInfo.token,goodsId);
                if(result.success_code === 200){
                    this.SELECTED_SINGER_GOODS({goodsId});
                }
            },
            //所有商品的选中和取消选中
            async selectedAll(isSelected){

                let result = await allGoodsSelect(this.userInfo.token,isSelected)
                if(result.success_code === 200){
                    this.SELECTED_ALL_GOODS({isSelected});
                }
            },
            //清空购物车
            async clearCart(){
                Dialog.confirm({
                    title: '温馨提示',
                    message: '确定清空购物车吗？',
                }).then(async() => { //确定
                    let result = await clearUserCart(this.userInfo.token);
                    //console.log(result)
                    if(result.success_code === 200){ //数量减少成功
                        this.CLEAR_CART();
                    }else{
                        Toast({
                            message: '出了点小问题！',
                            duration: 500,
                        });
                    }
                }).catch(()=>{  //取消

                })
            },
            //结算方法
            toPay(){
                //console.log(this.checkGoodsCount);
                if(this.checkGoodsCount!=0){
                    let goodsList = [];
                    Object.values(this.shopCart).forEach((goods,index)=>{
                       if(goods.checked){
                           goodsList.push(goods)
                       }
                    });
                    console.log(goodsList);
                    this.$router.push({
                        path:'/confirmOrder',
                        name:'order',
                        params: {
                            checkGoodsCount: this.checkGoodsCount,    //总件数
                            totalPrice: this.totalPrice,              //总价
                            goodsList: goodsList,
                        }
                    });

                }else {
                    Toast({
                        message: '请选择需要结算的商品',
                        duration: 1000,
                    });
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    #cart{
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
    }

    .titleWrapper{
        width: 100%;
        height: 2.6rem;
        background: #fff;
        -webkit-background-size: 0.1rem 4.4rem;
        background-size: 0.1rem 4.4rem;
        position: fixed;
        left: 0;
        top: 0;
        z-index: 999;

        display: flex;
        justify-content: center;
        align-items: center;
    }
    .titleWrapper .clearCart{
        color: red;
        background-color: transparent;
        position: absolute;
        right: 0.3rem;
        font-size: 0.8rem;
    }
    .contentWrapper{
        padding-top: 3.5rem;
    }

    /*列表内容*/
    .contentWrapperList{
        padding-bottom: 6rem;
    }

    .contentWrapperList section{
        background-color: #fff;
    }

    .cartCheckBox{
        background: url('images/shop-icon.png') no-repeat;
        -webkit-background-size: 2.5rem 5rem;
        background-size: 2.5rem 5rem;
        width: 1rem;
        height: 1rem;
    }

    .cartCheckBox[checked]{
        background-position: -1.2rem 0;
    }

    .shopCartListCon{
        display: flex;
        height: 6rem;
        border-bottom:  0.01rem solid #e0e0e0;
        /*margin-bottom: 0.7rem;*/
        /*padding: 0.5rem 0;*/
    }

    .shopCartListCon .left{
        /*background: purple;*/
        flex: 1;
        display: flex;
        /*justify-content: center;*/
    }

    .shopCartListCon .left a{
        display: inline-block;
        margin-top: 0.8rem;
        margin-left: 0.5rem;
    }


    .shopCartListCon .center{
        /*background: blue;*/
        flex: 3;
    }

    .shopCartListCon .center img{
        width: 100%;
        height: 100%;
    }

    .shopCartListCon .right{
        /*background: orangered;*/
        flex: 6;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        margin-left: 0.5rem;
        margin-right: 0.5rem;
        position: relative;
    }

    .shopCartListCon .right a{
        height: 2.2rem;
        line-height: 1.2rem;
        overflow: hidden;
        margin-bottom: 0.3rem;
        font-size: 0.8rem;
        color: #000;
        margin-top: 0.8rem;
    }

    .shopCartListCon .bottomContent{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }

    .shopCartListCon .bottomContent .shopPrice{
        font-size: 0.8rem;
    }

    .shopCartListCon .right .shopDeal span{
        display: inline-block;
        width: 1rem;
        height: 1.2rem;
        line-height: 1.2rem;
        text-align: center;
        float: left;
    }

    .shopCartListCon .right .shopDeal input{
        float: left;
        width: 2rem;
        height: 1.2rem;
        text-align: center;
        margin: 0 0.2rem;
        font-size: 0.8rem;
    }

    /*底部通栏*/
    .tabBar{
        position: fixed;
        left:0;
        bottom:2.7rem;
        width:100%;
        height: 2.5rem;
        background-color: #fff;

        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 0.01rem solid #e0e0e0;
    }

    .tabBarLeft{
        display: flex;
        align-items: center;
        margin-left: 0.5rem;
    }

    .tabBarLeft .selectAll{
        margin-left: 1rem;
        font-size: 1rem;
    }

    .totalPrice{
        color: #E9232C;
    }


    .tabBarRight .pay{
        width:5rem;
        height: 2rem;
        background-color: #f01426;
        border-radius: 1rem;
        margin-right: 0.5rem;

        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1rem;
        color: #fff;
    }
    /*
    .goods-card {
        margin: 0;
        background-color: white;
    }

    .delete-button {
        height: 100%;
        width: 3rem;
        background-color: #f01426;
        color: #FFFFFF;
    }
     */

</style>