<template>
  <div class="app">
    <div class="container">
      <div class="preview">
        <div class="unit-box" />
      </div>
      <div class="edit">
        <div class="button-line">
          <el-input />
          <el-button type="primary" @click="add">添加</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.app {
    position: absolute;
    bottom: 0;
    right: 0;
    padding: 20px;
    background-color: rgba(223,24,24,.5);
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center
}

.container{
    width: 100%;
    height: 100%;
    display: flex
    margin: 0 auto;
    background-color: #fff;
    border: 1px solid #ccc;
    border-radius: 5px
}

.button-line[data-v-3c6185f9] {
    width: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    margin-top: 20px
}

.button-box[data-v-3c6185f9] {
    width: 80%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -ms-flex-pack: distribute;
    justify-content: space-around;
    margin-top: 40px
}

.preview[data-v-3c6185f9] {
    width: 414px;
    height: 736px;
    border: 1px solid #0e0d0d;
    border-radius: 10px;
    margin-right: 20px;
    padding: 20px;
    background-image: linear-gradient(120deg,#e0c3fc,#8ec5fc)
}

.unit[data-v-3c6185f9] {
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 10px;
    background-color: hsla(0,0%,100%,.3);
    -webkit-box-shadow: rgba(0,0,0,.5);
    box-shadow: rgba(0,0,0,.5);
    border: 1px solid hsla(0,0%,100%,.5);
    -webkit-backdrop-filter: blur(5px);
    backdrop-filter: blur(5px)
}

.edit[data-v-3c6185f9] {
    width: 414px;
    height: 736px;
    background-color: #c1e0b7;
    border: 1px solid #ccc;
    border-radius: 5px
}

.audio[data-v-3c6185f9] {
    width: 50px;
    height: 50px;
    -webkit-transform: scale(.5);
    transform: scale(.5)
}

.inline[data-v-3c6185f9] {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center
}

.lao[data-v-3c6185f9] {
    height: 25px
}
</style>
