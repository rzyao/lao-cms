<template>
  <div class="box">
    <div class="custom-tree-container">
      <div class="block">
        <el-tree
          :data="data"
          show-checkbox
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                type="success"
                size="mini"
                @click="() => add(data)"
              >
                添加
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="() => openModify(data)"
              >
                编辑
              </el-button>
              <el-button
                type="success"
                size="mini"
                @click="() => append(data)"
              >
                发布
              </el-button>
              <el-button
                type="danger"
                size="mini"
                @click="() => remove(node, data)"
              >
                删除
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <div v-if="isCreate" class="form">
      <CreateColumn @onCancel="closeColumn" @onSave="append" />
    </div>
    <div v-if="isModify" class="form">
      <ModifyColumn :column="column" @onCancel="closeModify" @onSave="modify" />
    </div>
  </div>
</template>

<script>
import ModifyColumn from './ModifyColumn.vue'
import CreateColumn from './CreateColumn.vue'
let id = 1000
export default {
  name: 'Column',
  components: {
    ModifyColumn,
    CreateColumn
  },
  data() {
    const data = [
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
            label: '二级 3-2'
          }
        ]
      }
    ]
    return {
      data: JSON.parse(JSON.stringify(data)),
      isCreate: false,
      isModify: false,
      currentData: {},
      column: {}
    }
  },

  methods: {
    append(children) {
      const data = this.currentData
      this.isCreate = false
      const newChild = { id: id++, label: children.name, children: [] }
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },
    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
    },
    add(data) {
      this.currentData = data
      this.isCreate = true
    },
    closeColumn() {
      console.log('closeColumn')
      this.isCreate = false
    },
    openModify(data) {
      this.isModify = true
      this.column.id = data.id
      this.column.label = data.label
      console.log(this.column)
    },
    closeModify() {
      this.isModify = false
    },
    modify(column) {
      this.isModify = false
      this.find(column)
    },
    find(column) {
      const id = column.id
      const data = this.data
      for (let i = 0; i < data.length; i++) {
        const item = data[i]
        if (item.id === id) {
          this.data[i].label = column.label
          break
        } else {
          if (item.children) {
            this.find(item.children)
          }
        }
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
.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 16px;
  padding-right: 8px;
}
::v-deep .el-tree-node__content {
  height: 36px;
  // 设置border-bottom为虚线
  border-bottom: 1px dashed rgba($color: #1473c0, $alpha: 0.2);
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
</style>
