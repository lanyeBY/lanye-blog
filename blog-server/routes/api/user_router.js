// 引入路由模块并实例化
const Router = require('koa-router');
const router = new Router();
// 导如对应的控制器
const user_controller = require('../../app/controllers/user_controller');

// 为控制器的方法定义请求路径和请求方式
router.post('/login', user_controller.login);
router.post('/user/getUsers', user_controller.getUsers);
router.post('/user/clearUsers', user_controller.clearUsers);
router.post('/user/clearUserById', user_controller.clearUserById);
router.post('/user/findUser', user_controller.findUser);
router.post('/user/addUser', user_controller.addUser);
router.post('/user/updateUser', user_controller.updateUser);
router.post('/user/getUserFriends', user_controller.getUserFriends);
router.post('/user/addUserFriend', user_controller.addUserFriend);
router.post('/user/deleteUserFriend', user_controller.deleteUserFriend);
router.post('/user/getUserCollects', user_controller.getUserCollects);
router.post('/user/deleteUserCollect', user_controller.deleteUserCollect);
router.post('/user/getUserItaps', user_controller.getUserItaps);
router.post('/user/updateUserItap', user_controller.updateUserItap);

module.exports = router;