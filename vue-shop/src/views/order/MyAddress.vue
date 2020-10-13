<template>
    <div id="myAddress">
        <van-nav-bar
                title="我的地址"
                left-arrow
                :border=true
                :fixed=true
                @click-left="onClickLeft"
        />
        <van-address-list
                v-model="chosenAddressId"
                :list="list"
                default-tag-text="默认"
                @add="onAdd"
                @edit="onEdit"
                style="margin-top:2.5rem"
                @select="onBackAddress"
        />
        <transition name="router-slider" mode="out-in">
            <router-view @queryuseraddress="queryUserAddress"></router-view>
        </transition>
    </div>
</template>

<script>
    import {Toast} from 'vant'
    import {getUserAddressAll} from "@/service/api";
    import {mapState,mapMutations} from 'vuex'

    export default {
        name: "MyAddres",
        data() {
            return {
                chosenAddressId: '2',    //选中的数据index
                list: [],                //列表数据
            };
        },
        computed:{
            ...mapState(['userInfo']),
        },
        methods: {
            ...mapMutations(['INIT_USER_INFO']),

            //查询用户地址信息
            async queryUserAddress(){
                let result = await getUserAddressAll(this.userInfo.token);
                if(result.success_code === 200 ){
                    let addressList = result.data;
                    //console.log(addressList)
                    this.list=[];
                    addressList.forEach((address,index)=>{
                        let addressObj={
                            id: String(index+1),
                            name: address.address_name,
                            tel: address.address_phone,
                            address: address.address_area+address.address_area_detail,
                            address_id: address._id,
                            user_id: address.user_id,
                            isDefault: address.address_tag

                        }

                        //追加进list数组
                        this.list.push(addressObj)
                    });
                    //遍历list将默认地址标记为选中
                    this.defaultAddress();

                }else {
                    Toast({
                        type:'fail',
                        message:'获取地址失败!',
                        duration: 500,
                    })
                }
            },

            onClickLeft(){
                this.$router.go(-1);
            },

            onAdd() {
                //Toast('新增地址');
                this.$router.push({
                    path:'/confirmOrder/myAddress/addAddress',
                })
            },

            onEdit(item, index) {
                //Toast('编辑地址:' + index);
                //console.log(item)
                this.$router.push({
                    path:'/confirmOrder/myAddress/editAddress?address_id='+item.address_id,
                })
            },

            //默认中为默认地址
            defaultAddress(){
                this.list.forEach((obj,index)=>{
                    console.log(obj);
                    if(obj.isDefault == true){
                        this.chosenAddressId = obj.id;
                    }
                })
            },

            onBackAddress(item,index){
                console.log(item,index)
                if(item) {
                    this.$emit('addressinfo',item);
                    this.$router.back();

                }
            }
        },
        mounted(){
            this.queryUserAddress();
            this.defaultAddress();
        },
        beforeMount(){
            //页面挂载前同步本地的用户信息到vuex中
            this.INIT_USER_INFO();
        },
    }
</script>

<style lang="less" scoped>
    #myAddress{
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 200;
    }
    .router-slider-enter-active,.router-slider-leave-active{
        transition: all 0.3s;
    }
    .router-slider-enter,.router-slider-leave-active{
        transform: translate3d(2rem,0,0);
        opacity: 0;
    }
</style>