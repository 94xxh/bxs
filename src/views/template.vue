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
    <!-- 内容 -->
    <div class="contain-wrap">
        <div class="contain-operate">
          <router-link to="">
            <el-button size="mini" type="success">新增</el-button>
          </router-link>
        </div>
        <el-table ref="multipleTable" stripe border :data="tableData" tooltip-effect="dark" style="width: 100%" :header-cell-style="{background: '#f4f4f4',color: 'black'}" @selection-change="handleSelectionChange">
            <el-table-column prop="id" label="ID" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="figure_name" label="人物名" show-overflow-tooltip></el-table-column>
            <el-table-column prop="des" label="描述" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="jobs" label="职业" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="tag" label="标签" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="keyword" label="关键词" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="create_datetime" label="创建时间" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click="handleDetail(scope.row, 'edit')" size="mini" type="success">编辑</el-button>
                    <el-button @click="handleDel(scope.row)" size="mini" type="danger">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页 -->
        <div class="x-pagination">
            <el-pagination
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
import { getList } from '@/api/company'
export default {
  name: 'vipList',
  data() {
    return {
      isLoading: true,
      // 搜索条件
      searchData: {
        page: 1,
        pagenum: 10
      },
      //  分页参数
      pageSizes: [10, 20, 30, 40],
      pageSize: 10,
      currentPage: 1,
      totalNum: 0,
      //   end
      tableData: [
        {
          id: 1,
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: 2,
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          id: 3,
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ]
    }
  },
  created() {
    this.totalNum = 100
  },
  components: {

  },
  methods: {
    // 获取列表
    getList(param) {
      const postData = param || this.searchData
      this.listLoading = true
      getList(postData)
        .then(res => {
          if (res.data.status.Code === 200) {
            // 处理数据
            this.listLoading = false
            this.tableData = res.data.result.data
            console.log(res.data.result.data)
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
    /**
     * 查看详情
     * row 所选对象参数， type 预览/编辑
     */
    handleDetail(row, type) {
      const urlname = type === 'edit' ? 'vipEdit' : 'vipDetail'
      this.$router.push({
        name: urlname,
        query: {
          id: row.id
        }
      })
      // console.log(row)
    },
    // 删除
    handleDel(row) {
      this.$confirm('此操作不可逆，确定删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const postData = {
          id: row.id
        }
        this.isLoading = true
        handleDel(postData)
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
    // checkbox 函数
    // 全选
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    // change
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    // end
    // 分页事件
    handleSizeChange(row) {
    // 每页显示数改变
      this.searchData.pagenum = row
    //   this.getList(this.searchData)
    },
    handleCurrentChange(row) {
    // 当前页改变
      this.searchData.page = row
    //   this.getList(this.searchData)
    }
    // 分页end
  }
}
</script>

<style lang="scss">
@import "src/styles/common.scss";
</style>
<style scoped lang="scss">
.app-container{

}
</style>
