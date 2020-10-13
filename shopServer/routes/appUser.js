import express from 'express'
const router = express.Router({});


import svgCaptcha from 'svg-captcha'
import AppUser from './../models/AppUser'
import md5 from 'blueimp-md5'
import {basename} from 'path'
import formidable from 'formidable'
import config from './../src/config'

// 用户信息
let users = {};
let Server_captcha = null;

/**
 *
 * 获取随机图形验证码
 */
router.get('/web/shop/api/captcha', (req, res)=>{
    // 1. 生成随机的验证码
    let captcha = svgCaptcha.create({
        color: true,
        noise: 2,
        size: 4, // 验证码长度
        ignoreChars: '0o1i', // 验证码字符中排除 0o1i
    });

    // 2. 保存验证码到session
    req.session.captcha = captcha.text.toLocaleLowerCase();
    Server_captcha = captcha.text.toLocaleLowerCase()
    console.log(req.session);

    // 3. 返回给客户端
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.type('svg');
    res.status(200).send(captcha.data);
});

/**
 * 用户名和密码登录
 */
router.post('/web/shop/api/login_pwd', (req, res)=>{
    console.log('----', req.body);
    //  1. 获取数据
    let user_name = req.body.username;
    let user_pwd = md5(req.body.user_pwd);
    let captcha = req.body.captcha.toLowerCase();
    // console.log(req.body);
    console.log('/web/xlmc/api/login_pwd', user_name, user_pwd, captcha, req.session);

    // 2. 合法验证
    if(captcha !== Server_captcha){
        return res.send({err_code: 0, message: '验证码不正确!'});
    }

    // 3. 从session中删除验证码
    delete req.session.captcha;

    // 4. 查询数据库
    AppUser.findOne({user_name}, (err, user)=>{
        if(user){ // 4.1 用户已经注册
            if(user.user_pwd !== user_pwd){ // 密码错误
                res.send({err_code: 0, message: '用户名或密码不正确!'});
            }else {
                req.session.userid = user._id;
                res.send({
                    success_code: 200,
                    message:'登录成功',
                    data: {
                        token: user._id,
                        real_name: user.real_name,
                        user_name: user.user_name,
                        phone: user.phone,
                        icon_url: user.icon_url,
                    }
                });
            }
        }else { // 4.2 用户没有注册
            let userModel = new AppUser({user_name, user_pwd});
            userModel.save(function (err, user) {
                req.session.userid = user._id;
                res.send({
                    success_code: 200,
                    message:'自动注册登录',
                    data: {
                        token: user._id,
                        real_name: user.real_name,
                        user_name: user.user_name
                    }
                });
            });
        }
    });
});

/**
 * 获取短信验证码
 */
router.get('/web/shop/api/send_code', (req, res)=>{
    // 1. 获取手机号
    let phone = req.query.phone;
    // 2. 随机产生验证码
    let code = randomCode(6);
    // 3. 成功
    setTimeout(()=>{
        users[phone] = code;
        res.send({success_code: 200, message: '验证码获取成功!', code});
    }, 2000);
    // 4. 失败
    /*setTimeout(()=>{
        res.send({err_code: 0, message: '验证码获取失败!'});
    }, 2000);*/
});

/*生成指定长度的随机数*/
function randomCode(length) {
    let chars = ['0','1','2','3','4','5','6','7','8','9'];
    let result = "";
    for(let i = 0; i < length ; i ++) {
        let index = Math.ceil(Math.random()*9);
        result += chars[index];
    }
    return result;
}

/**
 * 手机验证码登录
 */
router.post('/web/shop/api/login_code', (req, res)=>{
    // 1. 获取数据
    const phone = req.body.phone;
    const code = req.body.code;
    // 2. 判断验证码是否正确
    if(phone === undefined || code === undefined  || users[phone] !== code){
        return res.json({error_code: 0, message: '手机或验证码不正确!'})
    }
    // 3. 查询和操作数据
    delete  users[phone];
    AppUser.findOne({phone},(err, user)=>{
        if(user){ // 用户存在
            req.session.userid = user._id;
            res.send({
                success_code: 200,
                data: {
                    token: user._id,
                    real_name: user.real_name,
                    user_name: user.user_name,
                    phone: user.phone,
                    icon_url: user.icon_url
                }
            });
        }else { // 用户不存在
            let userModel = new AppUser({phone});
            userModel.save(function (err, user) {
                req.session.userid = user._id;
                res.send({
                    success_code: 200,
                    data: {
                        token: user._id,
                        real_name: user.real_name,
                        user_name: user.user_name,
                        phone: user.phone,
                        icon_url: user.icon_url
                    }
                });
            });
        }
    });
});

/*
  根据session中的userid, 去查询对应的用户返回给客户端
*/
const filter = {'pwd': 0, 'l_time': 0, '__v': 0};
router.get('/web/shop/api/userinfo', (req, res)=>{
    // 1. 取出userId
    const userId = req.session.userid;
    // 2. 查询
    AppUser.findOne({_id: userId}, filter, (err, user)=>{
        if(!user){
            // 清除上一次的userId
            delete req.session.userid;
            res.send({err_code: 0, message: '请先登录'});
        }else {
            res.send({
                success_code: 200,
                data: {
                    token: user._id,
                    real_name: user.real_name,
                    user_name: user.user_name,
                    phone: user.phone,
                    icon_url: user.icon_url
                }
            });
        }
    })
});

// 退出登录
router.get('/web/shop/api/logout', (req, res)=>{
    // 清除session中的userid
    delete req.session.userid;
    // 返回数据
    res.send({success_code: 200, message: '退出登录成功'});
});

// 输出
export default router;