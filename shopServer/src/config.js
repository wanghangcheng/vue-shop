import {join} from 'path';
export default {
    viewsPath: join(__dirname, '../views'),
    publicPath: join(__dirname, '../public'),
    uploadPath: join(__dirname, '../public/uploads'),
    port: parseInt(process.env.PORT, 10) || 3000,
    secret: 'itlike.com',
    name: 'likeid',
    maxAge:  1800000,
    db_url:'mongodb://localhost:27017/college'
}