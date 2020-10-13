'use strict';
import mongoose from 'mongoose';
import config from './../src/config';
mongoose.connect(config.db_url, {useNewUrlParser: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;

db.once('open' ,()=>{
    console.log('连接数据库成功~~~~~~');
});

db.on('error', (error)=>{
    console.error('连接数据库时发生错误: ' + error);
    mongoose.disconnect();
});

db.on('close', function() {
    console.log('数据库断开，重新连接数据库');
    mongoose.connect(config.db_url, {useNewUrlParser: true});
});

export default db;