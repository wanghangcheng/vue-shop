import express from 'express'
import Order from './../models/Order'
const router = express.Router({});

router.post('/web/shop/api/order/post', (req, res, next) => {
    const {user_id, address_id, arrive_time, cart_shop, notice, shop_price, dis_price} = req.body;
    if(user_id){
        const order = new Order({
            user_id,
            address_id,
            arrive_time,
            cart_shop,
            notice,
            shop_price,
            dis_price
        });
        order.save((err, result) => {
            if (err) {
                return next(Error(err));
            }
            res.send({
                success_code: 200,
                data: {
                    order_id: result._id,
                    user_id: result.user_id,
                    total_price: result.dis_price + result.shop_price
                },
                message: '订单创建成功！'
            })
        });
    }else {
        return next(Error('非法用户！'));
    }
});

router.post('/web/shop/api/order/change_status', (req, res, next) => {
    const {user_id, order_id} = req.body;
    if (user_id) {
        Order.findOne({_id: order_id, user_id}, (err, result) => {
            if (err) return next(Error(err));
            if (result) {
                result.order_status = 'pay';
                result.save((err, result) => {
                    if (err) return next(Error(err));
                    res.send({
                        success_code: 200,
                        data: result,
                        message: '修改订单状态成功'
                    });
                });
            } else {
                res.send({
                    error_code: 0,
                    message: '当前订单不存在'
                })
            }
        });
    } else {
        return next(Error('非法用户！'));
    }
});

router.post('/web/shop/api/order/get', (req, res) => {
    const {user_id, status} = req.body;
    if (user_id) {
        let params = {user_id};
        if(status){
            params = {user_id, order_status: status};
        }
        console.log(params);
        Order.find(params).sort({'arrive_time':-1}).exec((err, result) => {
            if (err) {
                return next(err);
            }
            res.json({
                success_code: 200,
                data: result
            });
        });
    } else {
        return next(Error('非法用户！'));
    }

});

export default router;