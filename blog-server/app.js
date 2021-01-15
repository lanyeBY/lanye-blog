const Koa = require('koa');
const cors = require('koa2-cors');
const bodyParser = require('koa-bodyparser');
const mongoose = require('mongoose');
const config = require('./config');
const user_router = require('./routes/api/user_router');
const blog_router = require('./routes/api/blog_router');
const plan_router = require('./routes/api/plan_router');
const itap_router = require('./routes/api/itap_router');
const file_router = require('./routes/api/postFile_router');

const app = new Koa();

mongoose.connect(config.db, {useNewUrlParser:true}, (err) => {
    if (err) {
        console.error('连接数据库失败...');
    } else {
        console.log('成功连接到数据库');
    }
});

app.use(cors());    //解决跨域
app.use(bodyParser());

app.use(user_router.routes()).use(user_router.allowedMethods());
app.use(blog_router.routes()).use(blog_router.allowedMethods());
app.use(plan_router.routes()).use(plan_router.allowedMethods());
app.use(itap_router.routes()).use(itap_router.allowedMethods());
app.use(file_router.routes()).use(file_router.allowedMethods());


app.listen(config.port);