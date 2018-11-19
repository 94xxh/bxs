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
            <el-form-item label="公司名称" prop="company_name">
                <el-input v-model="addForm.company_name" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="公司简介" prop="des">
                <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入"
                v-model="addForm.des">
                </el-input>
            </el-form-item>
            <el-form-item label="公司标签" prop="tag">
                <el-select v-model="addForm.tag" placeholder="请选择">
                    <el-option label="标签1" value="1"></el-option>
                    <el-option label="标签2" value="2"></el-option>
                    <el-option label="标签3" value="3"></el-option>
                    <el-option label="标签4" value="4"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="分类" prop="category_id">
                <el-select v-model="addForm.category_id" placeholder="请选择">
                    <el-option label="类型1" value="1"></el-option>
                    <el-option label="类型2" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关键词" prop="keyword">
                <el-input v-model="addForm.keyword" placeholder="请输入"></el-input>
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
import { saveCompany } from '@/api/company'

export default {
  name: 'addCompany',
  data() {
    return {
      addForm: {},
      submitbtnStatus: true,
      isLoading: false,
      // 表单验证规则
      rules: {
        company_name: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        des: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        tag: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        category_id: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        keyword: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      }
    }
  },

  created() {
    // 判断是新增还是修改
    const rowData = this.$route.query.id ? JSON.parse(this.$route.query.id) : ''
    if (rowData) {
      this.submitbtnStatus = false
      this.xlog('update')
    } else {
      this.submitbtnStatus = true
      this.xlog('add')
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.submitbtnStatus) {
            // 更新
            const postData = {}
            for (const i in this.addForm) {
              if (this.addForm[i]) {
                postData[i] = this.addForm[i]
              }
            }
            console.log(postData)
            // updateArticle(this.$route.query.id, postData)
            //   .then(res => {
            //     if (res.data.status.Code === 200) {
            //       // 处理数据
            //       this.$message({
            //         message: res.data.status.Msg,
            //         type: 'success',
            //         duration: 5 * 1000
            //       })
            //       // 跳转
            //       this.$router.push({
            //         name: 'companyList',
            //         query: {
            //           reLoad: Date.parse(new Date())
            //         }
            //       })
            //     } else {
            //       this.$message({
            //         message: res.data.status.Msg,
            //         type: 'error',
            //         duration: 5 * 1000
            //       })
            //     }
            //   })
            //   .catch(err => {
            //     console.log(err)
            //     this.$message({
            //       message: '读取接口失败！',
            //       type: 'error',
            //       duration: 5 * 1000
            //     })
            //   })
          } else {
            //   新增
            saveCompany(this.addForm)
              .then(res => {
                if (res.data.status.Code === 200) {
                  // 处理数据
                  this.$message({
                    message: res.data.status.Msg,
                    type: 'success',
                    duration: 5 * 1000
                  })
                  // 跳转
                  this.$router.push({
                    name: 'companyList',
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

