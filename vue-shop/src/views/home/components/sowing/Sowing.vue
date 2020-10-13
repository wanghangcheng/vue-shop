<template>
    <swiper id="swiper" ref="mySwiper" :options="swiperOptions">
        <swiper-slide v-for="(sowing,index) in sowing_list" :key="sowing_list.public_id">
            <img :src="sowing.icon_url" :alt="sowing.public_name">
        </swiper-slide>
        <div class="swiper-pagination" slot="pagination"></div>
    </swiper>
</template>

<script>
    import { Swiper, SwiperSlide,} from 'vue-awesome-swiper'
    import 'swiper/css/swiper.css'
    export default {
        name: "Sowing",
        props:{
            sowing_list:Array,
        },
        components: {
            Swiper,
            SwiperSlide
        },
        data() {
            return {
                swiperOptions: {
                    notNextTick:true,
                    //分页器
                    pagination: {
                        el: '.swiper-pagination',
                        clickable :true,
                    },
                    //循环
                    loop:true,
                    //切换时长
                    autoplay: {
                        delay: 1000,
                        stopOnLastSlide: false,
                        disableOnInteraction: false,
                    },
                    //速度
                    speed:600,
                    //滑动后回调函数
                    on:{

                    },
                }
            }
        },
        computed:{
            swiper() {
                return this.$refs.mySwiper.$swiper
            }
        },
        mounted() {
            //this.swiper.slideTo(3, 1000, false)
        }
    }
</script>

<style lang="less" scoped>
    #swiper{
        width: 100%;
        height: 14rem;
    }
    #swiper img{
        width: 100%;
        height: 100%;
    }
    //穿透修改样式  加上/deep/
    //更改分页器样式，改为矩形
    /deep/.swiper-pagination-bullets .swiper-pagination-bullet{
        width: .88rem;
        height: .18rem;
        border-radius: 0;
    }
    /deep/.swiper-pagination-bullet-active{
        background: #75A342 !important;
    }
</style>