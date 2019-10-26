<template>
  <div class="users">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-input placeholder="请输入内容" v-model="query" class="input-with-select">
      <el-button @click="serchUsers" slot="append" icon="el-icon-search"></el-button>
    </el-input>
    <el-button class="addBtn" type="success" plain>添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <template v-slot:default="obj">
          <!-- {{ obj.row.mg_state }} -->
          <el-switch @change="changeState(obj.row.id,obj.row.mg_state)" v-model="obj.row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="obj">
          <el-button type="primary" size="small" plain icon="el-icon-edit"></el-button>
          <el-button
            @click="delUsers(obj.row.id)"
            type="danger"
            size="small"
            plain
            icon="el-icon-delete"
          ></el-button>
          <el-button type="success" size="small" plain icon="el-icon-check">分配角色</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8, 10]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    ></el-pagination>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  created () {
    this.getUserList()
  },
  data () {
    return {
      userList: [],
      query: '',
      pagenum: 1,
      pagesize: 2,
      total: 0
    }
  },
  // axios.get(url, config)   可以配置params, 也可以配置请求头等额外参数
  methods: {
    async getUserList () {
      const { meta, data } = await this.$axios.get('users', {
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      })
      if (meta.status === 200) {
        this.userList = data.users
        this.total = data.total
        console.log(this.userList)
      } else {
        this.$message.error(meta.msg)
      }
    },
    handleSizeChange (val) {
      this.pagesize = val
      this.pagenum = 1
      this.getUserList()
    },
    handleCurrentChange (val) {
      this.pagenum = val
      this.getUserList()
    },
    async delUsers (id) {
      try {
        await this.$confirm('亲，你确定要要进行删除吗？', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`users/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          if (this.userList.length === 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    serchUsers () {
      this.pagenum = 1
      this.getUserList()
    },
    async changeState (id, flag) {
      const { meta } = await this.$axios.put(`users/${id}/state/${flag}`)
      if (meta.status === 200) {
        this.$message.success('修改成功')
      } else {
        this.$message.error(meta.msg)
      }
    }
  }
}
</script>

<style lang="scss">
.el-breadcrumb{
  height: 40px;
  line-height: 40px;
  border-bottom: 1px solid #ccc;
  margin-bottom: 10px;
}
.input-with-select{
  width: 300px;
  margin-bottom: 10px;
}
.addBtn{
  margin-left: 10px;
}
</style>
