<template>
    <div id="order">
        <!--导航栏-->
        <van-nav-bar
            title="填写订单"
            left-arrow
            :border=true
            :fixed=true
            @click-left="onClickLeft"
        />
        <!--收货地址-->
        <van-contact-card
            :type="address_type"
            add-text="选择收货地址"
            @click="chooseAddress"
            style="margin-top:3rem"
            :name="address_name"
            :tel="address_tel"
        />
        
        <van-cell-group style="margin-top: 0.6rem">
            <van-cell title="送达时间" :value="arriveDate" is-link @click="showDatePopup"/>
            <router-link :to="{path:'/confirmOrder/orderDetail',name:'orderDetail',params:{dataList:goodsList}}">
                <van-cell :value="`共${checkGoodsCount}件`" is-link :center=true>
                    <template slot="title">
                        <img v-for="(goods,index) in threeShopCart" :src="goods.smallImage" alt="" style="width: 3rem;">
                    </template>
                </van-cell>
            </router-link>
        </van-cell-group>

        <van-cell-group style="margin-top: 0.3rem">
            <van-cell title="支付方式" value="微信"/>
        </van-cell-group>

        <van-cell-group style="margin-top: 0.3rem">
            <van-cell title="备注">
                <input type="text" placeholder="备注您的特殊需求" v-model="notice" style="text-align: inherit;">
            </van-cell>
        </van-cell-group>

        <van-cell-group style="margin-top: 0.3rem">
            <van-cell title="商品价格" :value="`￥${totalPrice}`"/>
            <van-cell title="包装费" :value="`￥${disPrice}`"/>
        </van-cell-group>

        <van-submit-bar
                :price="(totalPrice+disPrice)*100"
                label="实付："
                button-text="提交订单"
                @submit="onSubmit"
        >
        <!--       时间弹出层-->
        <van-popup v-model="show" position="bottom" :style="{ height: '30%' }">
            <van-datetime-picker
                    v-model="currentDate"
                    type="datetime"
                    title="选择完整时间"
                    :min-date="minDate"
                    :max-date="maxDate"
                    @cancel="onDataCancel"
                    @confirm="onDataConfirm"
            />
        </van-popup>

        <!--        二维码弹出层-->
        <van-popup  v-model="isPay" round position="center">
            <qriously :value="qrcode" :size="200" />
        </van-popup>

        </van-submit-bar>
<!--        路由出口-->
        <transition name="router-slider" mode="out-in">
            <router-view @addressinfo="addressInfo"></router-view>
        </transition>

    </div>

</template>

<script>
    import {Toast,ContactCard,ContactList,ContactEdit,Popup,DatetimePicker} from 'vant'
    import Moment from 'moment'
    import {mapState} from 'vuex'
    import {
        postOrder,
        payOrderSuccess,
        getWXcode,
        queryPayStatus,
        getAllSelectGoods,
        delAllSelectGoods
    } from "@/service/api";

    export default {
        name: "Order",
        data(){
            return{
                address_type: 'add',                                 //地址卡片类型
                address_name: null,                                  //联系人
                address_tel: null,                                   //联系人电话
                address_id: null,                                    //选中的地址ID

                show:false,                                          //时间弹出层数据显示
                currentDate: new Date(),                             //当前时间
                minDate: new Date(new Date().getFullYear(),
                    new Date().getMonth(), new Date().getDate(),9),          //最小时间
                maxDate: new Date(new Date().getFullYear(),
                    new Date().getMonth(), new Date().getDate()+3,22),   //最大时间

                arriveDate:'请选择送达时间',                            //送达时间

                totalPrice: 0,                                       //结算商品总价
                checkGoodsCount:0,                                   //结算商品总数
                goodsList:[],                                        //结算商品列表
                threeShopCart:[],                                    //取结算商品的前三件进行显示
                notice:'',                                           //备注

                isPay:false,                                         //二维码弹出层数据显示
                qrcode:null,                                         //生成二维码URL地址
            }
        },
        computed:{
            ...mapState(['shopCart','userInfo']),
            //配送费  商品价格小于30 配送费3
            disPrice(){
                if(this.totalPrice<30){
                    return 3;
                }else {
                    return 0;
                }
            }
        },
        methods: {
            onClickLeft(){
                //返回上一级路由
                this.$router.go(-1);
            },
            //选择地址
            chooseAddress(){
                this.$router.push('/confirmOrder/myAddress')
            },
            //提交订单
            async onSubmit(){
                // alert('submit')
                //数据校验
                if(!this.address_id){
                    Toast({
                        message: '请选择收货地址！',
                        duration: 800,
                    });
                    return ;
                }
                if(this.arriveDate === '请选择送达时间'){
                    Toast({
                        message: '请选择送达时间！',
                        duration: 800,
                    });
                    return ;
                }
                if(!this.notice){
                    Toast({
                        message: '请填写备注信息！',
                        duration: 800,
                    });
                    return ;
                }

                //处理订单相关
                if(this.userInfo.token){
                    //查询购物车订单
                    let goodResult = await getAllSelectGoods(this.userInfo.token);
                    //创建订单
                    if(goodResult.success_code === 200){

                        let orderResult = await postOrder(this.userInfo.token,this.address_id,this.arriveDate,
                                                            goodResult.data,this.notice,this.totalPrice,this.disPrice)
                        console.log(orderResult);
                        //从购物车移除已创建订单的商品
                        if(orderResult.success_code === 200){
                            let delResult = await delAllSelectGoods(this.userInfo.token)
                            console.log(delResult);
                            //发起微信支付
                            if(delResult.success_code === 200){
                                //订单号和支付金额，测试金额写死为1
                                let codeResult = await getWXcode(orderResult.data.order_id,1)
                                console.log(codeResult);
                                if(codeResult.code_url){
                                    this.isPay = true;
                                    this.qrcode = codeResult.code_url;
                                    //验证用户是否扫码支付成功
                                    let payResult = await queryPayStatus(orderResult.data.order_id)
                                    console.log(payResult);
                                    if(payResult.success){
                                        Toast({
                                            message: payResult.message,
                                            duration: 800,
                                        });
                                        this.isPay = false;
                                        //通知本地服务器订单支付成功
                                        let statusResult = await payOrderSuccess(this.userInfo.token,orderResult.data.order_id)
                                        console.log(statusResult);
                                        if(statusResult.success_code === 200){
                                            //跳转到我的
                                            this.$router.replace('/dashboard/mine')
                                            window.sessionStorage.setItem('tabBarActiveIndex',3);
                                        }
                                    }
                                }else{
                                    Toast({
                                        message: '支付处理出现问题！',
                                        duration: 800,
                                    });
                                }

                            }else{
                                Toast({
                                    message: '订单处理出现问题！',
                                    duration: 800,
                                });
                            }
                        }else{
                            Toast({
                                message: '购物车同步出现问题！',
                                duration: 800,
                            });
                        }
                    }else {
                        Toast({
                            message: '获取订单商品失败！',
                            duration: 800,
                        });
                    }
                }
            },
            //接收子组件选中的地址信息，并填充
            addressInfo(item){
                console.log(item.address_id);
                if(item){
                    this.address_type='edit';
                    this.address_name=item.name;
                    this.address_tel=item.tel;
                    this.address_id=item.address_id;
                }
            },
            //控制弹出层
            showDatePopup(){
                this.show=true;
            },
            //日期取消
            onDataCancel(){
                this.show=false;
            },
            //日期确认
            onDataConfirm(value){
                this.show=false;
                this.arriveDate = Moment().format("YYYY-MM-DD HH:mm")  //使用moment格式化时间显示
                //console.log(value);
            },
        },
        mounted(){
            if(this.$route.params){
                this.totalPrice = this.$route.params.totalPrice;
                this.checkGoodsCount = this.$route.params.checkGoodsCount;
                this.goodsList = this.$route.params.goodsList
                this.threeShopCart = this.goodsList.slice(0,3);
            };
        },
    }
</script>

<style lang="less" scoped>
    #order{
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
    }
    .router-slider-enter-active,.router-slider-leave-active{
        transition: all 0.3s;
    }
    .router-slider-enter,.router-slider-leave-active{
        transform: translate3d(2rem,0,0);
        opacity: 0;
    }
</style>