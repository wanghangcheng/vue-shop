import mongoose from 'mongoose'

// 创建轮播图的模式对象
const errorSchema = mongoose.Schema({
    // 错误名称
    error_name: {type: String, required: true},
    // 错误消息
    error_message: {type: String, required: true},
    // 错误堆栈
    error_stack: {type: String, required: true},
    // 错误发生时间
    error_time: {type: Date, default: Date.now()},
});

const Error = mongoose.model('Error', errorSchema);
export default Error;


