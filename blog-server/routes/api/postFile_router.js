const fs  = require('fs');
const Router = require('koa-router');
const router = new Router();

//路由
router.post('/file/upload', async (ctx, next) => {
    const req = ctx.request.body;
    // 上传单个文件
    const file = req.file; // 获取上传文件
    ctx.body = {
        file: file//返回文件名
    };
    // 创建可读流
    // const reader = fs.createReadStream(file.path);
    // let filePath = '../../files' + `/${file.name}`;
    // // 创建可写流
    // const upStream = fs.createWriteStream(filePath);
    // // 可读流通过管道写入可写流
    // reader.pipe(upStream);
    // ctx.body = {
    //     filename: req.file.name//返回文件名
    // };
});

module.exports = router;