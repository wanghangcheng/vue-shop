export default (req, res, next)=>{
    // 1. 过滤所有非后端请求
    if(req.path.indexOf('/back/') === -1){ // 没有找到
       /*
       if(req.path.indexOf('/cart/') !== -1){ // 购物车接口相关
            console.log(req.path);
            if(req.session.userid){
                return next();
            }else {
                return next(new Error('用户没有登录!'));
            }
        }
        */
        return next();
    }

    // 2. 判断是否是处于有效登录时效
    if(req.session.token){
        return next();
    }

    // 3. 没有登录 登录失效
    // 3.1 如果是接口相关
    if(req.path.indexOf('/api/')!== -1){
        return next(new Error('非法访问!'));
    }

    // 3.2 如果是页面相关
    res.render('back/login.html');
}