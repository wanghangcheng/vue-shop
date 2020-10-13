<template>
    <div id="mineOrderItem">
        <div class="itemTop">
            <van-cell :title="order.arrive_time" :value="`${order.order_status === 'pay' ? '已支付': '待支付'}`"></van-cell>
        </div>
        <div class="itemCenter">
            <div class="centerLeft">
                <img v-for="(cartGoods, index) in order.cart_shop.slice(0, 5)" :src="cartGoods.small_image" alt="" width="30">
            </div>
            <div class="centerRight">{{order.cart_shop.length > 6 ? '…' : ''}}</div>
        </div>
        <div class="itemBottom">
            <van-cell title=" " :value="`共${order.cart_shop.length}份商品 实付¥${order.shop_price + order.dis_price}`"></van-cell>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MineOrderItem",
        props:{
            order:Object,
        }
    }
</script>

<style lang="less" scoped>
    #mineOrderItem{
        width: 100%;
        height: 8rem;
        background-color: transparent;
        display: flex;
        flex-direction: column;
        font-size: 0.7rem;
        margin: 0.5rem 0;
    }
    #mineOrderItem .itemTop {
        flex: 1;
    }

    #mineOrderItem .itemCenter{
        display: flex;
        flex-direction: row;
        align-items: center;
        background-color: #e0e0e0;
        flex: 2;
    }

    #mineOrderItem .itemCenter .centerLeft{
        flex: 9;
    }

    #mineOrderItem .itemCenter .centerRight{
        flex: 1;
    }

    #mineOrderItem .itemCenter .centerLeft img{
        width: 2.8rem;
        margin: 0.5rem 0.3rem;
    }

    #mineOrderItem .itemBottom{
        flex: 1;
    }
</style>