<template>
  <div class="app-container" v-loading="isLoading">
    <div class="x-form">
        <el-form 
        width=100%
        v-loading = "isLoading"
        element-loading-spinner="el-icon-loading" 
        :model="form" :rules="rules" 
        ref="form" label-width="100px" 
        class="demo-form">
            <el-form-item label="分类名称" prop="category_name">
                <el-input v-model="form.category_name" placeholder="请输入分类名称"></el-input>
            </el-form-item>
            <el-form-item label="父级" prop="pid">
                <el-select v-model="form.pid" placeholder="请选择">
                    <el-option v-for="(item, index) in cateList" :key="index" :label="item.category_name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类类型" prop="type">
                <el-select v-model="form.type" placeholder="请选择类型">
                    <el-option label="类型1" :value="0"></el-option>
                    <el-option label="类型2" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地址" prop="url">
                <el-input v-model="form.url" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="form.status" placeholder="请选择地区">
                    <el-option label="不可用" :value="0"></el-option>
                    <el-option label="可用" :value="1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="简介" prop="content">
                <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入简介"
                v-model="form.content">
                </el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('form','add')" v-if="submitbtnStatus">立即创建</el-button>
                <el-button type="primary" @click="submitForm('form','update')" v-else>保存修改</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import { getList, handleRead, handleSave, handleUpdate } from '@/api/category'

export default {
  name: 'addCategory',
  data() {
    return {
      form: {},
      submitbtnStatus: true,
      isLoading: false,
      cateList: [],
      // 表单验证规则
      rules: {
        category_name: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        type: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        pid: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        url: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        status: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        content: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    this.isLoading = true
    //   读取父级分类
    getList({})
      .then(res => {
        this.isLoading = false
        if (res.data.status.Code === 200) {
          // 处理数据
          if (this.$route.query.id) {
            // 去除本省
            this.cateList = res.data.result.data.filter(item => {
              return item.id !== this.$route.query.id
            })
          }
          this.cateList = res.data.result.data
        } else {
          this.$message({
            message: res.data.status.Msg,
            type: 'error',
            duration: 5 * 1000
          })
        }
      })
      .catch(err => {
        this.isLoading = false
        console.log(err)
        this.$message({
          message: '读取接口失败！',
          type: 'error',
          duration: 5 * 1000
        })
      })
    // 判断是新增还是修改
    const rowData = this.$route.query.id ? JSON.parse(this.$route.query.id) : ''
    if (rowData) {
      this.submitbtnStatus = false
      this.xlog('update')
      handleRead(rowData)
        .then(res => {
          if (res.data.status.Code === 200) {
            // 处理数据
            this.form = res.data.result
          } else {
            this.$message({
              message: res.data.status.Msg,
              type: 'error',
              duration: 5 * 1000
            })
          }
        })
        .catch(err => {
          console.log(err)
          this.$message({
            message: '读取接口失败！',
            type: 'error',
            duration: 5 * 1000
          })
        })
    } else {
      this.submitbtnStatus = true
      this.xlog('add')
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.isLoading = true
          if (!this.submitbtnStatus) {
            // 更新
            const postData = {}
            for (const i in this.form) {
              if (this.form[i]) {
                postData[i] = this.form[i]
              }
            }
            console.log(postData)
            handleUpdate(this.$route.query.id, postData)
              .then(res => {
                this.isLoading = false
                if (res.data.status.Code === 200) {
                  // 处理数据
                  this.$message({
                    message: res.data.status.Msg,
                    type: 'success',
                    duration: 5 * 1000
                  })
                  // 跳转
                  this.$router.push({
                    name: 'categoryList',
                    query: {
                      reLoad: Date.parse(new Date())
                    }
                  })
                } else {
                  this.$message({
                    message: res.data.status.Msg,
                    type: 'error',
                    duration: 5 * 1000
                  })
                }
              })
              .catch(err => {
                this.isLoading = false
                console.log(err)
                this.$message({
                  message: '读取接口失败！',
                  type: 'error',
                  duration: 5 * 1000
                })
              })
          } else {
            //   新增
            handleSave(this.form)
              .then(res => {
                this.isLoading = false
                if (res.data.status.Code === 200) {
                  // 处理数据
                  this.$message({
                    message: res.data.status.Msg,
                    type: 'success',
                    duration: 5 * 1000
                  })
                  // 跳转
                  this.$router.push({
                    name: 'categoryList',
                    query: {
                      reLoad: Date.parse(new Date())
                    }
                  })
                } else {
                  this.$message({
                    message: res.data.status.Msg,
                    type: 'error',
                    duration: 5 * 1000
                  })
                }
              })
              .catch(err => {
                this.isLoading = false
                console.log(err)
                this.$message({
                  message: '读取接口失败！',
                  type: 'error',
                  duration: 5 * 1000
                })
              })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/common.scss";
</style>

