<template>
  <div class="app">
    <div class="audio">
      <audio :src="src" preload="none" />
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
</template>

<script>
export default {
  name: 'AudioPlayer',
  props: {
    src: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      isPlay: false
    }
  },
  mounted() {
    this.onEnd()
    console.log(this.src)
  },
  methods: {
    onEnd() {
      document.querySelector(`audio[src="${this.src}"]`).addEventListener('ended', () => {
        this.isPlay = false
        console.log('ended')
        console.log('由于到达媒体末尾，播放已停止。')
      })
    },
    play() {
      if (this.src === '') {
        return this.$message({
          message: '音频地址为空,请先上传再尝试播放',
          type: 'warning'
        })
      }
      const audio = document.querySelector(`audio[src="${this.src}"]`)
      console.log(audio)
      if (audio.paused) {
        audio.play()
        this.isPlay = true
      } else {
        audio.pause()
        this.isPlay = false
      }
    }
  }

}
</script>

  <style lang="scss" scoped>
  @import '@/views/edit/index.scss';
  </style>

