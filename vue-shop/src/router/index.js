import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//引入一级组件
import DashBoard from "../views/dashboard/DashBoard";
const Home = ()=>import('../views/home/Home');
const CateGory = ()=>import('../views/category/CateGory');
const Cart = ()=>import('../views/cart/Cart');
const Mine = ()=>import('../views/mine/Mine');

//引入组件
const Order = ()=>import('../views/order/Order');
const MyAddress = ()=>import('../views/order/MyAddress')
const AddAddress = ()=>import('../views/order/children/AddAddress')
const OrderDetail = ()=>import('../views/order/children/OrderDetail')
const EditAddress = ()=>import('../views/order/children/EditAddress')
const Login = ()=>import('../views/login/Login')

//用户中心
const UserCenter =()=>import('../views/mine/children/UserCenter')
const MyOrderDetail =()=>import('../views/mine/children/MyOrderDetail')

const routes = [
    {
        path: '/',
        redirect:'/dashboard',
    },
    {
        path: '/dashboard',
        name: 'dashboard',
        component: DashBoard,
        children:[
            { path: '/', redirect:'/dashboard/home'},
            { path: 'home', name:'home',component:Home,meta: {keepalive:true}},
            { path: 'category', name:'category',component:CateGory,meta: {keepalive:true}},
            { path: 'cart', name:'cart',component:Cart},
            {
                path: 'mine',
                name:'mine',
                component:Mine,
                children: [
                    { path: 'userCenter',name:'userCenter',component:UserCenter},//用户中心
                    { path: 'myOrderDetail',name:'myOrderDetail',component:MyOrderDetail}//用户中心
                ],
            },
        ]
    },
    {
        path: '/confirmOrder',
        name: 'order',
        component: Order,
        children: [
            {
              path: 'myAddress',
              name: 'myAddress',
              component:MyAddress,
              children:[
                  //添加地址
                  { path: 'addAddress',name:'addAddress',component:AddAddress},
                  { path: 'editAddress',name:'editAddress',component:EditAddress},

              ]
            },
            { path: 'orderDetail',name:'orderDetail',component:OrderDetail}
        ]
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    }
]

const router = new VueRouter({
  routes
})

export default router
