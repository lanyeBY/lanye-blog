const Itap = require('../models/itap');

// 获取兴趣标签列表
const getItaps = async (ctx, next) => {
  const req = ctx.request.body;

  const itaps = await Itap.find({});

  if (itaps) {
    ctx.body = {
      code: 1,
      msg: '获取兴趣标签列表成功',
      data: {
        itaps
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '获取兴趣标签列表失败'
    };
  }
}

//清空兴趣便签列表 用于后台管理系统
const clearItaps = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  const result = await Itap.deleteMany({});

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

// 增加兴趣标签 用于后台管理系统
const addItap = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  const result = await Itap.create({
    itapId: "I" + new Date().getTime(),
    itap: req.itap
  })

  if (result) {
    ctx.body = {
      code: 1,
      msg: '标签添加成功',
      data: {
        result
      }
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '标签添加失败'
    }
  }
}

// 修改兴趣标签 用于后台管理系统
const updateItap = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  const result = await Itap.findOneAndUpdate({ itapId: req.itapId }, {
    itap: req.itap
  });
  if (result) {
    ctx.body = {
      code: 1,
      msg: '标签修改成功',
      data: {
        result
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '标签修改失败',
      data: {
        result
      }
    };
  }
}

//删除标签
const deleteItap = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.itapId) {
    ctx.status = 401;
    ctx.body = {
      code: 0,
      msg: 'itapId为空!'
    }
    return;
  }

  const result = await Itap.deleteOne({ itapId: req.itapId });

  if (result) {
    ctx.body = {
      code: 1,
      msg: '删除标签成功'
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '删除标签失败'
    }
  }

}

// 暴露方法，在路由中使用
module.exports = {
  getItaps,
  clearItaps,
  addItap,
  updateItap,
  deleteItap
}