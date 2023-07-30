<template>
  <div class="box">
    <div class="button-line"><el-button type="primary" @click="add">新增</el-button></div>
    <el-table :data="unitList" border style="width: 100%">
      <el-table-column fixed prop="created_time" label="创建日期" width="160" />
      <el-table-column prop="index" label="#" width="60" />
      <el-table-column prop="chinese" label="汉语" />
      <el-table-column prop="lao" label="老挝语" />
      <el-table-column prop="type" label="类型" width="50" />
      <el-table-column prop="audio_address" label="音频地址" width="300" />
      <el-table-column prop="id" label="ID" width="auto" />
      <el-table-column label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="handleClick(scope.row)"
          >复制</el-button>
          <el-button type="text" size="small" @click="edit(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="del(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
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
      <Form @onCancel="close" />
    </div>
    <div v-if="isModify" class="form">
      <Modify :unit="unit" @onCancel="closeModify" />
    </div>
  </div>
</template>

<script>
import Form from './Form.vue'
import Modify from './Modify.vue'
import { getUnitInfo, deleteUnit } from '@/api/unit'
export default {
  name: 'Upload',
  components: {
    Form, Modify
  },
  data() {
    return {
      formIsShow: false,
      isModify: false,
      dialogVisible: false,
      delId: '',
      unitList: [],
      unit: {
        id: '',
        created_time: '',
        chinese: '',
        lao: '',
        audio_address: '',
        create_by: '',
        type: ''
      }
    }
  },
  mounted() {
    this.getUnitInfo()
  },
  methods: {
    getUnitInfo() {
      getUnitInfo().then(res => {
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
        this.unitList = list
      })
    },
    formDate(dateForm) {
      if (dateForm === '') { // 解决deteForm为空传1970-01-01 00:00:00
        return ''
      } else {
        var dateee = new Date(dateForm).toJSON()
        var date = new Date(+new Date(dateee) + 8 * 3600 * 1000).toISOString().replace(/T/g, ' ').replace(/\.[\d]{3}Z/, '')
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
      this.getUnitInfo()
    },
    closeModify() {
      // 关闭表单
      this.isModify = false
      this.getUnitInfo()
    },
    handleClick(row) {
      console.log(row)
    },
    edit(row) {
      console.log(row)
      this.unit.id = row.id
      this.unit.chinese = row.chinese
      this.unit.lao = row.lao
      this.unit.audio_address = row.audio_address
      this.unit.type = row.type
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
      deleteUnit(data).then(res => {
        console.log(res)
        this.dialogVisible = false
        this.getUnitInfo()
      })
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done()
        })
        .catch(_ => {})
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
  background-color: rgba(255, 255, 255, 0.5);
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
