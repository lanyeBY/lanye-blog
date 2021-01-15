const Plan = require('../models/plan');
const formatDate = require('../utils/formatDate');

// 获取计划列表
const getPlans = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;
  var plans = [];

  if (req.userId) {
    if (req.status != -1) {
      plans = await Plan.find({ userId: req.userId, status: req.status });
      var status = req.status == 0 ? '未完成' : '已完成';
    } else {
      plans = await Plan.find({ userId: req.userId });
      var status = '全部';
    }
    let planList = [];
    let data = req.Date;
    plans.forEach((plan) => {
      if (plan.createTime.indexOf(data) != -1) {
        planList.push(plan);
      }
    })

    if (planList) {
      ctx.body = {
        code: 1,
        status: status,
        msg: '获取当前用户计划列表成功',
        data: {
          plans: planList
        }
      };
    } else {
      ctx.body = {
        code: 0,
        msg: '获取当前用户计划列表失败'
      };
    }
  } else {
    plans = await Plan.find({});

    if (plans) {
      ctx.body = {
        code: 1,
        status: '全部',
        msg: '获取计划列表成功',
        data: {
          plans
        }
      };
    } else {
      ctx.body = {
        code: 0,
        msg: '获取计划列表失败'
      };
    }
  }
}

//清空计划列表 用于后台管理系统
const clearPlans = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  const result = await Plan.remove({});

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

const getPlanById = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.planId) {
    ctx.status = 401;
    ctx.body = {
      code: 0,
      msg: 'planId为空!'
    }
    return;
  }

  const plan = await Plan.findOne({ planId: req.planId });

  if (plan) {
    ctx.body = {
      code: 1,
      msg: '获取计划成功',
      data: {
        plan
      }
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '获取计划失败'
    };
  }
}

// 增加计划
const addPlan = async (ctx, next) => {
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

  var id = 'P' + new Date().getTime();

  const result = await Plan.create({
    planId: id,
    userId: req.userId,
    planTitle: req.planTitle,
    content: req.content,
    status: 0,
    createTime: formatDate(new Date()).slice(0, 11),
    isAlert: req.isAlert,
    alertTime: req.alertTime
  })

  if (result) {
    ctx.body = {
      code: 1,
      msg: '计划添加成功',
      data: {
        plan: result
      }
    }
  } else {
    ctx.body = {
      code: 0,
      msg: '计划添加失败'
    }
  }
}

// 更新计划
const updatePlan = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.planId) {
    ctx.status = 401;
    ctx.body = {
      code: 0,
      msg: 'planId为空!'
    }
    return;
  }

  const plan = await Plan.findOneAndUpdate({ planId: req.planId }, {
    planTitle: req.planTitle,
    content: req.content,
    status: req.status,
    isAlert: req.isAlert,
    alertTime: req.alertTime
  });
  if (plan) {
    ctx.body = {
      code: 1,
      msg: '计划更新成功'
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '计划更新失败'
    };
  }
}

//删除计划
const deletePlan = async (ctx, next) => {
  const req = ctx.request.body;

  ctx.status = 200;

  if (!req.planId) {
    ctx.status = 401;
    ctx.body = {
      code: 0,
      msg: 'planId为空!'
    }
    return;
  }

  const result = await Plan.remove({ planId: req.planId });

  if (result) {
    ctx.body = {
      code: 1,
      msg: '删除计划成功'
    };
  } else {
    ctx.body = {
      code: 0,
      msg: '删除计划失败'
    }
  }

}

// 暴露方法，在路由中使用
module.exports = {
  getPlans,
  clearPlans,
  getPlanById,
  addPlan,
  updatePlan,
  deletePlan
}