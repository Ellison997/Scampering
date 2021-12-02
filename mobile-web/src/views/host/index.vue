<template>
  <div class="container">
    <div class="title-box">
      <h2>辐射工作人员培训报名</h2>
    </div>
    <div class="bottom-title-box">
      <h4>上滑开始</h4>
    </div>
    <img src="../../static/icon/upglide.png" class="icon-up" />
  </div>
</template>

<script>
export default {
  methods: {
    touch() {
      let _this = this;
      var startx, starty;

      //获得角度
      function getAngle(angx, angy) {
        return (Math.atan2(angy, angx) * 180) / Math.PI;
      }

      //根据起点终点返回方向 1向上滑动 2向下滑动 3向左滑动 4向右滑动 0点击事件
      function getDirection(startx, starty, endx, endy) {
        var angx = endx - startx;
        var angy = endy - starty;
        var result = 0;

        //如果滑动距离太短
        if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
          return result;
        }

        var angle = getAngle(angx, angy);
        if (angle >= -135 && angle <= -45) {
          result = 1;
        } else if (angle > 45 && angle < 135) {
          result = 2;
        } else if (
          (angle >= 135 && angle <= 180) ||
          (angle >= -180 && angle < -135)
        ) {
          result = 3;
        } else if (angle >= -45 && angle <= 45) {
          result = 4;
        }
        return result;
      }

      //手指接触屏幕
      document.addEventListener(
        "touchstart",
        function (e) {
          startx = e.touches[0].pageX;
          starty = e.touches[0].pageY;
        },
        false
      );

      //手指离开屏幕
      document.addEventListener(
        "touchend",
        function (e) {
          var endx, endy;
          endx = e.changedTouches[0].pageX;
          endy = e.changedTouches[0].pageY;
          var direction = getDirection(startx, starty, endx, endy);
          switch (direction) {
            case 0:
              break;
            case 1:
              if (_this.$route.path === "/") {
                console.log(_this.$route);
                _this.$router.push("/index");
              }
              break;
            case 2:
              break;
            case 3:
              break;
            case 4:
              break;
            default:
              break;
          }
        },
        false
      );
    },
  },
  mounted() {
    this.touch();
  },
};
</script>

<style lang="scss" scoped>
@keyframes up {
  from {
    margin-bottom: 10%;
    opacity: 0.2;
  }
  to {
    margin-top: 50%;
    opacity: 0.5;
  }
}
.container {
  background: url("../../static/img/bg.jpeg");
  height: 100vh;
  width: 100vw;
  position: relative;
  .title-box {
    position: absolute;
    top: 100px;
    left: 50%;
    transform: translate(-50%);
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    h2 {
      color: #fff;
    }
  }
  .bottom-title-box {
    color: #fff;
    position: absolute;
    bottom: 0px;
    left: 50%;
    transform: translate(-50%);
  }
  .icon-up {
    position: absolute;
    height: 55px;
    width: 55px;
    bottom: 25px;
    left: 50%;
    transform: translate(-50%);
    animation: 1.5s linear 0s infinite alternate up;
  }
}
</style>