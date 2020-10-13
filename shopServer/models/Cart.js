import mongoose from 'mongoose'
const Schema = mongoose.Schema;

// 购物车模型
const CartSchema = new Schema({
    goods_id: {type: Schema.Types.ObjectId, required: true}, // 商品ID
    user_id: {type: Schema.Types.ObjectId, required: true},  // 用户ID
    goods_name: {type: String, required: true}, // 商品名称
    goods_price: {type: Number, required: true}, // 商品价格
    small_image: {type: String, required: true}, // 商品图片
    num: {type: Number, required: true}, // 商品数量
    checked:{type: Boolean, default: true}, // 商品是否勾选
    isDel: {type: Boolean, default: false}, // 商品是否删除
    ctime: {type: String, default: Date.now()}
});

const CartModel = mongoose.model('carts', CartSchema);
export default CartModel;
