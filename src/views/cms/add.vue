<template>
  <div class="app-container" v-loading="isLoading">
    <div class="x-form">
        <el-form 
        width=100%
        v-loading = "isLoading"
        element-loading-spinner="el-icon-loading" 
        :model="addForm" :rules="rules" 
        ref="addForm" label-width="100px" 
        class="demo-addForm">
            <el-form-item label="标题" prop="title">
                <el-input v-model="addForm.title" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="摘要" prop="des">
                <el-input
                type="textarea"
                :rows="2"
                placeholder="请输入项目简介"
                v-model="addForm.des">
                </el-input>
            </el-form-item>
            <el-form-item label="标签" prop="tag">
                <!-- <el-select multiple v-model="addForm.tag" placeholder="请选择">
                  <el-option v-for="(item, index) in tagsList" :label="item.tag_name" :value="String(item.id)" :key="index"></el-option>
                </el-select> -->

                <el-checkbox-group v-model="addForm.tag">
                  <el-checkbox  v-for="(item, index) in tagsList" :label="String(item.id)" :key="index">{{item.tag_name}}</el-checkbox>
                </el-checkbox-group>
                <el-pagination
                background
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="pageSizes"
                :page-size="pageSize"
                layout="prev, pager, next"
                :total="totalNum">
                </el-pagination>
            </el-form-item>
            <el-form-item label="分类" prop="category_id">
                <el-select v-model="addForm.category_id" placeholder="请选择">
                  <el-option v-for="(item, index) in cateList" :label="item.category_name" :value="item.id" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="内容" prop="content">
              <Tinymce :height=400 ref="editor" v-model="addForm.content" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('addForm')" v-if="submitbtnStatus">立即创建</el-button>
                <el-button type="primary" @click="submitForm('addForm')" v-else>保存修改</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import { saveArticle, updateArticle, handleRead } from '@/api/cms'
import Tinymce from '@/components/Tinymce'
const tags = require('@/api/tags')
const category = require('@/api/category')

export default {
  name: 'addCms',
  data() {
    return {
      addForm: {
        tag: []
      },
      cateList: [],
      tagsList: {},
      submitbtnStatus: true,
      isLoading: true,
      // 表单验证规则
      rules: {
        title: [
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
        content: [
          { required: true, message: '必填项', trigger: 'change' }
        ]
      },
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 0
    }
  },
  components: {
    Tinymce
  },
  created() {
    // 获取分类
    category.getList({ pagenum: 9999, page: 1 })
      .then(res => {
        this.isLoading = false
        if (res.data.status.Code === 200) {
        // 处理数据
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
    // 获取标签
    tags.getList({ pagenum: 10, page: 1 })
      .then(res => {
        this.isLoading = false
        if (res.data.status.Code === 200) {
        // 处理数据
          this.tagsList = res.data.result.data
          this.totalNum = res.data.result.total
          this.currentPage = res.data.result.current_page
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
            res.data.result.tag = res.data.result.tag.split(',')
            this.addForm = res.data.result
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
            updateArticle(this.$route.query.id, postData)
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
                    name: 'cmsList',
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
            saveArticle(this.addForm)
              .then(res => {
                this.isLoading = false
                if (res.data.status.Code === 200) {
                  // 重置表单
                  this.$set(this.addForm, 'content', '')
                  this.$refs.editor.setContent('')
                  this.resetForm('addForm')
                  // 处理数据
                  this.$message({
                    message: res.data.status.Msg,
                    type: 'success',
                    duration: 5 * 1000
                  })
                  // 跳转
                  this.$router.push({
                    name: 'cmsList',
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
    },
    // 分页事件
    handleCurrentChange(row) {
    // 当前页改变
      const postData = {
        page: row,
        pagenum: this.pageSize
      }
      // 获取标签
      this.isLoading = true
      tags.getList(postData)
        .then(res => {
          this.isLoading = false
          if (res.data.status.Code === 200) {
          // 处理数据
            this.tagsList = res.data.result.data
            this.totalNum = res.data.result.total
            this.currentPage = res.data.result.current_page
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
    // 分页end
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/common.scss";
</style>

