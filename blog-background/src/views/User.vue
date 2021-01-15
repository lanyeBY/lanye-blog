<template>
  <div class="user">
    <div class="top">
      <el-row>
        <el-col :span="3">
          <el-input placeholder="请输入用户ID" v-model="searchId">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" plain @click="searchUser">搜索</el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" plain @click="showAddUserDialog">
            <i class="el-icon-plus"></i>添加用户
          </el-button>
        </el-col>
        <el-col :span="3">
          <el-button type="danger" plain @click="showClearUserDialog">全部清空</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <el-table :data="userList" border style="width: 100%;">
        <el-table-column prop="userId" label="ID" width="120"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="120"></el-table-column>
        <el-table-column label="头像" width="120">
          <template slot-scope="scope">
            <img class="head_img" :src="scope.row.headImg ? scope.row.headImg : 'http://iph.href.lu/100x100'">
          </template>
        </el-table-column>
        <el-table-column prop="motto" label="座右铭"></el-table-column>
        <el-table-column label="海报" width="200">
          <template slot-scope="scope">
            <el-image
              style="width: 180px;height:100px;"
              :src="scope.row.postImg ? scope.row.postImg : 'http://iph.href.lu/180x100'"
              fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="好友列表" width="100">
          <template slot-scope="scope">
            <span class="linkClick" @click="showFriendListDialog(scope.row.friends)">查看列表</span>
          </template>
        </el-table-column>
        <el-table-column label="收藏列表" width="100">
          <template slot-scope="scope">
            <span class="linkClick" @click="showCollectListDialog(scope.row.collects)">查看列表</span>
          </template>
        </el-table-column>
        <el-table-column label="兴趣标签" width="120">
          <template slot-scope="scope">
            <el-tag
              type="info"
              size="mini"
              v-for="(itap, index) in scope.row.interestItaps"
              :key="index"
            >{{itap}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="addDate" label="添加日期" width="120"></el-table-column>
        <el-table-column fixed="right" label="操作" width="150">
          <template slot-scope="scope">
            <el-button @click="showDeleteUserDialog(scope.row)" type="danger" size="small">删除</el-button>
            <el-button @click="showUpdateUserDialog(scope.row)" type="primary" size="small">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
      :title="operationTitle"
      :visible="isOperateUser"
      width="50%"
      :before-close="closeOperateDialog"
    >
      <el-form label-position="right" label-width="80px" :model="operationdata">
        <el-form-item label="ID">
          <el-input
            v-model="operationdata.userId"
            :disabled="operationType == 'add' ? false : true"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户名">
          <el-input v-model="operationdata.userName"></el-input>
        </el-form-item>
        <el-form-item label="座右铭">
          <el-input v-model="operationdata.motto"></el-input>
        </el-form-item>
        <el-form-item label="头像">
          <img
            class="head_img"
            id="headImgBox"
            :src="dialogHeadImgSrc ? dialogHeadImgSrc : 'http://iph.href.lu/100x100'"
            v-show="dialogHeadImgSrc"
          />
          <el-input type="file" id="headImg" v-model="headImgUrl" accept="image/png, image/jpeg" @input="headImgUpload"></el-input>
        </el-form-item>
        <el-form-item label="海报图" v-if="operationType == 'update'">
          <template>
            <el-image
              id="postImgBox"
              style="width: 180px;height:100px;"
              :src="dialogPostImgSrc ? dialogPostImgSrc : 'http://iph.href.lu/180x100'"
              v-show="dialogPostImgSrc"
              fit="cover"></el-image>
            <el-input type="file" id="postImg" v-model="postImgUrl" accept="image/png, image/jpeg" @change="postImgUpload"/>
          </template>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeOperateDialog">取 消</el-button>
        <el-button type="primary" @click="addUser" v-if="operationType == 'add'">确 定</el-button>
        <el-button type="primary" @click="updateUser" v-if="operationType == 'update'">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="查看好友" :visible.sync="isShowFriendList" width="50%">
      <el-table :data="friendList" border style="width: 100%;" height="500">
        <el-table-column prop="userId" label="ID" width="120"></el-table-column>
        <el-table-column prop="userName" label="用户名" width="120"></el-table-column>
        <el-table-column label="头像" width="120">
          <template slot-scope="scope">
            <div>
              <img class="head_img" :src="scope.row.headImg ? scope.row.headImg : 'http://iph.href.lu/100x100'">
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="motto" label="座右铭"></el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowFriendList = false">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="查看收藏" :visible.sync="isShowCollectList" width="50%">
      <el-table :data="collectList" border style="width: 100%;" height="500">
        <el-table-column prop="blogId" label="ID" width="120"></el-table-column>
        <el-table-column prop="blogTitle" label="标题" width="120"></el-table-column>
        <el-table-column label="海报" width="150">
          <template slot-scope="scope">
            <div class="blogpost_img">
              <img :src="scope.row.blogPostImg ? scope.row.blogPostImg :'http://iph.href.lu/130x180'">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="内容">
          <template slot-scope="scope">
            <p class="collect_content">{{scope.row.content}}</p>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isShowCollectList = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const baseUrl = "http://localhost:3000";

export default {
  name: "user",
  data() {
    return {
      searchId: "",
      userList: [],
      isOperateUser: false,
      isShowFriendList: false,
      isShowCollectList: false,
      operationTitle: "添加用户",
      operationType: "add",
      operationdata: {},
      friendList: [],
      collectList: [],
      headImgUrl: "",
      postImgUrl: "",
      dialogHeadImgSrc: "",
      dialogPostImgSrc: ""
    };
  },
  mounted() {
    $.post({
      url: baseUrl + "/user/getUsers",
      success: res => {
        if (res.code == 1) {
          let users = res.data.users;
          users.forEach((user) => {
            let collects = [];
            collects = this.operateContent(user.collects);
            user.collects = collects;
          });
          this.userList = users;
        } else {
          console.log(res.msg);
        }
      }
    });
  },
  methods: {
    operateContent(array) {
      let blogs = array;
      blogs.forEach((blog) => {
        let content = "";
        for(let i = 0; i < blog.content.length; i++) {
          if(blog.content[i].name == 'p') {
            content = content + blog.content[i].children[0].text.replace('\n','<br/>');
          }
        }
        blog.content = content;
      });
      return blogs;
    },
    searchUser() {
      let userId = this.searchId;
      $.post({
        url: baseUrl + "/user/findUser",
        data: {
          userId: userId
        },
        success: (res) => {
          if (res.code == 1) {
            let users = res.data.users;
            users.forEach((user) => {
              let collects = [];
              collects = this.operateContent(user.collects);
              user.collects = collects;
            });
            this.userList = users;
          } else {
            console.log(res.msg);
          }
        }
      });
    },
    showAddUserDialog() {
      this.isOperateUser = true;
      this.operationTitle = "添加用户";
      this.operationType = "add";
      this.operationdata = {};
      this.dialogHeadImgSrc = "";
    },
    closeOperateDialog() {
      this.$confirm("关闭将不保存修改数据，是否继续?", "提示", {
        type: "warning"
      }).then(() => {
        this.isOperateUser = false;
        this.operationdata = {};
      });
    },
    showClearUserDialog() {
      this.$confirm("此操作将删除全部用户, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $.post({
            url: baseUrl + "/user/clearUsers",
            success: res => {
              if (res.code == 1) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                $.post({
                  url: baseUrl + "/user/getUsers",
                  success: res => {
                    if (res.code == 1) {
                      let users = res.data.users;
                      users.forEach((user) => {
                        user.collects = this.operateContent(user.collects);
                      });
                      this.userList = users;
                    } else {
                      console.log(res.msg);
                    }
                  }
                });
              } else {
                this.$message({
                  type: "info",
                  message: "删除失败，系统有误.."
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
    showFriendListDialog(list) {
      this.isShowFriendList = true;
      this.friendList = list;
    },
    showCollectListDialog(list) {
      this.isShowCollectList = true;
      this.collectList = list;
    },
    showDeleteUserDialog(data) {
      this.$confirm(`确定删除用户 ${data.userName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          $.post({
            url: baseUrl + "/user/clearUserById",
            data: {
              userId: data.userId
            },
            success: res => {
              if (res.code == 1) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                $.post({
                  url: baseUrl + "/user/getUsers",
                  success: res => {
                    if (res.code == 1) {
                      let users = res.data.users;
                      users.forEach((user) => {
                        user.collects = this.operateContent(user.collects);
                      });
                      this.userList = users;
                    } else {
                      console.log(res.msg);
                    }
                  }
                });
              } else {
                this.$message({
                  type: "info",
                  message: "删除失败，系统有误.."
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
    showUpdateUserDialog(data) {
      this.isOperateUser = true;
      this.operationTitle = "修改用户信息";
      this.operationType = "update";
      this.operationdata = data;
      this.dialogHeadImgSrc = this.operationdata.headImg;
      this.dialogPostImgSrc = this.operationdata.postImg;
    },
    addUser() {
      this.operationdata.headImg = this.dialogHeadImgSrc;
      let user = this.operationdata;
      $.post({
        url: baseUrl + "/user/addUser",
        data: user,
        success: (res) => {
          if(res.code == 10) {
            this.$message({
              type: "info",
              message: res.msg
            });
          } else if(res.code == 0) {
            this.$message({
              type: "info",
              message: res.msg
            });
          } else if(res.code == 11) {
            this.$message({
              type: "info",
              message: "添加用户成功！"
            });
            $.post({
              url: baseUrl + "/user/getUsers",
              success: res => {
                if (res.code == 1) {
                  let users = res.data.users;
                  users.forEach((user) => {
                    user.collects = this.operateContent(user.collects);
                  });
                  this.userList = users;
                } else {
                  console.log(res.msg);
                }
              }
            });
          }
        }
      });
      this.isOperateUser = false;
      this.operationdata = {};
    },
    updateUser() {
      this.operationdata.headImg = this.dialogHeadImgSrc;
      this.operationdata.postImg = this.dialogPostImgSrc;
      let user = this.operationdata;
      $.post({
        url: baseUrl + "/user/updateUser",
        data: user,
        success: (res) => {
          if(res.code == 1) {
            this.$message({
              type: "success",
              message: "修改用户信息成功！"
            });
            $.post({
              url: baseUrl + "/user/getUsers",
              success: res => {
                if (res.code == 1) {
                  let users = res.data.users;
                  users.forEach((user) => {
                    user.collects = this.operateContent(user.collects);
                  });
                  this.userList = users;
                } else {
                  console.log(res.msg);
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
      this.isOperateUser = false;
      this.operationdata = {};
    },
    headImgUpload() {
      let that = this;
      let file = document.getElementById('headImg').files[0];
      let oFReader = new FileReader();
      oFReader.addEventListener("load", function () {
        document.getElementById('headImgBox').src = oFReader.result;
        that.dialogHeadImgSrc = oFReader.result;
      }, false);
      oFReader.readAsDataURL(file);
    },
    postImgUpload() {
      let that = this;
      let file = document.getElementById('postImg').files[0];
      let oFReader = new FileReader();
      console.log(oFReader);
      oFReader.addEventListener("load", function () {
        document.getElementById('postImgBox').src = oFReader.result;
        that.dialogPostImgSrc = oFReader.result;
      }, false);
      oFReader.readAsDataURL(file);
    }
  }
};
</script>

<style>
.top {
  margin: 20px 0 30px 60px;
}
.back {
  float: left;
}
.cell {
  text-align: center;
}
.collect_content {
  height: 180px;
  -webkit-line-clamp: 8;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
.head_img {
  width: 100px;
  height: 100px;
  display: block;
  background-color: bisque;
}
.el-image {
  display: block;
}
#headImg, #postImg {
  padding: 0;
  width: 74px;
  overflow: hidden;
  border: none;
  display: block;
}
.blogpost_img {
  width: 130px;
  height: 180px;
  background-color: #eee;
}
.blogpost_img > img {
  width: 100%;
  height: 100%;
}
.linkClick {
  cursor: pointer;
}
.linkClick:hover {
  color: #ffd04b;
}
</style>
