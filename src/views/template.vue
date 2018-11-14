<template>
  <div class="app-container">
    <div class = "operate-wrapper">
      <div class="item">
        <div class="label">会员名称:</div>
        <el-input clearable placeholder="请输入" v-model="searchData.name"></el-input>
      </div>
      <div class="item">
        <div class="label">会员等级:</div>
        <el-select clearable placeholder="请选择" v-model="searchData.lev">
            <el-option label="等级1" value="1"></el-option>
            <el-option label="等级2" value="2"></el-option>
        </el-select>
      </div>

      <div class="item">
        <div class="label">会员渠道:</div>
        <el-select clearable placeholder="请选择" v-model="searchData.from">
            <el-option label="渠道1" value="1"></el-option>
            <el-option label="渠道2" value="2"></el-option>
        </el-select>
      </div>

      <div class="item">
        <div class="label">会员电话:</div>
        <el-input clearable placeholder="请输入" v-model="searchData.mob"></el-input>
      </div>
      <div class="item">
        <div class="label">会员积分:</div>
        <el-input clearable placeholder="请输入" v-model="searchData.integral"></el-input>
      </div>
      <div class="item">
        <div class="label">会员入会时间:</div>
        <el-date-picker v-model="searchData.registerDate" type="daterange" format="yyyy-MM-dd" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"> </el-date-picker>
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
            <el-button size="mini" type="success">批量导出</el-button>
            <el-button size="mini" type="success">批量删除</el-button>
        </div>
        <el-table ref="multipleTable" stripe border :data="tableData" tooltip-effect="dark" style="width: 100%" :header-cell-style="{background: '#f4f4f4',color: 'black'}" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column label="会员名称" width="120" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span @click="handleDetail(scope.row, 'detail')" class="linkTxt">{{ scope.row.name }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="电话" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column prop="address" label="性别" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="date" label="出生日期" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address" label="家庭住址" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address" label="会员等级" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address" label="当前积分" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address" label="入会时间" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="address" label="会员渠道" show-overflow-tooltip>
            </el-table-column>
            <el-table-column label="操作" width="200">
                <template slot-scope="scope">
                    <el-button @click="handleDetail(scope.row, 'edit')" size="mini" type="success">编辑</el-button>
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
export default {
  name: 'vipList',
  data() {
    return {
      isLoading: true,
      // 搜索条件
      searchData: {
        name: '',
        lev: '',
        from: '',
        mob: '',
        registerDate: '',
        integral: '',
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
      ],
    }
  },
  created() {
    this.totalNum = 100
  },
  components: {

  },
  methods: {
    /**
     * 查看详情
     * row 所选对象参数， type 预览/编辑
     */
    handleDetail(row, type){
      const urlname = type === 'edit' ? 'vipEdit' : 'vipDetail'
      this.$router.push({
        name: urlname,
        query: {
          id: row.id
        }
      })
      // console.log(row)
    },
    // checkbox 函数
    // 全选
    toggleSelection(rows) {
    if (rows) {
      rows.forEach(row => {
        this.$refs.multipleTable.toggleRowSelection(row);
      });
    } else {
      this.$refs.multipleTable.clearSelection();
    }
    },
    // change
    handleSelectionChange(val) {
      this.multipleSelection = val;
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
