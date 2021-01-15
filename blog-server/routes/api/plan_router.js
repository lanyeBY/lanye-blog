// 引入路由模块并实例化
const Router = require('koa-router');
const router = new Router();
// 导如对应的控制器
const plan_controller = require('../../app/controllers/plan_controller');

// 为控制器的方法定义请求路径和请求方式
router.post('/plan/getPlans', plan_controller.getPlans);
router.post('/plan/clearPlans', plan_controller.clearPlans);
router.post('/plan/getPlanById', plan_controller.getPlanById);
router.post('/plan/addPlan', plan_controller.addPlan);
router.post('/plan/updatePlan', plan_controller.updatePlan);
router.post('/plan/deletePlan', plan_controller.deletePlan);


module.exports = router;