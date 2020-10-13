import mongoose from 'mongoose'
const Schema = mongoose.Schema;

// 地址模型
const OrderSchema = new Schema({
    user_id: {type: Schema.Types.ObjectId, required: true},  // 用户ID
    address_id: {type: Schema.Types.ObjectId, required: true}, // 收货地址ID
    arrive_time: {type: String, required: false}, // 送达时间
    cart_shop: {type: Array, required: true}, // 已下单购物车商品
    notice:{type: String, required: false}, // 订单备注
    shop_price:{type: Number, required: true}, // 商品金额
    dis_price:{type: Number, required: true}, // 配送费
    order_status:{type: String, default: 'will'}, // 待支付 will  待收货 pay
    ctime: {type: String, default: Date.now()}
});

const OrderModel = mongoose.model('order', OrderSchema);
export default OrderModel;
