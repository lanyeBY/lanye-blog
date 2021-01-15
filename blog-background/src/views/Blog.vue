<template>
  <div class="blog">
    <div class="top">
      <el-row>
        <el-col :span="3">
          <el-input placeholder="请输入博主ID" v-model="userId">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" icon="el-icon-search" plain @click="searchBlogByUserId">搜索博主博客</el-button>
        </el-col>
        <el-col :span="4">
          <el-input placeholder="请输入博客标题" v-model="searchTitle">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-select
            style="width: 100%;"
            v-model="searchItaps"
            multiple
            filterable
            remote
            reserve-keyword
            placeholder="或选择兴趣标签"
            :remote-method="remoteMethod"
            :loading="searchLoading"
          >
            <el-option
              v-for="item in itapOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" icon="el-icon-search" plain @click="searchBlog">搜索博客</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="content">
      <el-table :data="blogList" border style="width: 100%;">
        <el-table-column prop="blogId" label="ID" width="100"></el-table-column>
        <el-table-column prop="blogTitle" label="博客标题" width="120"></el-table-column>
        <el-table-column prop="userName" label="博主" width="120"></el-table-column>
        <el-table-column label="海报" width="150">
          <template slot-scope="scope">
            <el-image
              style="width: 130px; height:180px;"
              :src="scope.row.blogPostImg ? scope.row.blogPostImg : 'http://iph.href.lu/130x180'"
              fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column label="文本">
          <template slot-scope="scope">
            <p class="blog_content_text">{{scope.row.content.toString()}}</p>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="110"></el-table-column>
        <el-table-column prop="lastChangeTime" label="上一次编辑时间" width="110"></el-table-column>
        <el-table-column label="兴趣标签" width="120">
          <template slot-scope="scope">
            <el-tag
              type="info"
              size="mini"
            >{{scope.row.itap}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="collectNumber" label="收藏次数" width="65"></el-table-column>
        <el-table-column prop="likeNumber" label="点赞次数" width="65"></el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
const baseUrl = "http://localhost:3000";

export default {
  name: "blog",
  data() {
    return {
      userId: "",
      searchTitle: "",
      itapOptions: [],
      searchItaps: [],
      searchLoading: false,
      blogList: [],
    };
  },
  mounted() {
    $.post({
      url: baseUrl + "/blog/getBlogs",
      success: res => {
        if (res.code == 1) {
          let blogs = res.data.blogs;
          blogs.forEach((blog) => {
            let content = "";
            for(let i = 0; i < blog.content.length; i++) {
              if(blog.content[i].name == 'p') {
                content = content + blog.content[i].children[0].text;
              }
            }
            blog.content = content;
          });
          this.blogList = blogs;
        } else {
          console.log(res.msg);
        }
      }
    });
    $.post({
      url: baseUrl + "/itap/getItaps",
      success: res => {
        if (res.code == 1) {
          let itaps = res.data.itaps;
          this.itapOptions = itaps.map(item => {
            return { value: item.itap, label: item.itap };
          })
        } else {
          console.log(res.msg);
        }
      }
    });
  },
  methods: {
    remoteMethod(query) {
      if (query !== "") {
        this.searchLoading = true;
        setTimeout(() => {
          this.searchLoading = false;
          this.itapOptions = this.itapOptions.filter(item => {
            return item.label.toLowerCase().indexOf(query.toLowerCase()) > -1;
          });
        }, 200);
      } else {
        this.itapOptions = [];
      }
    },
    searchBlogByUserId() {
      let userId = this.userId;
      $.post({
        url: baseUrl + "/blog/getblogs",
        data: {
          userId: userId
        },
        success: (res) => {
          if(res.code == 1) {
            let blogs = res.data.blogs;
            blogs.forEach((blog) => {
              let content = "";
              for(let i = 0; i < blog.content.length; i++) {
                if(blog.content[i].name == 'p') {
                  content = content + blog.content[i].children[0].text;
                }
              }
              blog.content = content;
            });
            this.blogList = blogs;
          } else {
            this.$message({
              type: "info",
              message: res.msg
            });
          }
        }
      });
    },
    searchBlog() {
      let search = {};
      if(this.searchTitle != "") {
        search.search = this.searchTitle;
      } else if(this.searchItaps != []) {
        search.interestItaps = this.searchItaps;
      }
      $.post({
        url: baseUrl + '/blog/searchBlog',
        data: search,
        success: res => {
          if(res.code == 1) {
            let blogs = res.data.blogs;
            blogs.forEach((blog) => {
              let content = "";
              for(let i = 0; i < blog.content.length; i++) {
                if(blog.content[i].name == 'p') {
                  content = content + blog.content[i].children[0].text;
                }
              }
              blog.content = content;
            });
            this.blogList = blogs;
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

<style>
.top {
  margin: 20px 0 30px 60px;
}
.el-col {
    margin-right: 10px;
}
.cell {
  text-align: center;
}
.blog_content_text {
  height: 180px;
  -webkit-line-clamp: 8;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
