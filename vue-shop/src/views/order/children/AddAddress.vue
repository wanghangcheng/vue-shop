<template>
    <div id="addAddress">
        <van-nav-bar
                title="添加地址"
                left-arrow
                :border=true
                :fixed=true
                @click-left="onClickLeft"
        ></van-nav-bar>
        <van-address-edit
                :area-list="areaList"
                show-postal
                show-delete
                show-set-default
                show-search-result
                :search-result="searchResult"
                :area-columns-placeholder="['请选择', '请选择', '请选择']"
                @save="onSave"
                style="margin-top: 3rem"
                :tel-validator="telValidator"
        />
<!--        @delete="onDelete"-->
<!--        @change-detail="onChangeDetail"-->
    </div>
</template>

<script>
    import {Toast} from 'vant'
    import areaList from "@/config/area";
    import {addUserAddress} from "@/service/api";
    import {mapState} from 'vuex';

    export default {
        name: "AddAddress",
        data() {
            return {
                areaList: areaList,
                searchResult: [],
            };
        },
        computed:{
            ...mapState(['userInfo']),
        },
        methods: {
            //手机号校验规则
            telValidator(e){
                return /^[1][3,4,5,7,8][0-9]{9}$/.test(e);
            },
            //返回按钮
            onClickLeft(){
                //返回上一级路由
                this.$router.go(-1);
            },
            //保存按钮 content为整个表单内容
            async onSave(content) {
                console.log(content);
                /*
                addressDetail: "杭州市西湖区 黄龙万科中心"
                areaCode: "110105"
                city: "北京市"
                country: ""
                county: "朝阳区"
                isDefault: true
                name: "为启二群二"
                postalCode: "352651"
                province: "北京市"
                tel: "18159646874"
                */
                // console.log(this.userInfo.token)
               if(this.userInfo.token){

                    let result = await addUserAddress(this.userInfo.token,content.name,content.tel,
                        content.province+content.city+content.county,content.addressDetail,content.postalCode,
                        content.isDefault,content.province,content.city,content.county,content.areaCode);
                    // console.log(result);
                    if (result.success_code === 200){
                        Toast({
                            type:'success',
                            message:'添加成功!',
                            duration: 500,
                        })
                        //使用$emit注册事件通知父组件查询
                        this.$emit('queryuseraddress');
                        this.$router.back();
                    }else{
                        Toast({
                            type:'fail',
                            message:'添加失败!',
                            duration: 500,
                        })
                    }
                }
            },
            //当前地址
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
        },
    }
</script>

<style lang="less" scoped>
    #addAddress{
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #f5f5f5;
        z-index: 9999;
    }
</style>