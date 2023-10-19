<template>
  <div class="box">
    <div class="button-line">
      <el-button type="primary" @click="add">新增</el-button>
    </div>
    <el-table :data="unitList" border style="width: 100%">
      <el-table-column fixed prop="created_time" label="创建日期" width="160" />
      <el-table-column prop="index" label="#" width="60" />
      <el-table-column prop="chinese" label="汉语" />
      <el-table-column prop="description" label="释义" />
      <el-table-column prop="lao" label="老挝语" />
      <el-table-column prop="phonetic" label="音标" />
      <el-table-column prop="type" label="类型" width="50" />
      <el-table-column prop="audio_address" label="音频地址" width="300" />
      <el-table-column label="操作" width="70">
        <template slot-scope="scope">
          <AudioPlayer :src="scope.row.audio_address" />
          <!-- <div class="control">
            <audio :ref="scope.row.id" :src="scope.row.audio_address" />
            <div class="circal-box" @click="play(scope.row.id)">
              <div class="circal button-play cursor-pointer" @click="play">
                <div :class="isPlay ? 'play' : 'pause'">
                  <div class="vertical-left" />
                  <div class="vertical-right" />
                </div>
              </div>
            </div>
          </div> -->
        </template>
      </el-table-column>
      <!-- <el-table-column prop="id" label="ID" width="auto" /> -->
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
import AudioPlayer from './AudioPlayer.vue'
import { getUnitList, deleteUnit } from '@/api/unit'
export default {
  name: 'Upload',
  components: {
    Form,
    Modify,
    AudioPlayer
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
        type: '',
        description: '',
        phonetic: ''
      },
      isPlay: false
    }
  },
  mounted() {
    this.getUnitList()
  },
  methods: {
    getUnitList() {
      getUnitList().then((res) => {
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
      this.getUnitList()
    },
    closeModify() {
      // 关闭表单
      this.isModify = false
      this.getUnitList()
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
      deleteUnit(data).then((res) => {
        console.log(res)
        this.dialogVisible = false
        this.getUnitList()
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
