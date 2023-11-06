<template>
  <div class="container">
    <el-form ref="form" :model="form" label-width="80px">
      <el-form-item
        label="名称"
        prop="name"
        :rules="{
          required: true,
          message: '名称不能为空',
          trigger: 'blur',
        }"
      >
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="简介">
        <el-input v-model="form.description" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="type" placeholder="请选择类型">
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
import { updatePage } from '@/api/page'
export default {
  name: 'ModifyPage',
  props: {
    page: {
      type: Object,
      default: () => {
        return {
          id: '',
          name: '',
          type: '',
          description: ''
        }
      }
    }
  },
  data() {
    return {
      form: {
        id: this.page.id,
        name: this.page.name,
        type: '',
        description: this.page.description
      },
      fileList: [],
      options: [
        {
          value: '0',
          label: '动态页面'
        },
        {
          value: '1',
          label: '静态页面'
        }
      ],
      type: this.page.type
    }
  },
  methods: {
    onSubmit(formName) {
      // 验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (this.type === '动态页面' || this.type === '0') {
            this.form.type = '0'
          } else if (this.type === '静态页面' || this.type === '1') {
            this.form.type = '1'
          }
          const data = this.form
          updatePage(data).then((res) => {
            console.log(res)
            if (res.code === 200) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
              this.$emit('onSave')
            }
          })
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
