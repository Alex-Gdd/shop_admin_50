<template>
  <div class="login">
    <el-form ref="form" status-icon :rules="rules" :model="form" label-width="80px">
      <img src="../assets/avatar.jpg" class="logo">
      <el-form-item label="用户名" prop="username">
        <el-input @keyup.enter.native="login" placeholder="请输入用户名" v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input @keyup.enter.native="login" type="password" placeholder="请输入密码" v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" class="leftBtn" @click="login">登录</el-button>
        <el-button @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
// import axios from 'axios'
export default {
  data () {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { require: true, message: '用户名不能为空', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名长度必须在3-12位', trigger: ['blur', 'change'] }
        ],
        password: [
          { require: true, message: '用户名不能为空', trigger: ['blur', 'change'] },
          { min: 3, max: 12, message: '用户名长度必须在3-12位', trigger: ['blur', 'change'] }
        ]
      }
    }
  },
  methods: {
    reset () {
      this.$refs.form.resetFields()
    },
    async login () {
      try {
        await this.$refs.form.validate()
        const { meta, data } = await this.$axios.post('login', this.form)
        if (meta.status === 200) {
          localStorage.setItem('token', data.token)
          this.$message({
            message: meta.msg,
            type: 'success',
            duration: 1000
          })

          this.$router.push({ name: 'index' })
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style lang="scss">
.login{
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  overflow: hidden;
  .el-form{
    background-color: #fff;
    width: 400px;
    padding:20px;
    border-radius: 20px;
    padding-top:70px;
    margin:0 auto;
    margin-top:200px;
    position: relative;
    .logo{
      width: 130px;
      height: 130px;
      border-radius: 50%;
      position: absolute;
      left:50%;
      transform: translateX(-50%);
      top: -75px;
      border:5px solid #fff;
    }
    .leftBtn{
      margin-right: 70px;
    }
  }
}
</style>
