<template>
  <div class="box">
    <div class="container">
      <div class="preview">
        <div class="unit-box">
          <div v-for="item in pageItems" :key="item.id" class="unit">
            <div class="letter">
              <div class="chinese">{{ item.chinese }}</div>
              <div class="inline">
                <div class="lao">{{ item.lao }}</div>
                <div class="audio">
                  <audio :src="item.src" preload="none" />
                  <div class="circal-box" @click="play()">
                    <div class="circal button-play cursor-pointer">
                      <div :class="isPlay ? 'play' : 'pause'">
                        <div class="vertical-left" />
                        <div class="vertical-right" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="description">{{ item.description }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="edit">
        <div class="button-line">
          <el-input />
          <el-button type="primary">添加</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getPageItems } from '@/api/page'
export default {
  name: 'Edit',
  components: {},
  data() {
    return {
      isPlay: false,
      page_id: '',
      path: '',
      pageItems: []
    }
  },
  // 监听路由变化
  watch: {
    $route(to, from) {
      if (to.path === this.path && to.query.id !== this.page_id) {
        this.page_id = to.query.id
        this.getPageItems()
      }
    }
  },

  mounted() {
    this.path = this.$route.path
    this.page_id = this.$route.query.id
    this.getPageItems()
  },
  methods: {
    getPageItems() {
      getPageItems(this.page_id).then(res => {
        if (res.code === 200) {
          this.pageItems = res.data
        }
      })
    },
    play() {
      this.isPlay = !this.isPlay
    } }
}
</script>

<style lang="scss" scoped>
@import '@/views/edit/index.scss';
</style>
