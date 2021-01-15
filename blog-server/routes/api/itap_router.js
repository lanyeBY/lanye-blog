// 引入路由模块并实例化
const Router = require('koa-router');
const router = new Router();
// 导如对应的控制器
const itap_controller = require('../../app/controllers/itap_controller');

// 为控制器的方法定义请求路径和请求方式
router.post('/itap/getItaps', itap_controller.getItaps);
router.post('/itap/clearItaps', itap_controller.clearItaps);
router.post('/itap/addItap', itap_controller.addItap);
router.post('/itap/updateItap', itap_controller.updateItap);
router.post('/itap/deleteItap', itap_controller.deleteItap);

module.exports = router;