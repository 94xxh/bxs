<template>
  <div class="app-container">
    <div class="x-form">
        <el-form 
        width=100%
        v-loading = "isLoading"
        element-loading-spinner="el-icon-loading" 
        :model="addForm" :rules="rules" 
        ref="addForm" label-width="100px" 
        class="demo-addForm">
            <el-form-item label="git名称" prop="git_name">
                <el-input v-model="addForm.git_name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="git简介" prop="des">
                <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入"
                v-model="addForm.des">
                </el-input>
            </el-form-item>
            <el-form-item  label="标签" prop="tag">
                <el-select multiple v-model="addForm.tag" placeholder="请选择">
                  <el-option v-for="(item, index) in tagsList" :label="item.tag_name" :value="String(item.id)" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关键词" prop="keyword">
                <el-input v-model="addForm.keyword" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="url">
                <el-input v-model="addForm.url" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('addForm','add')" v-if="submitbtnStatus">立即创建</el-button>
                <el-button type="primary" @click="submitForm('addForm','update')" v-else>保存修改</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import { handleSave, handleUpdate, handleRed } from '@/api/git'
const tags = require('@/api/tags')

export default {
  name: 'addGit',
  data() {
    return {
      addForm: {},
      tagsList: {},
      submitbtnStatus: true,
      isLoading: false,
      // 表单验证规则
      rules: {
        git_name: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        des: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        tag: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        keyword: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        url: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    // 获取标签
    tags.getList({ pagenum: 9999, page: 1 })
      .then(res => {
        if (res.data.status.Code === 200) {
        // 处理数据
          this.tagsList = res.data.result.data
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
    // 判断是新增还是修改
    const rowData = this.$route.query.id ? JSON.parse(this.$route.query.id) : ''
    if (rowData) {
      this.submitbtnStatus = false
      this.xlog('update')
      handleRed(rowData)
        .then(res => {
          if (res.data.status.Code === 200) {
            // 处理数据
            res.data.result[0].tag = res.data.result[0].tag.split(',')
            this.addForm = res.data.result[0]
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
          this.addForm.tag = this.addForm.tag ? this.addForm.tag.join(',') : ''
          if (!this.submitbtnStatus) {
            // 更新
            const postData = {}
            for (const i in this.addForm) {
              if (this.addForm[i]) {
                postData[i] = this.addForm[i]
              }
            }
            console.log(postData)
            this.isLoading = true
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
                    name: 'gitList',
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
            handleSave(this.addForm)
              .then(res => {
                this.isLoading = false
                if (res.data.status.Code === 200) {
                  this.resetForm('addForm')
                  // 处理数据
                  this.$message({
                    message: res.data.status.Msg,
                    type: 'success',
                    duration: 5 * 1000
                  })
                  // 跳转
                  this.$router.push({
                    name: 'gitList',
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
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/common.scss";
</style>

