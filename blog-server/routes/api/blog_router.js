// 引入路由模块并实例化
const Router = require('koa-router');
const router = new Router();
// 导如对应的控制器
const blog_controller = require('../../app/controllers/blog_controller');

// 为控制器的方法定义请求路径和请求方式
router.post('/blog/getBlogs', blog_controller.getBlogs);
router.post('/blog/getBlogById', blog_controller.getBlogById);
router.post('/blog/getBlogsByFriend', blog_controller.getBlogsByFriend);
router.post('/blog/clearBlogs', blog_controller.clearBlogs);
router.post('/blog/searchBlog', blog_controller.searchBlog);
router.post('/blog/addBlog', blog_controller.addBlog);
router.post('/blog/updateBlog', blog_controller.updateBlog);
router.post('/blog/deleteBlog', blog_controller.deleteBlog);

module.exports = router;