<template>
  <div class="box">
    <div class="main-content">
      <div class="button-line">
        <div class="add" style="display: flex;height: 28px"><el-button type="success" size="mini" @click="add">新增</el-button></div>
        <el-form :inline="true" :model="queryDate" size="mini" class="query-form-inline">
          <el-form-item label="汉语">
            <el-input v-model="queryDate.chinese" placeholder="模糊查询" clearable />
          </el-form-item>
          <el-form-item label="类型">
            <el-select v-model="queryDate.type" placeholder="选择类型" clearable>
              <el-option label="字母" value="1" />
              <el-option label="单词" value="2" />
              <el-option label="句子" value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="音频">
            <el-select v-model="queryDate.audioIsUpload" placeholder="选择状态" clearable>
              <el-option label="未上传" value="0" />
              <el-option label="已上传" value="1" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
            <el-button type="info" @click="onResert">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div class="table-box">
        <el-table :data="pageList" border style="width: 100%" height="100%" :row-style="rowstyle">
          <el-table-column fixed prop="created_time" label="创建日期" width="160" />
          <el-table-column prop="index" label="#" width="60" />
          <el-table-column prop="name" label="名称" :show-overflow-tooltip="true" width="160" />
          <el-table-column prop="description" label="简介" :show-overflow-tooltip="true" />
          <el-table-column prop="type" label="类型" :show-overflow-tooltip="true" width="80" />
          <el-table-column prop="parent_name" label="父分类" width="100" />
          <el-table-column label="状态" width="70">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="copy(scope.row.id)"
              >{{ scope.row.is_publish?'已发布':'未发布' }}</el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column prop="id" label="ID" width="auto" /> -->
          <el-table-column label="操作" width="140">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="ChoosePage(scope.row.id)"
              >挂载</el-button>
              <el-button
                type="text"
                size="small"
                @click="edit(scope.row)"
              >编辑</el-button>
              <el-button
                type="text"
                size="small"
                @click="jump(scope.row.id)"
              >内容</el-button>
              <el-button
                type="text"
                size="small"
                @click="del(scope.row.id)"
              >删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-dialog
        title="提示"
        :visible.sync="dialogVisible"
        width="30%"
        :before-close="handleClose"
      >
        <span>确定要删除这条信息吗？</span>
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="delUnit()">确 定</el-button>
        </span>
      </el-dialog>
      <div v-if="formIsShow" class="form">
        <CreatePage @onCancel="close" @onSuccess="createPageSuccess" />
      </div>
      <div v-if="isModify" class="form">
        <ModifyPage :page="page" @onCancel="closeModify" @onSave="onUpdate" />
      </div>
      <div v-if="openChoosePage" class="form">
        <ChooseParent :page="page" @onCancel="closeChoosePage" @onSuccess="choosePageSuccess" />
      </div>
      <div class="pagination">
        <div class="block">
          <el-pagination
            background
            :current-page.sync="currentPage"
            :page-size="100"
            layout="total, prev, pager, next"
            :total="total"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ModifyPage from './modifyPage.vue'
import CreatePage from './createPage.vue'
import ChooseParent from './chooseParent.vue'
import { getPageList, deletePage } from '@/api/page'
export default {
  name: 'Page',
  components: {
    ModifyPage,
    CreatePage,
    ChooseParent
  },
  data() {
    return {
      formIsShow: false,
      isModify: false,
      openChoosePage: false,
      dialogVisible: false,
      delId: '',
      pageList: [],
      page: {
        id: '',
        name: '',
        type: '',
        description: ''
      },
      isPlay: false,
      currentPage: 1,
      total: 100,
      queryDate: {
        chinese: '',
        type: '',
        audioIsUpload: ''
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    jump(id) {
      console.log(this.$router)
      this.$router.push({
        path: `/edit/edit`,
        query: {
          id: id
        }
      })
    },
    ChoosePage(id) {
      this.page.id = id
      this.openChoosePage = true
    },
    closeChoosePage() {
      console.log('closeChoosePage')
      this.openChoosePage = false
    },
    choosePageSuccess() {
      this.getPageList()
      this.openChoosePage = false
    },
    // 使用queryDate作为查询条件
    onSubmit() {
      this.getPageList()
    },
    onResert() {
      this.queryDate = {
        chinese: '',
        type: '',
        audioIsUpload: ''
      }
    },
    rowstyle({ row, rowIndex }) {
      return 'height: 50px'
    },
    handleCurrentChange() {
      console.log('handleCurrentChange')
      this.getPageList()
    },
    getPageList() {
      const data = {
        page: this.currentPage,
        page_size: 100,
        chinese: this.queryDate.chinese,
        type: this.queryDate.type,
        audioIsUpload: this.queryDate.audioIsUpload
      }
      getPageList(data).then((res) => {
        const list = res.data
        const length = list.length
        for (let i = 0; i < length; i++) {
          const element = list[i]
          // element.created_time = element.created_time.replace(/T/g, ' ').replace(/.[\d]{3}Z/, ' ')
          element.created_time = this.formDate(element.created_time)
          if (element.type === 0) {
            element.type = '动态页面'
          } else if (element.type === 1) {
            element.type = '静态页面'
          }
          element.index = res.total - (this.currentPage * 100 - 100) - i
        }
        this.pageList = list
        // 转为数字
        this.total = Number(res.total)
      })
    },
    formDate(dateForm) {
      if (dateForm === '') {
        // 解决deteForm为空传1970-01-01 00:00:00
        return ''
      } else {
        var dateee = new Date(dateForm).toJSON()
        var date = new Date(+new Date(dateee) + 8 * 3600 * 1000)
          .toISOString()
          .replace(/T/g, ' ')
          .replace(/\.[\d]{3}Z/, '')
        return date
      }
    },
    add() {
      // 打开表单
      this.formIsShow = true
    },
    close() {
      // 关闭表单
      this.formIsShow = false
    },
    createPageSuccess() {
      this.formIsShow = false
      this.getPageList()
    },

    closeModify() {
      // 关闭表单
      this.isModify = false
    },
    onUpdate() {
      this.isModify = false
      this.getPageList()
    },
    handleClick(row) {
      console.log(row)
    },
    edit(row) {
      console.log(row)
      this.page.id = row.id
      this.page.name = row.name
      this.page.description = row.description
      this.page.type = row.type
      this.isModify = true
    },
    del(id) {
      console.log('del')
      this.delId = id
      this.dialogVisible = true
    },
    delUnit() {
      const data = {
        id: this.delId
      }
      deletePage(data).then((res) => {
        console.log(res)
        this.dialogVisible = false
        this.getPageList()
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then((_) => {
          done()
        })
        .catch((_) => {})
    },
    copy(text) {
      if (navigator.clipboard) {
        // clipboard api 复制
        navigator.clipboard.writeText(text)
        this.$message.success('复制成功')
      } else {
        return
      }
    }
  }
}
</script>

<style lang="scss" scoped>
//去掉播放按钮的表格的边框限制
::v-deep .el-table_1_column_9  {
   .cell {
  overflow: visible;
}
}
::v-deep .button-line .el-input__inner {
  width: 120px;
}
.box {
  width: 100%;
  height: 100%;
  padding: 10px;
}
.main-content {
  width: 100%;
  height: 100%;
  padding: 10px;
  border: 1px solid #dfe6ec;
  //设置阴影
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.button-line {
  margin-bottom: 10px;
  display: flex;
  height: 28px;
  .query-form-inline {
    margin-left: 10px;
  }
}
.form {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(136, 135, 135, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
.table-box {
  height: calc(100% - 85px);
  overflow: auto;
}
.pagination {
  //设置边框线
  border-left: 1px solid #dfe6ec;
  border-bottom: 1px solid #dfe6ec;
  border-right: 1px solid #dfe6ec;
  padding: 5px;
  padding-left: 20px;
}
</style>
