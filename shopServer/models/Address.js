import mongoose from 'mongoose'
const Schema = mongoose.Schema;

// 地址模型
const AddressSchema = mongoose.Schema({
    user_id: {type: Schema.Types.ObjectId, required: true},  // 用户ID
    address_name: {type: String, required: true}, // 收货人姓名
    address_phone: {type: String, required: true}, // 收货人电话
    address_area: {type: String, required: true}, // 省市区
    province:{type: String, required: true}, // 省
    city:{type: String, required: true}, // 市
    county:{type: String, required: true}, // 区
    areaCode:{type: String, required: false},  // 地区编码
    address_area_detail: {type: String, required: true}, // 详细地址
    address_post_code: {type: String, required: true}, // 邮政编码
    address_tag:{type: Boolean, default: false},  // 是否是默认地址
    ctime: {type: String, default: Date.now()}
});

const AddressModel = mongoose.model('address', AddressSchema);
export default AddressModel;
