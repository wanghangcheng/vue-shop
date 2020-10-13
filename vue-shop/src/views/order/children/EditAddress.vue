<template>
    <div id="editAddress">
        <van-nav-bar
                title="修改地址"
                left-arrow
                :border=true
                :fixed=true
                @click-left="onClickLeft"
        ></van-nav-bar>
        <van-address-edit
                :area-list="areaList"
                :address-info="addressInfo"
                show-postal
                show-delete
                show-set-default
                show-search-result
                :search-result="searchResult"
                :area-columns-placeholder="['请选择', '请选择', '请选择']"
                @save="onSave"
                @delete="onDelete"
                style="margin-top: 3rem"
        />
<!--        @change-detail="onChangeDetail"-->
    </div>
</template>

<script>
    import {Toast} from 'vant'
    import areaList from "@/config/area";
    import {mapState,mapMutations} from 'vuex'
    import {delUserAddress, editUserAddress, getUserAddress} from "@/service/api";

    export default {
        name: "EditAddress",
        data() {
            return {
                areaList:areaList,
                searchResult: [],
                addressInfo:{},
            };
        },
        computed:{
            ...mapState(['userInfo']),
        },
        mounted(){
            //通过this.$route.query.address_id获取路由后拼接的参数
            if(this.$route.query.address_id){
                if(this.userInfo.token){
                    this.getCurrentAddress(this.userInfo.token,this.$route.query.address_id)
                }
            }
        },
        methods: {
            onClickLeft(){
                //返回上一级路由
                this.$router.go(-1);
            },
            async onSave(content) {
                if(this.userInfo.token){
                    let result = await editUserAddress(content.id,this.userInfo.token,content.name,content.tel,
                        content.province+content.city+content.county,content.addressDetail,content.postalCode,
                        content.isDefault,content.province,content.city,content.county,content.areaCode);
                    // console.log(result);
                    if (result.success_code === 200){
                        Toast({
                            type:'success',
                            message:'修改成功!',
                            duration: 500,
                        })
                        //使用$emit注册事件通知父组件查询
                        this.$emit('queryuseraddress');
                        this.$router.back();
                    }else{
                        Toast({
                            type:'fail',
                            message:'修改失败!',
                            duration: 500,
                        })
                    }
                }
            },
            async onDelete(content) {
                console.log(content);
                if(content.id){
                    let result = await delUserAddress(content.id);
                    if(result.success_code === 200){
                        Toast({
                            type:'success',
                            message:'删除成功!',
                            duration: 500,
                        })
                        //使用$emit注册事件通知父组件查询
                        this.$emit('queryuseraddress');
                        this.$router.back();
                    }else {
                        Toast({
                            type: 'fail',
                            message: '删除失败!',
                            duration: 500,
                        })
                    }
                }
            },
            onChangeDetail(val) {
                if (val) {
                    this.searchResult = [
                        {
                            name: '黄龙万科中心',
                            address: '杭州市西湖区',
                        },
                    ];
                } else {
                    this.searchResult = [];
                }
            },
            async getCurrentAddress(user_id,address_id){
                let result = await getUserAddress(user_id,address_id);
                if(result.success_code === 200){
                    this.addressInfo = {
                        id: result.data._id,
                        name: result.data.address_name,
                        tel: result.data.address_phone,
                        province: result.data.province,
                        city: result.data.city,
                        county: result.data.county,
                        addressDetail: result.data.address_area_detail,
                        areaCode: result.data.areaCode,
                        postalCode: result.data.address_post_code,
                        isDefault: result.data.address_tag,
                    }
                }
            }
        },
    }
</script>

<style lang="less" scoped>
    #editAddress{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 9999;
    }
</style>