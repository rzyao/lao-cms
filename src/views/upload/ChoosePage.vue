<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="选择页面">
        <el-select v-model="form.pageList" multiple collapse-tags placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <div class="button-line">
          <div class="button-box">
            <el-button type="warning" @click="cancel">取消</el-button>
            <el-button type="primary" @click="onSubmit('form')">保存</el-button>
          </div>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getPagesAndItems, resertUnitAndPageRelationship } from '@/api/page'
export default {
  name: 'ChoosePage',
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      form: {
        // 已经选择的页面
        pageList: []
      },
      // 页面选项
      options: []
    }
  },
  mounted() {
    this.getItemList()
  },
  methods: {
    getItemList() {
      const id = this.id
      console.log(this.id)
      getPagesAndItems(id).then(res => {
        console.log(res)
        if (res.code === 200) {
          const options = []
          res.data.optional.forEach(item => {
            const obj = {}
            obj.value = item.id
            obj.label = item.name
            options.push(obj)
          })
          this.options = options
          console.log(this.options)
          this.form.pageList = res.data.selected.map(item => item.page_id)
          console.log(this.form.pageList)
        }
      })
    },
    onSubmit(formName) {
      // 验证表单
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.id)
          const data = {
            unit_id: this.id,
            pageItems: this.form.pageList
          }
          resertUnitAndPageRelationship(data).then(res => {
            console.log(res)
            if (res.code === 200) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
              this.$emit('onSuccess')
            }
          }
          )
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    cancel() {
      console.log('cancel')
      this.$emit('onCancel')
    }
  }
}
</script>

    <style lang="scss" scoped>
    .container {
      width: 500px;
      height: 600px;
      margin: 0 auto;
      background-color: #fff;
      border: 1px solid #ccc;
      border-radius: 5px;
      padding-right: 20px;
      padding-top: 30px;
    }
    .button-line {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-top: 20px;
    }
    .button-box {
      width: 80%;
      display: flex;
      justify-content: space-around;
      margin-top: 40px;
    }
    .documentation-container {
      margin: 50px;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;

      .document-btn {
        flex-shrink: 0;
        display: block;
        cursor: pointer;
        background: black;
        color: white;
        height: 60px;
        padding: 0 16px;
        margin: 16px;
        line-height: 60px;
        font-size: 20px;
        text-align: center;
      }
    }
    </style>

