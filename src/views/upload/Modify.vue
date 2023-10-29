<template>
  <div class="container">
    <el-form ref="form" :model="unit" label-width="80px">
      <el-form-item
        label="中文"
        prop="chinese"
        :rules="{
          required: true, message: '中文不能为空', trigger: 'blur'
        }"
      >
        <el-input v-model="unit.chinese" />
      </el-form-item>
      <el-form-item label="释义">
        <el-input v-model="unit.description" />
      </el-form-item>
      <el-form-item label="老语">
        <el-input v-model="unit.lao" />
      </el-form-item>
      <el-form-item label="音标">
        <el-input v-model="unit.phonetic" />
      </el-form-item>
      <el-form-item label="类型">
        <el-select v-model="unit.type" placeholder="请选择类型">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="音频">
        <el-input v-model="unit.audio_address" />
      </el-form-item>
      <el-form-item>
        <el-upload
          class="upload-demo"
          action="https://studylao.ayaoblog.space/api/audio/upload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :before-remove="beforeRemove"
          :before-upload="beforeUpload"
          multiple
          accept=".wav,.mp3"
          :limit="1"
          :on-exceed="handleExceed"
          :file-list="fileList"
        >
          <el-button size="small" type="primary" @click="uploadAudio">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传wav/mp3文件</div>
        </el-upload>
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
import { updateUnitInfo } from '@/api/unit'
export default {
  name: 'Modify',
  props: {
    unit: {
      type: Object,
      default: () => {
        return {
          id: '',
          create_time: '',
          chinese: '',
          lao: '',
          audio_address: '',
          create_by: '',
          type: ''
        }
      }
    }
  },
  data() {
    return {
      form: {
        chinese: '',
        lao: '',
        audio_address: ''
      },
      fileList: [
      ],
      options: [
        {
          value: '1',
          label: '字母'
        },
        {
          value: '2',
          label: '单词'
        },
        {
          value: '3',
          label: '句子'
        }
      ],
      value: ''
    }
  },
  methods: {
    beforeUpload(file) {
      const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
      const whiteList = ['wav', 'mp3']
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error('上传文件只能是 wav/mp3 格式!')
        return false
      }
    },
    handlePreview(file) {
      console.log('handlePreview')
      console.log(file)
    },
    handleRemove(file, fileList) {
      console.log('handleRemove')
      console.log(file, fileList)
    },
    beforeRemove(file, fileList) {
      console.log('beforeRemove')
      console.log(file, fileList)
    },
    handleExceed(files, fileList) {
      console.log('handleExceed')
      console.log(files, fileList)
    },
    handleSuccess(response, file, fileList) {
      console.log('handleSuccess')
      console.log(response, file, fileList)
      if (response.code === 200) {
        this.fileList = fileList
        // 去掉第一个字符
        this.unit.audio_address = 'https://studylao.ayaoblog.space' + response.data.fileUrl.slice(1)
        console.log(this.form.audio_address)
        this.$message({
          message: '上传成功！',
          type: 'success'
        })
      }
    },
    uploadAudio() {
      // 上传音频到https://ayaoblog.space/voice
      console.log('uploadAudio')
      console.log(this.fileList)
    },
    onSubmit(formName) {
      // 验证表单
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log('submit!')
          console.log(this.unit)
          updateUnitInfo(this.unit).then(res => {
            console.log(res)
            if (res.code === 200) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
              this.$emit('onCancel')
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

  @/api/unit

