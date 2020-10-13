//封装接口，调用axios的方法完成请求
import ajax from './ajax'

/*
    数据请求路径
    首页：http://demo.itlike.com/web/xlmc/api/homeApi
    分类左侧：http://demo.itlike.com/web/xlmc/api/homeApi/categories
    分类内容：http://demo.itlike.com/web/xlmc/api/homeApi/categoriesdetail/lk001
    其他：lk001-lk006
*/

//定义基础路径
const BASE_URL='http://demo.itlike.com/web/xlmc'

//请求首页数据
export const getHomeData = ()=>ajax(BASE_URL + '/api/homeApi');
//请求分类数据
export const getCategories = ()=>ajax(BASE_URL + '/api/homeApi/categories');
//根据分类请求商品数据
export const getCategoriesDetail = (preParams)=>ajax(BASE_URL + '/api/homeApi/categoriesdetail/'+preParams)


//定义本地基础路径
const LOCAL_URL='/api/'

//请求手机验证码 get
export const getPhoneCode = (phone)=>ajax(LOCAL_URL + 'api/send_code',{phone})
//手机验证码登录 post
export const PhoneCodeLogin = (phone,code)=>ajax(LOCAL_URL + 'api/login_code',{phone,code},'POST')
//用户名密码登录 post
export const NamePwdLogin = (username,pwd,captcha)=>ajax(LOCAL_URL + 'api/login_pwd',{username,pwd,captcha},'POST')

//自动登录
export const getUserInfo = () => ajax(LOCAL_URL + 'api/userinfo')
//退出登录
export const LogOut = () => ajax(LOCAL_URL + 'api/logout')

//商品添加到购物车（服务端）
export const addCart= (user_id,goods_id,goods_name,goods_price,small_image)=> ajax(LOCAL_URL + 'api/cart/add',
    {user_id,goods_id,goods_name,goods_price,small_image},'POST')

//查询当前用户的购物车
export const queryUserCart = (user_id)=>ajax(LOCAL_URL + 'api/cart/search/'+user_id);

//修改当前用户购物车商品数量
export const chageGoodsNum = (user_id,goods_id,type)=>ajax(LOCAL_URL + 'api/cart/num',{user_id,goods_id,type},'POST');

//删除当前用户购物车中所有商品
export const clearUserCart = (user_id)=>ajax(LOCAL_URL + 'api/cart/clear/'+user_id);

//单个商品的选中和取消选中
export const singerGoodsSelect = (user_id,goods_id)=>ajax(LOCAL_URL + 'api/cart/singer_select',{user_id,goods_id},'POST')

//所有商品的选中和取消选中
export const allGoodsSelect = (user_id,flag)=>ajax(LOCAL_URL + 'api/cart/all_select',{user_id,flag},'POST')

//查询所有已经被选中的商品
export const getAllSelectGoods = (user_id)=>ajax(LOCAL_URL + 'api/cart/selected/'+user_id);

//删除已经生成订单的商品
export const delAllSelectGoods = (user_id)=>ajax(LOCAL_URL + 'api/cart/del_checked/'+user_id)

//获取当前用户的地址
export const getUserAddress = (user_id,address_id)=>ajax(LOCAL_URL + 'api/address/one',{user_id,address_id},'POST');

//获取用户的所有地址
export const getUserAddressAll = (user_id)=>ajax(LOCAL_URL + 'api/address/search/'+user_id);

//添加用户地址
export const addUserAddress = (user_id,address_name,address_phone,address_area,address_area_detail,
    address_post_code, address_tag, province, city, county, areaCode)=>ajax(LOCAL_URL + 'api/address/add',{user_id,address_name,
    address_phone,address_area,address_area_detail,address_post_code, address_tag, province, city, county, areaCode},'POST')

//更新用户地址
export const editUserAddress = (address_id,user_id,address_name,address_phone,address_area,address_area_detail,
                                address_post_code, address_tag, province, city, county, areaCode)=>ajax(LOCAL_URL + 'api/address/edit',{address_id,user_id,address_name,
    address_phone,address_area,address_area_detail,address_post_code, address_tag, province, city, county, areaCode},'POST')

//删除用户地址
export const delUserAddress = (address_id)=>ajax(LOCAL_URL + 'api/address/del/'+address_id);

//提交订单
export const postOrder = (user_id,address_id,arrive_time,cart_shop,notice,shop_price,dis_price)=>ajax(LOCAL_URL + 'api/order/post',{
    user_id, address_id, arrive_time, cart_shop, notice, shop_price, dis_price},'POST')

//订单支付成功
export const payOrderSuccess = (user_id,order_id)=>ajax(LOCAL_URL + 'api/order/change_status',{user_id,order_id},'POST')

//查询订单
export const getOrders = (user_id,status)=>ajax(LOCAL_URL + 'api/order/get',{user_id,status},'POST')

//微信支付相关
const PAY_URl='/pay';

//生成支付二维码  get  参数：{outTradeNo:string,totelFee:Number}
export const getWXcode = (outTradeNo,totelFee)=>ajax(PAY_URl + '/createNative.do',{outTradeNo,totelFee})

//查询支付是否成功  get 参数：{out_trade_no:String}
export const queryPayStatus = (out_trade_no)=>ajax(PAY_URl + '/queryPayStatus.do',{out_trade_no})
