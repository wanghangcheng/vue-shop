module.exports = {
    publicPath:'/',
    devServer: {
        proxy: {
            '/api': {
                target:'http://localhost:3000/web/shop',
                changeOrigin:true,
                pathRewrite:{
                    '^/api':''
                }
            },
            '/pay': {
                target:'http://47.98.157.152/WXPayProject/pay',
                changeOrigin:true,
                pathRewrite:{
                    '^/pay':''
                }
            },
        }
    }
}