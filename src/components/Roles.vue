<template>
  <div class="roles">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 按钮 -->
    <el-button class="addBtn" type="success" plain @click="showAddDialog">添加用户</el-button>
    <!-- 表格 -->
    <el-table :data="roleList">
      <el-table-column type="expand">
        <template v-slot:default="{ row }">
        <p v-if="row.children.length===0">暂无权限</p>
          <el-row class="l1" v-for="l1 in row.children" :key="l1.id">
            <el-col :span="4"><el-tag closable @close="delRight(row,l1.id)">{{ l1.authName }}</el-tag></el-col>
            <el-col :span="20">
              <el-row class="l2" v-for="l2 in l1.children" :key="l2.id">
                <el-col :span="4"><el-tag closable @close="delRight(row,l2.id)" type="success">{{ l2.authName }}</el-tag></el-col>
                <el-col :span="20">
                  <el-tag closable @close="delRight(row,l3.id)" class="l3" type="warning" v-for="l3 in l2.children" :key="l3.id">{{ l3.authName }}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template v-slot:default="{ row }">
          <el-button size="small" icon="el-icon-edit" type="primary" plain @click="alterRole(row)"></el-button>
        <el-button size="small" icon="el-icon-delete" type="danger" plain @click="delRole(row.id)"></el-button>
        <el-button size="small" icon="el-icon-check" type="success" plain @click="showAssignDialog(row)">分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配 -->
    <el-dialog
      title="分配权限"
      :visible.sync="assignVisible"
      width="40%">
      <el-tree
      node-key="id"
      ref="tree"
      show-checkbox
      default-expand-all
      :data="data"
      :props="defaultProps">
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button @click="assignRights" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加 -->
    <el-dialog
      title="添加角色"
      :visible.sync="addVisible"
      width="40%">
      <el-form :rules='rules' ref="form" :model="form" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input placeholder="请输入角色名称" v-model="form.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input placeholder="请输入角色描述" v-model="form.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button @click="addRole" type="primary">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog
      title="修改角色"
      :visible.sync="alterVisible"
      width="40%">
      <el-form ref="alterForm" :model="alterForm" label-width="80px">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="alterForm.roleName">{{ alterForm.roleName }}</el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="alterForm.roleDesc">{{ alterForm.roleDesc }}</el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="alterVisible = false">取 消</el-button>
        <el-button @click="alterDialog" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      data: [],
      roleId: '',
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // 结束
      roleList: [],
      assignVisible: false,
      addVisible: false,
      alterVisible: false,
      alterForm: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      form: {
        id: '',
        roleName: '',
        roleDesc: ''
      },
      rules: {
        roleName: [
          { required: true, message: '请输入角色名称', trigger: ['blur', 'change'] }
        ],
        roleDesc: [
          { required: true, message: '请输入角色描述', trigger: ['blur', 'change'] }
        ]
      }
      // 结束
    }
  },

  created () {
    this.getUserList()
  },
  methods: {
    async getUserList () {
      const { meta, data } = await this.$axios.get('roles')
      if (meta.status === 200) {
        this.roleList = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRight (row, rightId) {
      const { meta, data } = await this.$axios.delete(`roles/${row.id}/rights/${rightId}`)
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        row.children = data
      } else {
        this.$message.error(meta.msg)
      }
    },
    async showAssignDialog (row) {
      this.roleId = row.id
      this.assignVisible = true
      const { meta, data } = await this.$axios.get('rights/tree')
      if (meta.status === 200) {
        this.data = data
        const ids = []
        row.children.forEach(l1 => {
          l1.children.forEach(l2 => {
            l2.children.forEach(l3 => {
              ids.push(l3.id)
            })
          })
        })
        this.$refs.tree.setCheckedKeys(ids)
      } else {
        this.$message.error(meta.msg)
      }
    },
    async assignRights () {
      const ids = this.$refs.tree.getCheckedKeys()
      const halfs = this.$refs.tree.getHalfCheckedKeys()
      const rids = [...ids, ...halfs].join(',')
      console.log(rids)
      const { meta } = await this.$axios.post(`roles/${this.roleId}/rights`, { rids })
      if (meta.status === 200) {
        this.$message.success(meta.msg)
        this.assignVisible = false
        this.getUserList()
      } else {
        this.$message.error(meta.msg)
      }
    },
    async delRole (id) {
      try {
        await this.$confirm('亲, 你确定要删除么?', '温馨提示', {
          type: 'warning'
        })
        const { meta } = await this.$axios.delete(`roles/${id}`)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    showAddDialog () {
      this.addVisible = true
    },
    async addRole () {
      try {
        await this.$refs.form.validate()
        const { meta } = await this.$axios.post('roles', this.form)
        console.log(meta)
        if (meta.status === 201) {
          this.$message.success(meta.msg)
          this.addVisible = false
          this.getUserList()
        } else {
          this.$message.error(meta.msg)
        }
      } catch (e) {
        console.log(e)
      }
    },
    alterRole (row) {
      this.alterVisible = true
      this.alterForm.id = row.id
      this.alterForm.roleName = row.roleName
      this.alterForm.roleDesc = row.roleDesc
    },
    async alterDialog () {
      try {
        const { id, roleName, roleDesc } = this.alterForm
        const { meta } = await this.$axios.put(`roles/${id}`, { roleName, roleDesc })
        console.log(meta)
        if (meta.status === 200) {
          this.$message.success(meta.msg)
          this.alterVisible = false
          this.getUserList()
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

<style lang="scss" scoped>

.addBtn{
  margin-bottom: 10px;
}
.l1{
  margin:5px;
  border-bottom: 1px dotted #ccc;
  &:last-child {
      border-bottom: none;
    }
}
.l2{
  margin-bottom:5px;
}
.l3{
  margin-right:5px;
  margin-bottom:5px;
}
</style>
