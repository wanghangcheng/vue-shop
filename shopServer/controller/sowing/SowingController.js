import formidable from "formidable";
import config from "../../src/config";
import {basename} from "path";
import Sowing from "../../models/Sowing";

class SowingController {
    constructor(){

    }
    // 1.往数据库中插入一条新纪录
    async insertOneSowing(req, res, next){
        const form = new formidable.IncomingForm();
        form.uploadDir = config.uploadPath;  // 上传图片放置的文件夹
        form.keepExtensions = true; // 保持文件的原始扩展名
        form.parse(req, async (err, fields, files) => {
            if (err) {
                return next(err);
            }
            // 1. 取出普通字段
            let body = fields;
            // 2. 解析上传的文件路径, 取出文件名保存到数据库
            body.image_url = basename(files.image_url.path);

            // 3. 操作数据库
            try {
                // 操作数据库
                const sowing = {
                    // 图片名称
                    image_title: body.image_title,
                    // 图片地址
                    image_url: body.image_url,
                    // 跳转链接
                    image_link: body.image_link,
                    // 上架时间
                    s_time: body.s_time,
                    // 下架时间
                    e_time: body.e_time,
                };
                const result = await Sowing.create(sowing);
                console.log(result);
                if(result){
                    res.json({
                        status: 200,
                        result: '添加轮播图成功!'
                    })
                }else {
                    throw new Error('添加轮播图失败!');
                }
            }catch (e) {
                return next(e);
            }
        });
    }
}

export default new SowingController();