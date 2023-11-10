<template>
  <div class="box">
    <div class="custom-tree-container">
      <div class="block">
        <el-tree
          :data="data"
          node-key="id"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span slot-scope="{ node, data }" class="custom-tree-node">
            <span>{{ node.label }}</span>
            <span>
              <el-button
                v-if="data.is_page == 0"
                type="success"
                size="mini"
                @click="() => add(data)"
              >
                添加
              </el-button>
              <el-button
                type="primary"
                size="mini"
                icon="el-icon-top"
                @click="() => moveUp(data)"
              />
              <!-- <el-button
                type="primary"
                size="mini"
                icon="el-icon-bottom"
                @click="() => moveDown(data)"
              /> -->
              <el-button
                :type="data.is_page ===0? 'primary':'info'"
                size="mini"
                @click="() => openModify(data)"
              >
                编辑
              </el-button>
              <el-button
                :type="data.is_publish ? 'success' : 'info'"
                size="mini"
              >
                {{ data.is_publish ? "已发布" : "未发布" }}
              </el-button>
              <el-button
                type="success"
                size="mini"
                @click="() => publish(data)"
              >
                {{ data.is_publish ? "撤销" : "发布" }}
              </el-button>
              <el-button
                type="danger"
                size="mini"
                @click="() => remove(node, data)"
              >
                {{ data.is_page == 0 ? '删除' : '移除' }}
              </el-button>
            </span>
          </span>
        </el-tree>
      </div>
    </div>
    <div v-if="isCreate" class="form">
      <CreateColumn
        :column="newColumn"
        @onCancel="closeColumn"
        @onSave="append"
      />
    </div>
    <div v-if="isModify" class="form">
      <ModifyColumn :column="column" @onCancel="closeModify" @onSave="modify" />
    </div>
  </div>
</template>

<script>
import ModifyColumn from './ModifyColumn.vue'
import CreateColumn from './CreateColumn.vue'
import { getColumnList, deleteColumn, updateColumn } from '@/api/column'
let id = 1000
export default {
  name: 'Column',
  components: {
    ModifyColumn,
    CreateColumn
  },
  data() {
    return {
      data: [],
      isCreate: false,
      isModify: false,
      currentData: {},
      column: {},
      result: [],
      newColumn: {
        parent_id: '',
        sort: 0
      }
    }
  },
  mounted() {
    this.getColumnList()
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
      this.split()
    },
    delete(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
      this.split()
    },
    remove(node, data) {
      console.log('remove')
      // confirm是否删除
      this.$confirm('此操作将永久删除该栏目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          deleteColumn(data.id).then((res) => {
            if (res.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.delete(node, data)
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    add(data) {
      console.log('add')
      this.currentData = data
      // 获取当前节点children的最大sort
      let max = 0
      if (data.children) {
        const children = data.children
        for (let i = 0; i < children.length; i++) {
          const item = children[i]
          if (item.sort > max) {
            max = item.sort
          }
        }
      }
      this.newColumn.sort = max === 0 ? 0 : max + 1
      this.newColumn.parent_id = data.id
      this.isCreate = true
      this.split()
    },
    closeColumn() {
      console.log('closeColumn')
      this.isCreate = false
    },
    openModify(data) {
      if (data.is_page === 1) {
        this.$message({
          type: 'warning',
          message: '请到页面管理中修改页面信息！'
        })
        return
      }
      this.isModify = true
      this.column.id = data.id
      this.column.label = data.label
      this.column.description = data.description
      this.column.sort = data.sort
      this.column.type = data.type
      console.log(this.column)
      this.split()
    },
    closeModify() {
      this.isModify = false
    },
    modify(column) {
      this.isModify = false
      const result = this.split()
      for (let i = 0; i < result.length; i++) {
        const item = result[i]
        if (item.id === column.id) {
          item.label = column.label
          item.description = column.description
          // 修改data对应的label
        }
      }
      this.merge()
    },
    split() {
      // 把树形结构的数据转换成一维数组，添加parent_id，要求数组可以组装成树形结构
      const data = this.data
      const result = []
      const find = (data, parent_id) => {
        for (let i = 0; i < data.length; i++) {
          const item = data[i]
          const obj = {
            id: item.id,
            label: item.label,
            parent_id: parent_id,
            description: item.description,
            sort: item.sort,
            is_page: item.is_page
          }
          result.push(obj)
          if (item.children) {
            find(item.children, item.id)
          }
        }
      }
      find(data, 0)
      this.result = result
      return result
    },
    merge() {
      // 把一维数组组装成树形结构对象
      const list = this.result
      console.log(list)
      const arrayToTree = (arr, pid) => {
        return arr.reduce((res, current) => {
          if (current['parent_id'] === pid) {
            current.children = arrayToTree(arr, current['id'])
            return res.concat(current)
          }
          return res
        }, [])
      }
      console.log(arrayToTree(list, 0))
      const data = arrayToTree(list, 0)
      function sortChildrenBySort(node) {
        node.children.sort((a, b) => a.sort - b.sort)
        for (const child of node.children) {
          sortChildrenBySort(child)
        }
      }
      sortChildrenBySort(data[0])
      this.data = data
      console.log(JSON.stringify(this.data, null, 2))
    },
    getColumnList() {
      getColumnList().then((res) => {
        console.log(res)
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
        // 排序
        function sortChildrenBySort(node) {
          node.children.sort((a, b) => a.sort - b.sort)
          for (const child of node.children) {
            sortChildrenBySort(child)
          }
        }
        sortChildrenBySort(array[0])
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
        this.data = JSON.parse(JSON.stringify(array))
        console.log(this.data)
      })
    },
    moveUp(data) {
      console.log(data)
      if (data.id === 'root') {
        this.$message({
          type: 'info',
          message: '已经是第一个了！'
        })
        return
      }
      const parent_id = data.parent_id
      const oneArray = this.split()
      const parents = oneArray.filter((item) => item.id === parent_id)
      const parent = parents[0]
      const children = oneArray.filter((item) => item.parent_id === parent.id)
      const index = children.findIndex((d) => d.id === data.id)
      if (index === 0) {
        this.$message({
          type: 'info',
          message: '已经是第一个了！'
        })
        return
      }
      children[index - 1].sort = children[index - 1].sort + 1
      children[index].sort = children[index].sort - 1
      console.log(children[index].sort)
      this.merge()
      const column_one = {
        id: children[index].id,
        sort: children[index].sort
      }
      const column_two = {
        id: children[index - 1].id,
        sort: children[index - 1].sort
      }
      updateColumn(column_one)
      updateColumn(column_two)
    },
    publish(data) {
      const id = data.id
      const is_publish = data.is_publish
      updateColumn({ id: id, is_publish: !is_publish }).then((res) => {
        if (res.code === 200) {
          this.$message({
            message: '操作成功',
            type: 'success'
          })
          this.getColumnList()
        }
      })
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
