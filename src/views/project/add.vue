<template>
  <div class="app-container">
    <div class="x-form">
        <el-form 
        width=100%
        v-loading = "isLoading"
        element-loading-spinner="el-icon-loading" 
        :model="addForm" 
        :rules="rules" 
        ref="addForm" label-width="100px" 
        class="demo-addForm">
            <el-form-item label="项目名称" prop="project_name">
                <el-input v-model="addForm.project_name" placeholder="请输入项目名称"></el-input>
            </el-form-item>
            <el-form-item label="项目简介" prop="des">
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
            <!-- <el-form-item label="分类" prop="type">
                <el-select v-model="addForm.type" placeholder="请选择">
                  <el-option v-for="(item, index) in cateList" :label="item.category_name" :value="item.id" :key="index"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="项目网址" prop="web">
                <el-input v-model="addForm.web" placeholder="请输入项目网址"></el-input>
            </el-form-item>
            <el-form-item label="地区" prop="area_id">
                <el-select v-model="addForm.area_id" placeholder="请选择地区">
                    <el-option label="地区1" :value="1"></el-option>
                    <el-option label="地区2" :value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="团队" prop="team_id">
                <el-select v-model="addForm.team_id" placeholder="请选择团队">
                    <el-option label="team-1" :value="1"></el-option>
                    <el-option label="team-2" :value="2"></el-option>
                </el-select>
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
import { saveProject, getProject, updateProject } from '@/api/project'
const tags = require('@/api/tags')
const category = require('@/api/category')

export default {
  name: 'addProject',
  data() {
    return {
      tagsList: [],
      cateList: [],
      addForm: {
        tag: []
      },
      submitbtnStatus: true, // 区分新增和 更新操作
      isLoading: false,
      // 表单验证规则
      rules: {
        project_name: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        des: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        tag: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        type: [
          { required: true, message: '必填项', trigger: 'change' }
        ],
        web: [
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
      console.log(rowData)
      // 查询指定项目
      getProject(rowData)
        .then(res => {
          if (res.data.status.Code === 200) {
            res.data.result[0].tag = res.data.result[0].tag.split(',')
            // 处理数据
            const obj = {}
            for (const i in res.data.result[0]) {
              if (i !== 'id') {
                obj[i] = res.data.result[0][i]
              }
            }
            this.addForm = obj
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
            updateProject(this.$route.query.id, postData)
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
                    name: 'projectList',
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
          } else {
            saveProject(this.addForm)
              .then(res => {
                if (res.data.status.Code === 200) {
                  // 处理数据
                  this.$message({
                    message: res.data.status.Msg,
                    type: 'success',
                    duration: 5 * 1000
                  })
                  // 重置表单
                  this.resetForm('addForm')
                  // 跳转
                  this.$router.push({
                    name: 'projectList',
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

