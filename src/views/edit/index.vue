<template>
  <div class="box">
    <div class="container">
      <div class="preview">
        <div class="unit-box">
          <div v-for="item in pageItems" :key="item.unit_id" class="unit">
            <div class="letter">
              <div class="chinese">{{ item.chinese }}</div>
              <div class="inline">
                <div class="lao">{{ item.lao }}</div>
                <AudioPlayer :src="item.audio_address" />
              </div>
              <div class="description">{{ item.description }}</div>
            </div>
            <div class="edit-button">
              <div class="box">
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-delete"
                  style="margin-bottom: 1px"
                  circle
                  @click="remove(item.unit_id)"
                />
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-arrow-up"
                  style="margin-left: 1px; margin-bottom: 1px"
                  circle
                  @click="moveUp(item.unit_id)"
                />
                <el-button
                  size="mini"
                  type="info"
                  icon="el-icon-arrow-down"
                  style="margin-left: 1px"
                  circle
                  @click="moveDown(item.unit_id)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="edit">
        <div class="button-line">
          <div style="width: 219px; margin-left: 10px">
            <div class="down-select">
              <el-select
                v-model="value"
                multiple
                collapse-tags
                style="margin-left: 20px"
                placeholder="请输入搜索内容"
                :filterable="true"
                :remote="true"
                :remote-method="querySearch"
                clearable
                size="small"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </div>
          </div>
          <el-button
            type="primary"
            size="small"
            style="margin-left: 30px"
            @click="addArray"
          >添加</el-button>
        </div>
        <div class="button-line">
          <el-input
            v-model="addId"
            size="small"
            placeholder="请输入ID"
            style="width: 199px; margin-left: 30px"
          />
          <el-button
            type="primary"
            size="small"
            style="margin-left: 30px"
            @click="addSimple"
          >添加</el-button>
        </div>
        <div class="button_line_save">
          <el-button
            :type="isChange ? 'primary' : 'info'"
            @click="onSave"
          >{{ isChange ? '请保存' : '无需保存' }}</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPageItems } from '@/api/page'
import { queryUnitLike, getUnitInfo } from '@/api/unit'
import { resertPageitemsByPageid } from '@/api/pageitems'
import AudioPlayer from '@/views/edit/AudioPlayer.vue'
export default {
  name: 'Edit',
  components: { AudioPlayer },
  data() {
    return {
      isPlay: false,
      page_id: '',
      path: '',
      OriginalPageItems: [],
      pageItems: [],
      queryValue: '',
      addId: '',
      options: [],
      value: [],
      playing: [],
      isChange: false,
      firstGet: false
    }
  },
  watch: {
    // 监听路由变化
    $route(to, from) {
      if (to.path === this.path && to.query.id !== this.page_id) {
        this.page_id = to.query.id
        this.getPageItems()
      }
    },
    // 监听pageItems变化和子元素的顺序变化
    pageItems: {
      handler(newValue) {
        if (this.firstGet === true) {
          this.firstGet = false
          this.OriginalPageItems = JSON.parse(JSON.stringify(newValue))
          return
        }
        console.log(newValue, this.OriginalPageItems)
        if (newValue.length !== this.OriginalPageItems.length) {
          this.isChange = true
          this.OriginalPageItems = JSON.parse(JSON.stringify(newValue))
        } else {
          for (let i = 0; i < newValue.length; i++) {
            if (newValue[i].unit_id !== this.OriginalPageItems[i].unit_id) {
              this.isChange = true
              this.OriginalPageItems = JSON.parse(JSON.stringify(newValue))
              break
            }
          }
        }
      },
      deep: true
    }
  },

  // // 当离开页面时，提示保存
  // beforeRouteLeave(to, from, next) {
  //   if (this.isChange === true) {
  //     this.$confirm('当前页面有未保存的修改, 是否继续离开?', '提示', {
  //       confirmButtonText: '确定',
  //       cancelButtonText: '取消',
  //       type: 'warning'
  //     })
  //       .then(() => {
  //         next()
  //       })
  //       .catch(() => {
  //         this.$message({
  //           type: 'info',
  //           message: '已取消'
  //         })
  //         next(false)
  //       })
  //   } else {
  //     next()
  //   }
  // },
  mounted() {
    this.path = this.$route.path
    this.page_id = this.$route.query.id
    this.getPageItems()
  },
  methods: {
    querySearch(queryValue) {
      if (queryValue === '') {
        return
      }
      const data = {
        chinese: queryValue
      }
      queryUnitLike(data).then((res) => {
        if (res.code === 200) {
          // 去掉res.data中已存在于pageItems中的数据
          const arr = []
          res.data.forEach((item) => {
            const index = this.pageItems.findIndex((i) => i.unit_id === item.id)
            if (index === -1) {
              const new_item = item
              new_item.value = item.id
              new_item.unit_id = item.id
              new_item.label = item.chinese
              arr.push(item)
            }
          })
          this.options = arr
          console.log(this.options)
        }
      })
    },
    getPageItems() {
      getPageItems(this.page_id).then((res) => {
        if (res.code === 200) {
          this.firstGet = true
          this.OriginalPageItems = res.data
          this.pageItems = res.data
          console.log(this.pageItems)
        }
      })
    },
    addArray() {
      console.log(this.value)
      console.log(this.options)
      // 将value中的id对应的数据添加到pageItems中
      this.value.forEach((item) => {
        console.log(item)
        const index = this.options.findIndex((i) => i.unit_id === item)
        console.log(index)
        if (index !== -1) {
          this.pageItems.push(this.options[index])
        }
      })
      console.log(this.pageItems)
      this.value = []
    },
    addSimple() {
      // 将addId对应的数据添加到pageItems中
      getUnitInfo(this.addId).then((res) => {
        if (res.code === 200) {
          const index = this.pageItems.findIndex((i) => i.unit_id === res.data.id)
          if (index === -1) {
            console.log(res.data)
            res.data.unit_id = res.data.id
            this.pageItems.push(res.data)
          }
        }
      })
      this.addId = '' // 清空输入框
    },
    moveUp(unit_id) {
      const index = this.pageItems.findIndex((item) => item.unit_id === unit_id)
      if (index !== -1 && index !== 0) {
        const temp = this.pageItems[index]
        this.pageItems.splice(index, 1)
        this.pageItems.splice(index - 1, 0, temp)
      }
    },
    moveDown(unit_id) {
      console.log('moveDown')
      const index = this.pageItems.findIndex((item) => item.unit_id === unit_id)
      if (index !== -1 && index !== this.pageItems.length - 1) {
        const temp = this.pageItems[index]
        this.pageItems.splice(index, 1)
        this.pageItems.splice(index + 1, 0, temp)
      }
      console.log(this.pageItems)
    },
    remove(unit_id) {
      // 确认删除
      this.$confirm('此操作将移除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          const index = this.pageItems.findIndex((item) => item.unit_id === unit_id)
          if (index !== -1) {
            this.pageItems.splice(index, 1)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },
    onSave() {
      if (this.isChange === false) {
        this.$message({
          type: 'info',
          message: '无需保存'
        })
        return
      }
      // 根据pageItems的顺序更新sort属性
      const items = []
      this.pageItems.forEach((item, index) => {
        const temp = {
          unit_id: item.unit_id,
          sort: index
        }
        items.push(temp)
      })
      const data = {
        page_id: this.page_id,
        pageItems: items
      }
      resertPageitemsByPageid(data).then((res) => {
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: '保存成功'
          })
          this.isChange = false
          this.getPageItems()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@/views/edit/index.scss";
</style>
