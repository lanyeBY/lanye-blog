<template>
  <div class="plan">
    <div class="top">
      <el-row>
        <el-col :span="3">
          <el-input placeholder="请输入用户ID" v-model="userId">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" icon="el-icon-search" plain @click="searchPlan">搜索用户全部计划</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <el-table :data="planList" border style="width: 100%;">
        <el-table-column prop="planId" label="ID" width="100"></el-table-column>
        <el-table-column prop="planTitle" label="计划标题" width="120"></el-table-column>
        <el-table-column prop="userId" label="计划创建人ID" width="120"></el-table-column>
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="120"></el-table-column>
        <el-table-column label="是否提醒" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.isAlert == 1 ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="alertTime" label="提醒时间" width="150"></el-table-column>
        <el-table-column label="状态" width="100">
          <template slot-scope="scope">
            <span>{{scope.row.status == 1 ? '已完成' : '未完成'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
const baseUrl = "http://localhost:3000";

export default {
  name: "plan",
  data() {
    return {
      userId: "",
      planList: []
    };
  },
  mounted() {
    $.post({
      url: baseUrl + "/plan/getPlans",
      success: res => {
        if(res.code == 1) {
          this.planList = res.data.plans;
        } else {
          this.$message({
            type: "info",
            message: res.msg
          });
        }
      }
    });
  },
  methods: {
    searchPlan() {
      let userId = this.userId;
      $.post({
        url: baseUrl + "/plan/getPlans",
        data: {
          userId,
          status: -1,
          Date: "201"
        },
        success: res => {
          if(res.code == 1) {
            this.planList = res.data.plans;
          } else {
            this.$message({
              type: "info",
              message: res.msg
            });
          }
        }
      });
    }
  }
};
</script>

<style scoped>
.top {
  margin: 20px 0 30px 60px;
}
.el-col {
  margin-left: 10px;
}
.cell {
  text-align: center;
}
.el-select,
.el-date-editor {
  float: left;
}
</style>
