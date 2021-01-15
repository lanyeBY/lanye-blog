const Blog = require('../models/blog');
const User = require('../models/user');
const formatDate = require('../utils/formatDate');

// 获取博客列表
const getBlogs = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (req.userId) {
    if (req.isOwner) {
      var owerBlogs = await Blog.find({ userId: req.userId });

      if (owerBlogs) {
        ctx.body = {
          code: 1,
          msg: '获取当前用户全部博客成功',
          data: {
            blogs: owerBlogs.reverse()
          }
        };
      } else {
        ctx.body = {
          code: 0,
          msg: '获取当前用户全部博客失败'
        };
      }
    } else {
      var userBlogs = await Blog.find({ userId: req.userId, permission: 1 });

      if (userBlogs) {
        ctx.body = {
          code: 1,
          msg: '获取访问用户全部博客成功',
          data: {
            blogs: userBlogs.reverse()
          }
        };
      } else {
        ctx.body = {
          code: 0,
          msg: '获取访问用户全部博客失败'
        };
      }
    }
  } else {
    var blogs = await Blog.find({ permission: 1 });

    if (blogs) {
      ctx.body = {
        code: 1,
        msg: '获取全部公开博客',
        data: {
          blogs: blogs.reverse()
        }
      };
    } else {
      ctx.body = {
        code: 0,
        msg: '获取全部博客失败'
      };
    }
  }
}

const getBlogById = async (ctx, next) => {
  const req = ctx.request.body;
  ctx.status = 200;

  const blog = await Blog.findOne({ blogId: req.blogId });
  const autor = await User.findOne({ userId: blog.userId });

  if(blog && autor) {
    ctx.body = {
      code: 1,
      msg: "获取博客成功",
      data: {
        blog,
        autor
      }
    }
  } else {
    ctx.body = {
      code: 0,
      msg: "博客详情获取失败"
    }
  }
}

const getBlogsByFriend = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  const result = await User.findOne({ userId: req.userId }, 'friends');

  var blogList = [];

  if(result) {
    for (let i = 0; i < result.friends.length; i++) {
      let blogArr = await Blog.find({ userId: result.friends[i].userId, permission: 1 });
      if (blogArr) {
        blogList = blogList.concat(blogArr);
      }
    }  
  }

  ctx.body = {
    code: 1,
    msg: '获取好友最新更新的博客成功',
    data: {
      blogs: blogList.reverse()
    }
  }
}

//清空博客列表 用于后台管理系统
const clearBlogs = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  const result = await Blog.deleteMany({});

  if (result) {
    ctx.body = {
      code: 1,
      msg: '清空完成',
      data: {
        result
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '操作失败'
    }
  }
}

// 搜索博客
const searchBlog = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  var allBlogs = await Blog.find({ permission: 1 });
  var blogs = [];

  if (!allBlogs) {
    ctx.body = {
      code: 0,
      msg: '获取博客列表失败'
    };
    return;
  }

  if (req.search) {
    let search = new RegExp(req.search);
    for (let i = 0; i < allBlogs.length; i++) {
      if (search.test(allBlogs[i].blogTitle)) {
        blogs.push(allBlogs[i]);
      }
    }
  } else if (req.interestItaps) {
    for (let i = 0; i < allBlogs.length; i++) {
      if (allBlogs[i].itap && req.interestItaps.indexOf(allBlogs[i].itap) != -1) {
        blogs.push(allBlogs[i]);
        continue;
      }
    }
  } else {
    ctx.body = {
      code: 1,
      msg: '获得全部博客!',
      data: {
        blogs: allBlogs.reverse()
      }
    };
    return;
  }

  ctx.body = {
    code: 1,
    msg: '搜索成功',
    data: {
      blogs: blogs.reverse()
    }
  };
}

// 增加博客
const addBlog = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  var id = "B" + new Date().getTime();

  const result = await Blog.create({
    blogId: id,
    userId: req.userId,
    userName: req.userName,
    headImg: req.headImg,
    blogTitle: req.blogTitle,
    blogPostImg: req.blogPostImg,
    createTime: formatDate(new Date()),
    lastChangeTime: formatDate(new Date()),
    content: req.content,
    itap: req.itap,
    collectNumber: 0,
    likeNumber: 0,
    permission: req.permission
  })

  if(result) {
    ctx.body = {
      code: 1,
      msg: '博客添加成功',
      data: {
        result
      }
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '博客添加失败'
    }
  }
}

const updateBlog = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.blogId) {
    ctx.status = 401;
    ctx.body = {
      code: 0,
      msg: 'blogId为空!'
    }
    return;
  }

  if (req.isCollected) {
    const collects = await User.findOne({ userId: req.userId }, 'collects');
    for(let i = 0; i < collects.collects.length; i++) {
      if(collects.collects[i].blogId == req.blogId) {
        ctx.body = {
          code: 0,
          msg: '您已收藏了此博客'
        };
        return;
      }
    }
    const blog = await Blog.findOneAndUpdate({blogId: req.blogId}, { $inc: { collectNumber: 1 } });
    const user = await User.findOneAndUpdate({userId: req.userId}, { $push: { collects: blog } });
    if (blog && user) {
      ctx.body = {
        code: 1,
        msg: '博客收藏成功'
      };
    } else {
      ctx.body = {
        code: 0,
        msg: '博客收藏失败'
      };
    }
  } else if(req.isLiked) {
    const result = await Blog.findOneAndUpdate({blogId: req.blogId}, { $inc: { likeNumber: 1 } });
    if (result) {
      ctx.body = {
        code: 1,
        msg: '点赞成功'
      };
    } else {
      ctx.body = {
        code: 0,
        msg: '点赞失败'
      };
    }
  } else {
    const result = await Blog.findOneAndUpdate({blogId: req.blogId}, {
      blogTitle: req.blogTitle,
      blogPostImg: req.blogPostImg,
      lastChangeTime: formatDate(new Date()),
      content: req.content,
      itap: req.itap,
      permission: req.permission
    });
    if (result) {
      ctx.body = {
        code: 1,
        msg: '博客更新成功',
        data: {
          blog: result
        }
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '博客更新失败',
        data: {
          result
        }
      }
    }
  }
}

//删除博客
const deleteBlog = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.blogId) {
    ctx.status = 401;
    ctx.body = {
      code: 0,
      msg: 'blogId为空!'
    }
    return;
  }

  const result = await Blog.deleteOne({ blogId: req.blogId });

  if (result) {
    ctx.body = {
      code: 1,
      msg: '删除博客成功'
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '删除博客失败'
    }
  }

}

// 暴露方法，在路由中使用
module.exports = {
  getBlogs,
  getBlogById,
  getBlogsByFriend,
  clearBlogs,
  searchBlog,
  addBlog,
  updateBlog,
  deleteBlog
}