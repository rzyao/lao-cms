<template>
  <div class="container">
    <div class="form-box">
      <el-form ref="form" :model="form" label-width="80px" style="width: 320px;">
        <el-form-item label="选择分类">
          <el-input
            v-model="currentNodeLabel"
            small="size"
            style="width: 240px;"
          />
          <div class="tree-box">
            <el-tree
              ref="tree"
              :data="form.data"
              :props="defaultProps"
              :highlight-current="true"
              :default-expand-all="true"
              :expand-on-click-node="false"
              :check-on-click-node="true"
              :check-strictly="true"
              :show-checkbox="true"
              node-key="id"
              style="width: 240px;"
              @check="handleBoxClick"
            />
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="button-line">
      <div class="button-box">
        <el-button type="warning" @click="cancel">取消</el-button>
        <el-button type="primary" @click="onSubmit('form')">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { createPage } from '@/api/page'
export default {
  name: 'ChooseParent',

  data() {
    return {
      form: {
        data: [
          {
            id: 1,
            label: '一级 1',
            children: [
              {
                id: 4,
                label: '二级 1-1',
                children: [
                  {
                    id: 9,
                    label: '三级 1-1-1'
                  },
                  {
                    id: 10,
                    label: '三级 1-1-2'
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            label: '一级 2',
            children: [
              {
                id: 5,
                label: '二级 2-1'
              },
              {
                id: 6,
                label: '二级 2-2'
              }
            ]
          },
          {
            id: 3,
            label: '一级 3',
            children: [
              {
                id: 7,
                label: '二级 3-1'
              },
              {
                id: 8,
                label: '二级 3-2',
                children: [
                  {
                    id: 11,
                    label: '三级 3-2-1'
                  },
                  {
                    id: 12,
                    label: '三级 3-2-2'
                  },
                  {
                    id: 13,
                    label: '三级 3-2-3'
                  },
                  {
                    id: 14,
                    label: '三级 3-2-1'
                  },
                  {
                    id: 15,
                    label: '三级 3-2-2'
                  },
                  {
                    id: 16,
                    label: '三级 3-2-3'
                  }
                ]
              }
            ]
          }
        ]
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentNodeKey: '',
      currentNodeLabel: ''
    }
  },
  methods: {
    handleBoxClick(a, b, c, d) {
      console.log('handleBoxClick')
      if (a.id !== this.currentNodeKey) {
        this.currentNodeKey = a.id
        this.currentNodeLabel = a.label
      } else {
        this.currentNodeKey = ''
        this.currentNodeLabel = ''
      }
      const currentNodeKey = this.currentNodeKey
      // 重置所有节点的选中状态
      this.$refs.tree.setCheckedKeys([])
      // 设置当前节点为选中状态
      this.$refs.tree.setCheckedKeys([currentNodeKey])
    },
    onSubmit(formName) {
      // 验证表单
      this.$refs[formName].validate((valid) => {
        if (valid) {
          console.log('submit!')
          this.form.type = this.type
          console.log(this.form)
          createPage(this.form).then((res) => {
            console.log(res)
            if (res.code === 200) {
              this.$message({
                message: '保存成功！',
                type: 'success'
              })
              this.$emit('onSuccess')
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
.form-box {
  display: flex;
  align-items: center;
  justify-content: center;
}
.tree-box{
  height: 340px;
  //y轴设置超出显示滚动条
  overflow-y: scroll;
  overflow-x: hidden;
}
  //修改滚动条样式
  .tree-box::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  .tree-box::-webkit-scrollbar-track {
    background-color: #fff;
  }
  .tree-box::-webkit-scrollbar-thumb {
    background-color: #ccc;
    border-radius: 8px;
  }
  .tree-box::-webkit-scrollbar-thumb:hover {
    background-color: #999;
    //设置鼠标悬停时的箭头样式
    cursor: pointer;
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
