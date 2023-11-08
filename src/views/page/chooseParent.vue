<template>
  <div class="container">
    <div class="form-box">
      <el-form ref="form" :model="form" label-width="80px" style="width: 320px;">
        <el-form-item label="选择分类">
          <el-input
            v-model="currentNodeLabel"
            small="size"
            style="width: 240px;"
            :disabled="true"
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
import { updatePage } from '@/api/page'
import { getColumnArr } from '@/api/column'
export default {
  name: 'ChooseParent',
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
        data: []
      },
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentNodeKey: '',
      currentNodeLabel: ''
    }
  },
  mounted() {
    this.getColumnList()
  },
  methods: {
    getColumnList() {
      getColumnArr().then(res => {
        console.log(res)
        if (res.code === 200) {
          res.data.forEach(item => {
            item.label = item.name
          })
        }
        const arr = res.data
        // 添加children
        const result = arr.reduce(function(prev, item) {
          prev[item.pid]
            ? prev[item.pid].push(item)
            : (prev[item.pid] = [item])
          return prev
        }, {})
        for (const prop in result) {
          result[prop].forEach(function(item, i) {
            result[item.id] ? (item.children = result[item.id]) : ''
          })
        }
        const list = result['undefined']
        console.log(list)
        // 组装成树形结构
        const arrayToTree = (arr, pid) => {
          return arr.reduce((res, current) => {
            if (current['parent_id'] === pid) {
              current.children = arrayToTree(arr, current['id'])
              return res.concat(current)
            }
            return res
          }, [])
        }
        const array = arrayToTree(list, '0')
        const replace = (data) => {
          for (let i = 0; i < data.length; i++) {
            const item = data[i]
            item.label = item.name
            if (item.children) {
              replace(item.children)
            }
          }
        }
        replace(array)
        this.form.data = JSON.parse(JSON.stringify(array))
      })
    },
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
          const data = {
            id: this.page.id,
            parent_id: this.currentNodeKey
          }
          updatePage(data).then((res) => {
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
  margin-left: 40px;
  // justify-content: center;
}
.tree-box{
  height: 340px;
  //y轴设置超出显示滚动条
  overflow-y: scroll;
  overflow-x: hidden;
  //添加阴影
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
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
