<template>
  <div class="control">
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
<style lang='scss' scoped>
.control {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  .circal-box {
    width: 50px;
    height: 50px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
  }

  .circal {
    margin-top: 5px;
    width: 40px;
    height: 40px;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    background-color: #f1f1f1;
    border-radius: 50%;

    .pause {
      display: inline-flex;
      width: 0;
      height: 0;
      border-top: 8px solid transparent;
      border-bottom: 8px solid transparent;
      border-left: 14px solid #40b5e4;
      margin-left: 5px;
    }

    .play {
      width: 20px;
      height: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-bottom: 5px;

      .vertical-left {
        width: 4px;
        height: 16px;
        margin-right: 2px;
        margin-top: 5px;
        background-color: #40b5e4;
      }

      .vertical-right {
        width: 4px;
        height: 16px;
        margin-left: 2px;
        margin-top: 5px;
        background-color: #40b5e4;
      }
    }
  }

  .circal:hover {
    border-radius: 50%;
    background-color: #e5e5e5;
  }
}

</style>
