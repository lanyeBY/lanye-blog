<template>
  <div class="itap">
    <div class="top">
      <el-row>
        <el-col :span="6">
          <el-button type="primary" plain @click="showAddItapDialog">
            <i class="el-icon-plus"></i>添加标签
          </el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="danger" plain @click="showClearItapDialog">全部清空</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <el-table :data="itapList" border style="width: 50%;">
        <el-table-column prop="itapId" label="ID" width="150"></el-table-column>
        <el-table-column prop="itap" label="标签名称"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="showDeleteItapDialog(scope.row)" type="danger" size="small">删除</el-button>
            <el-button @click="showUpdateItapDialog(scope.row)" type="primary" size="small">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="operationTitle"
      :visible.sync="isOperateItap"
      width="30%"
      :before-close="closeOperateDialog"
    >
      <el-form label-position="right" label-width="100px" :model="operationdata">
        <el-form-item label="标签名称">
          <el-input v-model="operationdata.itap"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOperateDialog">取 消</el-button>
        <el-button type="primary" @click="addItap" v-if="operationType == 'add'">确 定</el-button>
        <el-button type="primary" @click="updateItap" v-if="operationType == 'update'">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const baseUrl = "http://localhost:3000";

export default {
  name: "plan",
  data() {
    return {
      itapList: [],
      isOperateItap: false,
      operationTitle: "添加标签",
      operationType: "add",
      operationdata: {}
    };
  },
  mounted() {
    $.post({
      url: baseUrl + "/itap/getItaps",
      success: res => {
        if(res.code == 1) {
          this.itapList = res.data.itaps
        }
      }
    });
  },
  methods: {
    showAddItapDialog() {
      this.isOperateItap = true;
      this.operationTitle = "添加标签";
      this.operationType = "add";
      this.operationdata = {};
    },
    closeOperateDialog() {
      this.$confirm("关闭将不保存修改数据，是否继续?", "提示", {
        type: "warning"
      }).then(() => {
        this.isOperateItap = false;
        this.operationdata = {};
      });
    },
    showClearItapDialog() {
      this.$confirm("此操作将删除全部标签, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $.post({
            url: baseUrl + "/itap/clearItaps",
            success: res => {
              if(res.code == 1) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.itapList = [];
              } else {
                this.$message({
                  type: "info",
                  message: res.msg
                });
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    showDeleteItapDialog(data) {
      this.$confirm(`确定删除标签 ${data.itap}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $.post({
            url: baseUrl + "/itap/deleteItap",
            data: {
              itapId: data.itapId
            },
            success: res => {
              if(res.code == 1) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                $.post({
                  url: baseUrl + "/itap/getItaps",
                  success: res => {
                    if(res.code == 1) {
                      this.itapList = res.data.itaps
                    } else {
                      this.$message({
                        type: "info",
                        message: res.msg
                      });
                    }
                  }
                });
              } else {
                this.$message({
                  type: "info",
                  message: res.msg
                });
              }
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    showUpdateItapDialog(data) {
      this.isOperateItap = true;
      this.operationTitle = "修改标签";
      this.operationType = "update";
      this.operationdata = data;
    },
    addItap() {
      let itap = this.operationdata;
      $.post({
        url: baseUrl + "/itap/addItap",
        data: itap,
        success: res => {
          if(res.code == 1) {
            this.$message({
              type: "success",
              message: "添加成功！"
            });
            $.post({
              url: baseUrl + "/itap/getItaps",
              success: res => {
                if(res.code == 1) {
                  this.itapList = res.data.itaps
                } else {
                  this.$message({
                    type: "info",
                    message: res.msg
                  });
                }
              }
            });
          } else {
            this.$message({
              type: "info",
              message: res.msg
            });
          }
        }
      });
      this.isOperateItap = false;
    },
    updateItap() {
      let itap = this.operationdata;
      $.post({
        url: baseUrl + "/itap/updateItap",
        data: itap,
        success: res => {
          if(res.code == 1) {
            this.$message({
              type: "success",
              message: "修改成功！"
            });
            $.post({
              url: baseUrl + "/itap/getItaps",
              success: res => {
                if(res.code == 1) {
                  this.itapList = res.data.itaps
                } else {
                  this.$message({
                    type: "info",
                    message: res.msg
                  });
                }
              }
            });
          } else {
            this.$message({
              type: "info",
              message: res.msg
            });
          }
        }
      });
      this.isOperateItap = false;
    }
  }
};
</script>

<style scoped>
.top {
  margin: 20px 0 30px 10px;
  width: 50%;
}
.el-col {
  margin-right: 10px;
}
.cell {
  text-align: center;
}
</style>
