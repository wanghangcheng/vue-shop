
//导入mutation-type定义的方法名，以及本地化存储方法
import {ADD_GOODS,
        INIT_SHOP_CART,
        REDUCE_CART,
        SELECTED_SINGER_GOODS,
        SELECTED_ALL_GOODS,
        CLEAR_CART,
        USER_INFO,
        INIT_USER_INFO,
        CLEAR_USER_INFO,
} from './mutations-type'

import {getStore, removeStore, setStore} from './../config/global'
import Vue from 'vue'

export default {
    //添加购物车数据
    [ADD_GOODS](state,{goodsId,goodsname,smallImage,goodsPrice}){
        let shopCart = state.shopCart;
        //判断商品是否存在，存在+1，不存在添加
        if(shopCart[goodsId]){ //存在
            shopCart[goodsId]['num']++;
        }else { //不存在
            shopCart[goodsId]={
                'num':1,
                'id':goodsId,
                'name':goodsname,
                'smallImage':smallImage,
                'price':goodsPrice,
                'checked':true,
            }
        }
        //产生新对象 使用es6写法展开对象，并存储在内存中
        state.shopCart={...shopCart};
        //之后再将state里的shopCart数据存储到本地
        setStore("shopCart",state.shopCart)
    },

    //页面初始化，获取购物车的数据（本地）（本地不存在就通过网络获取，之后再更新本地缓存）
    [INIT_SHOP_CART](state){
        //获取本地数据
        let initCart = getStore("shopCart");
        //如果本地存在数据就通过JSON.parse转成对象存储到vuex的state里方便组件使用
        if(initCart){
            state.shopCart=JSON.parse(initCart);
        }
    },

    //商品移出购物车
    [REDUCE_CART](state,{goodsId}){

        let shopCart = state.shopCart;
        //根据商品id在vuex的state中的shopCart对象数组中查找对应的商品对象
        let goods = shopCart[goodsId];
        //如果存在就根据商品的num进行处理
        if(goods){
            //当产品的num大于0时，让商品的num减一
            if(goods['num']>0){
                goods['num']--;
                //当商品的num减到0时，通过delete将这个id的商品移出shopCart数组
                if(goods['num'] === 0){
                    delete shopCart[goodsId];
                }

            }else {
                goods = null
            }
            //操作结束后，将变更后的shopCart的同步回state中
            //并将state中新的shopCart同步存储到本地缓存中
            state.shopCart = {...shopCart};
            setStore('shopCart',state.shopCart);
        }
    },

    //单个商品的选中和取消选中
    [SELECTED_SINGER_GOODS](state,{goodsId}){

        let shopCart = state.shopCart;
        let goods = shopCart[goodsId];

        if(goods){
            if (goods.checked){  //存在checked属性的话，进行取反
                goods.checked = !goods.checked;
            }else {
                //不存在checked属性的话，就要通过Vue给该对象设置checked属性，并默认为true
                Vue.set(goods,'checked',true);
            }

            //修改完成后对vuex和本地store中的数据进行同步，
            state.shopCart = {...shopCart};
            setStore('shopCart',state.shopCart);
        }

    },

    //所有商品的选中和取消选中
    [SELECTED_ALL_GOODS](state,{isSelected}){

        let shopCart = state.shopCart;
        //遍历shopCart将里面的所有goods的状态进行修改
        Object.values(shopCart).forEach((goods,index)=>{
            if (goods.checked){  //存在checked属性的话，进行取反
                //if(goods.checked == true){
                    goods.checked = !goods.checked;
                //}
            }else {
                //不存在checked属性的话，就要通过Vue给该对象设置checked属性，并默认为true
                Vue.set(goods,'checked',true);
            }
        })
        //同步到vuex中
        state.shopCart = {...shopCart};
    },

    //清空购物车
    [CLEAR_CART](state){
        state.shopCart= {};
        state.shopCart={...state.shopCart};
        setStore("shopCart",state.shopCart)
    },

    //保存用户信息到本地
    [USER_INFO](state,{userInfo}){
        state.userInfo = userInfo;
        setStore("userInfo",state.userInfo);
    },

    //初始化用户信息
    [INIT_USER_INFO](state){
        //获取用户信息
        let userInfo = getStore("userInfo");
        //判断本地是否存在用户信息
        if(userInfo){
            state.userInfo = JSON.parse(userInfo);
        }
    },

    //清空本地用户信息
    [CLEAR_USER_INFO](state){
        state.userInfo = {};//将用户信息置空
        removeStore('userInfo')
        //退出登录后也一起清空当前用户加入的购物车数据
        state.shopCart= {};
        state.shopCart={...state.shopCart};
        setStore("shopCart",state.shopCart)

    }
}