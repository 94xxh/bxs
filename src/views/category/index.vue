<template>
  <div class="app-container">
    <div class = "operate-wrapper">
      <div class="item">
        <div class="label">关键词:</div>
        <el-input clearable placeholder="请输入" v-model="searchData.name"></el-input>
      </div>
      <!-- 按钮区域 -->
      <div class="item">
        <router-link  to="">
            <a class="addNew">
            <el-button type="primary">
                搜索
            </el-button>
            </a>
        </router-link>   
        <el-button type="warning">
            清除
        </el-button>
      </div>
    </div>

    <div class="contain-wrap">
      <div class="contain-operate">
        <router-link  to="add" style="margin-right:30px">
          <el-button size="mini" type="success">新增</el-button>
        </router-link>
      </div>
      <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row>
        <el-table-column prop="id" align="center" label='ID' width="80">
        </el-table-column>
        <el-table-column prop="category_name" label="分类名称">
        </el-table-column>
        <el-table-column prop="type" label="类型">
        </el-table-column>        
        <el-table-column prop="pid" label="父级id">
        </el-table-column>
        <el-table-column prop="status" label="状态" align="center">
        </el-table-column>
        <el-table-column prop="des" label="摘要">
        </el-table-column>
        <el-table-column label="操作" width="150">
            <template slot-scope="scope">
                <el-button size="mini" @click.stop="handleEdit(scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click.stop="handleDel(scope.row)">删除</el-button>
            </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="x-pagination">
          <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="pageSizes"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalNum">
          </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { getList, handleDel } from '@/api/category'

export default {
  name: 'categoryList',
  data() {
    return {
      list: [],
      listLoading: true,
      // 搜索条件
      searchData: {
        page: 1,
        pagenum: 10
      },
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 0
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList(param) {
      const postData = param || this.searchData
      this.listLoading = true
      getList(postData)
        .then(res => {
          if (res.data.status.Code === 200) {
            // 处理数据
            this.listLoading = false
            console.log(res.data)
            this.list = res.data.result.data
            this.totalNum = res.data.result.total
            this.currentPage = res.data.result.current_page
          } else {
            this.listLoading = false
            this.$message({
              message: res.data.status.Msg,
              type: 'error',
              duration: 5 * 1000
            })
          }
        })
        .catch(err => {
          this.listLoading = false
          console.log(err)
          this.$message({
            message: '读取接口失败！',
            type: 'error',
            duration: 5 * 1000
          })
        })
    },
    // 编辑
    handleEdit(row) {
      this.$router.push({
        name: 'editCategory',
        query: {
          id: row.id
        }
      })
    },
    // 删除
    handleDel(row) {
      this.$confirm('此操作不可逆，确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.isLoading = true
        handleDel(row.id)
          .then(res => {
            this.isLoading = false
            if (res.data.status.Code === 200) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 5 * 1000
              })
              // 重载
              this.getList(this.searchData)
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
            this.$message({
              message: '请求接口失败！',
              type: 'error',
              duration: 5 * 1000
            })
            console.log(err)
          })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消删除'
        })
      })
    },
    // 搜索
    search() {
      this.searchData.page = 1
      this.getList(this.searchData)
    },
    // 置空搜索
    resetSearch() {
      this.searchData = {
        name: ''
      }
    },
    // 分页事件
    handleSizeChange(row) {
    // 每页显示数改变
      this.searchData.pagenum = row
      this.getList(this.searchData)
    },
    handleCurrentChange(row) {
    // 当前页改变
      this.searchData.page = row
      this.getList(this.searchData)
    }
    // 分页end
  }
}
</script>
<style lang="scss" scoped>
@import "src/styles/common.scss";
</style>

