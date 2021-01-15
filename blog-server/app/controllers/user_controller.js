const User = require('../models/user');
const Blog = require('../models/blog');
const formatDate = require('./../utils/formatDate');
var axios = require('axios');

const login = async (ctx, next) => {
  var req = ctx.request.body;

  await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wxdec14aad4012f466&secret=dbd380219a8f686b6fbb3cc378f3e372&js_code=${req.code}&grant_type=authorization_code`).then((res) => {
    ctx.status = 200;
    ctx.body = {
      code: 1,
      msg: "返回用户ID",
      data: {
        userId: res.data.openid
      }
    }
  }).catch((err) => {
    console.log(err);
  });
}

// 获取用户列表 用于后台管理系统
const getUsers = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  const users = await User.find({});

  if (users) {
    ctx.body = {
      code: 1,
      msg: '获取全部用户',
      data: {
        users
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '操作失败'
    };
  }
}

//清空用户列表 用于后台管理系统
const clearUsers = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  const result = await User.deleteMany({});

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

//删除单个用户 用于后台管理系统
const clearUserById = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.userId) {
    ctx.status = 401;
    ctx.body = {
      code: 0,
      msg: 'userId为空!'
    }
    return;
  }

  const result = await User.deleteOne({ userId: req.userId });

  if (result) {
    ctx.body = {
      code: 1,
      msg: '该用户已经删除'
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '操作失败'
    }
  }

}

//通过userId查询用户
const findUser = async (ctx, next) => {
  const req = ctx.request.body;

  //koa 的 ctx 的 status 默认情况下设置为 404 而不是像 node 的 res.statusCode 那样默认为 200
  ctx.status = 200;
  //ctx.body 等价于 ctx.response
  if (req.userId == '') {
    let users = await User.find({});
    if(users) {
      ctx.body = {
        code: 1,
        msg: '获取全部用户',
        data: {
          users
        }
      }
    } else {
      ctx.body = {
        code: 0,
        msg: '获取用户列表失败'
      }
    }
    return;
  }

  const user = await User.findOne({ userId: req.userId });

  if (user) {
    let users = [];
    users.push(user);
    ctx.body = {
      code: 1,
      msg: '获取用户成功',
      data: {
        users
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '操作失败'
    }
  }
}

// 增加一个用户
const addUser = async (ctx, next) => {
  const req = ctx.request.body;

  const user = await User.findOne({
    userId: req.userId
  });

  ctx.status = 200;

  if (user) {
    ctx.body = {
      msg: '当前用户已存在',
      code: 10,
      data: {
        user
      }
    }
    return;
  } else {
    const newUser = await User.create({
      userId: req.userId,
      userName: req.userName,
      headImg: req.headImg,
      motto: "",
      friends: [],
      collects: [],
      postImg: "",
      interestItaps: [],
      addDate: formatDate(new Date())
    });

    if (newUser) {
      ctx.body = {
        msg: '当前用户为新用户',
        code: 11,
        data: {
          user: newUser
        }
      };
    } else {
      ctx.body = {
        msg: '操作失败',
        code: 0
      };
    }
  }
}

// 更新用户基本信息
const updateUser = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.userId) {
    ctx.status = 401;
    ctx.body = {
      code: 0,
      msg: 'userId为空!'
    }
    return;
  }

  const user = await User.findOneAndUpdate({ userId: req.userId }, {
    userName: req.userName,
    // headImg: req.headImg,
    motto: req.motto,
    postImg: req.postImg
  });

  if(user) {
    ctx.body = {
      code: 1,
      msg: '更新完成',
      data: {
        user
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '更新失败'
    };
  }
}

// 获取用户好友列表
const getUserFriends = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.userId) {
    ctx.status = 401;
    ctx.body = {
      code: 0,
      msg: 'userId为空!'
    }
    return;
  }

  const user = await User.findOne({ userId: req.userId }, 'friends');

  if (user) {
    ctx.body = {
      code: 1,
      msg: '用户好友列表获取成功',
      data: {
        friends: user.friends
      }
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '用户好友列表获取失败'
    }
  }
}

// 增加用户单个好友
const addUserFriend = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.userId) {
    ctx.status = 401;
    ctx.body = {
      code: 0,
      msg: 'userId为空'
    }
    return;
  }

  const friend = await User.findOne({ userId: req.friendId }, 'userId userName headImg motto');

  if (friend) {
    const result = await User.findOneAndUpdate({ userId: req.userId }, { $push: { friends: friend } });

    if (result) {
      ctx.body = {
        code: 1,
        msg: '好友增加成功',
        data: {
          user: result
        }
      };
    } else {
      ctx.body = {
        code: 0,
        msg: '好友增加失败'
      };
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '好友用户信息获取失败'
    }
  }
}

// 用戶取消关注好友
const deleteUserFriend = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.userId) {
    ctx.status = 401;
    ctx.body = {
      msg: 'userId为空',
      success: false
    }
    return;
  }

  const user = await User.findOne({ userId: req.userId }, 'friends');

  if (user) {
    let friendArr = user.friends;
    for (let i = 0; i < friendArr.length; i++) {
      if (friendArr[i].userId == req.friendId) {
        friendArr.splice(i, 1);
        break;
      }
    }
    const result = await User.findOneAndUpdate({ userId: req.userId }, { friends: friendArr });

    if (result) {
      ctx.body = {
        code: 1,
        msg: '用户好友删除成功!'
      };
    } else {
      ctx.body = {
        code: 0,
        msg: '用户好友删除失败!'
      };
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '用户好友列表获取失败!'
    }
  }
}

// 获取用户收藏列表
const getUserCollects = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.userId) {
    ctx.status = 401;
    ctx.body = {
      code: 0,
      msg: 'userId为空!'
    }
    return;
  }

  const user = await User.findOne({ userId: req.userId }, 'collects');

  if (user) {
    ctx.body = {
      code: 1,
      msg: '用户收藏列表获取成功',
      data: {
        collects: user.collects
      }
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '用户收藏列表获取失败'
    }
  }
}

// 用户取消收藏
const deleteUserCollect = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.userId) {
    ctx.status = 401;
    ctx.body = {
      msg: 'userId为空',
      success: false
    }
    return;
  }

  const user = await User.findOne({ userId: req.userId }, 'collects');

  if (user) {
    let collectArr = user.collects;
    for (let i = 0; i < collectArr.length; i++) {
      if (collectArr[i].blogId == req.blogId) {
        collectArr.splice(i, 1);
        break;
      }
    }
    const result = await User.findOneAndUpdate({ userId: req.userId }, { collects: collectArr });
    const blog = await Blog.findOneAndUpdate({ blogId: req.blogId }, { $inc: { collectNumber: -1 } });

    if (result) {
      ctx.body = {
        code: 1,
        msg: '用户取消收藏成功!',
        data: {
          collectArr
        }
      };
    } else {
      ctx.body = {
        code: 0,
        msg: '用户取消收藏失败!'
      };
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '用户收藏列表获取失败!'
    }
  }
}

// 获取用户兴趣标签列表
const getUserItaps = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.userId) {
    ctx.status = 401;
    ctx.body = {
      code: 0,
      msg: 'userId为空!'
    }
    return;
  }

  const user = await User.findOne({ userId: req.userId }, 'interestItaps');

  if (user) {
    ctx.body = {
      code: 1,
      msg: '用户收藏列表获取成功',
      data: {
        interestItaps: user.interestItaps
      }
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '用户收藏列表获取失败'
    }
  }
}

// 更新用户兴趣标签列表
const updateUserItap = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.userId) {
    ctx.status = 401;
    ctx.body = {
      msg: 'userId为空',
      success: false
    }
    return;
  }
  const result = await User.findOneAndUpdate({ userId: req.userId }, { interestItaps: req.interestItaps });

  if (result) {
    ctx.body = {
      code: 1,
      msg: '用户兴趣标签列表更新成功!',
      data: {
        result
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '用户兴趣标签列表更新失败!'
    };
  }
}


// 暴露方法，在路由中使用
module.exports = {
  login,
  getUsers,
  clearUsers,
  clearUserById,
  findUser,
  addUser,
  updateUser,
  getUserFriends,
  addUserFriend,
  deleteUserFriend,
  getUserCollects,
  deleteUserCollect,
  getUserItaps,
  updateUserItap
}