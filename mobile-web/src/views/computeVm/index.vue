<template>
  <div class="container">
    <div class="title-box">
      <h2>场强计算</h2>
    </div>
    <div class="form-box">
      <van-form @submit="onSubmit" class="my-input">
        <div class="item-box">
          <h4>电平值（dBm）:</h4>
          <van-field
            v-model="form.dbm"
            type="number"
            name="电平值（dBm）"
            placeholder="电平值（dBm）"
            :rules="[{ required: true, message: '请填写电平值（dBm）' }]"
          />
        </div>
        <div class="item-box">
          <h4>天线因子（dBm）:</h4>
          <van-field
            v-model="form.af"
            type="number"
            placeholder="天线因子"
            :rules="[{ required: true, message: '请填写天线因子（dBm）' }]"
          />
        </div>
        <div class="item-box">
          <h4>场强（V/m）:</h4>
          <div>{{ vm }} V/m</div>
        </div>
        <div style="width: 90%; margin: 100px">
          <van-button type="info" size="large">计算</van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        af: "",
        dbm: "",
      },
      vm: 0,
    };
  },
  mounted() {},
  methods: {
    onSubmit() {
      console.log(this.form);
      let { af, dbm } = this.form;
      let dbuV_m = Number(dbm) + 107 + Number(af); // 单频点电平值 加107 加天线因子校准
      console.log("dbuV_m:", dbuV_m);
      let uV_m = Math.pow(10, dbuV_m / 20); // 单位转化 为uV/m
      this.vm = uV_m / (1000 * 1000); // 单位转化   单位转化为 V/m
    },
  },
};
</script>
<style lang="scss" scoped>
.container {
  background: #fff;
}
.title-box {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border-bottom: 2px dashed #c0c4cc;
  margin: 20px;
  h2 {
    color: #409eff;
  }
}
.loading {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.my-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  /deep/ .van-cell {
    border: 1px solid #c0c4cc !important;
    border-radius: 5px;
    width: 100%;
  }
  .item-box {
    width: 90%;
    margin: 10px;
  }
}
</style>
