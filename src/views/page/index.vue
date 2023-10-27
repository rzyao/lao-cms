<template>
  <div class="box">
    <div class="button-line">
      <el-button type="primary" @click="add">新增</el-button>
    </div>
    <el-table :data="PageList" border style="width: 100%">
      <el-table-column fixed prop="created_time" label="创建日期" width="160" />
      <el-table-column prop="index" label="#" width="60" />
      <el-table-column prop="title" label="页面标题" />
      <el-table-column prop="description" label="简介" width="300" />
      <el-table-column prop="parent_id" label="父节点" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="is_publish" label="发布" />
      <el-table-column prop="type" label="类型" width="50" />
      <el-table-column label="操作" width="140">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="copy(scope.row.id)"
          >复制ID</el-button>
          <el-button
            type="text"
            size="small"
            @click="edit(scope.row)"
          >编辑</el-button>
          <el-button
            type="text"
            size="small"
            @click="copy(scope.row.id)"
          >发布/撤销</el-button>
          <el-button
            type="text"
            size="small"
            @click="del(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <span>确定要删除这个页面吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delPage()">确 定</el-button>
      </span>
    </el-dialog>
    <div v-if="formIsShow" class="form">
      <CreatePage @onCancel="close" />
    </div>
    <div v-if="isModify" class="form">
      <Modify :page="Page" @onCancel="closeModify" />
    </div>
  </div>
</template>

<script>
import { getPageList, deletePage } from '@/api/page'
import CreatePage from './createPage.vue'
export default {
  name: 'Page',
  components: {
    CreatePage
  },
  data() {
    return {
      PageList: [],
      dialogVisible: false,
      formIsShow: false,
      isModify: false,
      page: {
        id: '',
        title: '',
        parent_id: 0,
        sort: 0,
        is_publish: 0,
        is_delete: 0,
        type: 0,
        description: '',
        is_page: 1
      }
    }
  },
  mounted() {
    this.getPageList()
  },
  methods: {
    getPageList() {
      getPageList().then((res) => {
        const list = res.data
        const length = list.length
        for (let i = 0; i < length; i++) {
          const element = list[i]
          // element.created_time = element.created_time.replace(/T/g, ' ').replace(/.[\d]{3}Z/, ' ')
          element.created_time = this.formDate(element.created_time)
          element.index = length - 1 - i
          if (element.type === '1') {
            element.type = '字母'
          } else if (element.type === '2') {
            element.type = '单词'
          } else if (element.type === '3') {
            element.type = '句子'
          } else {
            element.type = ''
          }
        }
        this.PageList = list
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
      this.getPageList()
    },
    closeModify() {
      // 关闭表单
      this.isModify = false
      this.getPageList()
    },
    handleClick(row) {
      console.log(row)
    },
    edit(row) {
      console.log(row)
      this.Page.id = row.id
      this.Page.chinese = row.chinese
      this.Page.lao = row.lao
      this.Page.audio_address = row.audio_address
      this.Page.type = row.type
      this.isModify = true
    },
    del(id) {
      console.log('del')
      this.delId = id
      this.dialogVisible = true
    },
    delPage() {
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
.box {
  width: 100%;
  height: 100%;
  padding: 20px;
}
.button-line {
  margin-bottom: 10px;
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
.control {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  .circal-box {
    width: 50px;
    height: 50px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .circal {
    margin-top: 5px;
    width: 40px;
    height: 40px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: #f1f1f1;
    border-radius: 50%;

    .pause {
      display: inline-flex;
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 14px solid #40b5e4;
      margin-left: 5px;
    }

    .play {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 5px;

      .vertical-left {
        width: 4px;
        height: 16px;
        margin-right: 2px;
        margin-top: 5px;
        background-color: #000000;
      }

      .vertical-right {
        width: 4px;
        height: 16px;
        margin-left: 2px;
        margin-top: 5px;
        background-color: #000000;
      }
    }
  }

  .circal:hover {
    border-radius: 50%;
    background-color: #e5e5e5;
  }
}
</style>

