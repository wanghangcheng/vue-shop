<template>
    <div id="categiry">
        <!--头部 -->
        <Header/>
        <!-- 内容-->
        <div class="listWrapper" v-if="!showLoading">
            <!--左边-->
            <div class="leftWrapper">
                <ul class="wrapper">
                    <li
                            class="categoryItem"
                            v-for="(cate,index) in categoriesData"
                            :class="{selected: currentIndex === index}"
                            @click="clickLi(index)"
                            :key="cate.id"
                            ref="menuList"
                    >
                        <span class="textWrapper">{{cate.name}}</span>
                    </li>
                </ul>
            </div>
            <!--右边-->
            <ContentView :categoriesDetailData = "categoriesDetailData" />
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

    import Header from "./components/Header";                 //引入头部组件
    import BScroll from "better-scroll";
    import ContentView from "./components/ContentView";
    import {getCategories, getCategoriesDetail} from "@/service/api";                 //引入滚动组件
    //提示组件
    import {Toast} from 'vant'

    export default {
        name: "category",
        components:{
            Header,
            ContentView,
        },
        data(){
            return{
                showLoading:true,                  //判断数据是否加载完成
                categoriesData:[],                  //左侧列表数据
                categoriesDetailData:[],            //右侧列表数据
                currentIndex: 0,                    //左边Item选中与否
            }
        },
        created(){
            this.initData();
        },
        methods:{

            async initData(){
                //请求左侧列表数据
                let leftRes = await getCategories();
                console.log(leftRes)
                if(leftRes.success){
                    this.categoriesData = leftRes.data.cate;
                }
                //请求右侧列表数据
                let rightRes = await getCategoriesDetail('lk001');
                console.log(rightRes)
                if(rightRes.success){
                    this.categoriesDetailData = rightRes.data.cate;
                }
                //数据请求完成，隐藏加载动画
                this.showLoading = false;
                //初始化滚动框架,通过nextTick让Vue异步执行 DOM 更新左侧导航
                this.$nextTick(()=>{
                   this.leftScroll = new BScroll('.leftWrapper',{probeType:3})
                });
            },
            //点击更新selected选中Item
            async clickLi(index){
                this.currentIndex = index;
                //更新选中的Item后滚动到对应的位置
                //获取左侧菜单列表
                let menuLists = this.$refs.menuList;
                let el = menuLists[index];     //获取列表中点击的Item
                //使用Scroll滚动方法，滚动到点击的Item用时300毫秒
                this.leftScroll.scrollToElement(el,300)
                console.log(index)
                //请求右侧数据
                let rightRes = await getCategoriesDetail(`lk00${index+1}`)
                if(rightRes.success){
                    this.categoriesDetailData = rightRes.data.cate;
                }

            }
        },
    }
</script>

<style lang="less" scoped>
    #categiry{
        width: 100%;
        height: 100%;
        background-color: #f5f5f5;
        overflow: hidden;
    }
    .listWrapper {
        display: flex;
        position: absolute;
        top: 2.75rem;
        bottom: 3rem;
        width: 100%;
        overflow: hidden;
    }

    .leftWrapper {
        background-color: #F4F4F4;
        width: 5.3125rem;
        flex: 0 0 5.3125rem;
    }

    .categoryItem {
        padding: 0.55rem 0;
        border-bottom: solid 1px #E8E9E8;
        position: relative;
    }

    .categoryItem .textWrapper {
        line-height: 1.25rem;
        border-left: solid 0.1875rem transparent;
        padding: 0.3125rem 0.6875rem;
        font-size: 0.8125rem;
        color: #666666;
    }

    .categoryItem.selected {
        background: #FFF;
    }

    .categoryItem.selected .textWrapper {
        border-left-color: #3cb963;
        font-weight: bold;
        font-size: 0.875rem;
        color: #333333;
    }

    @media (min-width: 960px) {
        .wrapper {
            border-right: 1px solid #E8E9E8;
        }

        .wrapper .categoryItem {
            background: #fff;
        }
    }
</style>