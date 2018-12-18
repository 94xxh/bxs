<template>
  <div class="app-container">
    <div class="x-form" v-loading="isLoading">
        <el-form 
        width=100%
        v-loading = "isLoading"
        element-loading-spinner="el-icon-loading" 
        :model="addForm" :rules="rules" 
        ref="addForm" label-width="100px" 
        class="demo-addForm">
            <el-form-item label="白皮书名称" prop="wpp_name">
                <el-input v-model="addForm.wpp_name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="des">
                <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入"
                v-model="addForm.des">
                </el-input>
            </el-form-item>
            <el-form-item label="关键词" prop="keyword">
                <el-input v-model="addForm.keyword" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="wpp_url">
                <el-input v-model="addForm.wpp_url" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="content">
              <Tinymce :height=400 ref="editor" v-model="addForm.content" />
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
import { handleSave, handleUpdate, handleRed } from '@/api/wpp'
import Tinymce from '@/components/Tinymce'

export default {
  name: 'addWpp',
  data() {
    return {
      addForm: {},
      submitbtnStatus: true,
      isLoading: false,
      // 表单验证规则
      rules: {
        wpp_name: [
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
        wpp_url: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        content: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },
  components: {
    Tinymce
  },
  created() {
    // 判断是新增还是修改
    const rowData = this.$route.query.id ? JSON.parse(this.$route.query.id) : ''
    if (rowData) {
      this.submitbtnStatus = false
      this.isLoading = true
      this.xlog('update')
      handleRed(rowData)
        .then(res => {
          this.isLoading = false
          if (res.data.status.Code === 200) {
            // 处理数据
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
          this.isLoading = false
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
            for (const i in this.addForm) {
              if (this.addForm[i]) {
                postData[i] = this.addForm[i]
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
                    name: 'wppList',
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
                  // 重置表单
                  this.resetForm('addForm')
                  this.$refs.editor.setContent('')
                  // 处理数据
                  this.$message({
                    message: res.data.status.Msg,
                    type: 'success',
                    duration: 5 * 1000
                  })
                  // 跳转
                  this.$router.push({
                    name: 'wppList',
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

