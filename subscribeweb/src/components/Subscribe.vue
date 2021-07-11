<template>
  <div class="hello">
    <h3 style="text-align: center;margin: 18px auto;">
      当前状态
      <br />
      <span style="font-size: 18px;
    color: red;">{{title}}</span>
    </h3>
    <van-row>
      <van-cell-group>
        <van-field v-model="userName" required placeholder="请输入姓名" label="姓名" />
        <van-field v-model="idCardNo" required placeholder="请输入身份证号码" label="身份证号码" />
        <van-field v-model="mobileNo" required placeholder="请输入手机号码" label="手机号" />
        <van-field
          v-model="area"
          :readonly="true"
          @focus="isShowPick=true"
          required
          placeholder="请选择区域"
          label="区域"
        />
        <van-field v-model="address" required placeholder="请输入详细地址" label="详细地址" />
        <br />
        <van-button type="primary" size="large" @click="startGo">检测预约</van-button>
        <br />
        <br />
        <br />
        <van-field v-model="verifyCode" required placeholder="请输入短信验证码" label="验证码" />
        <br />
        <van-button type="primary" size="large" :disabled="isSubscribe" @click="subscribeGo">立即预约</van-button>
      </van-cell-group>
    </van-row>
    <div class="picker">
      <van-picker v-if="isShowPick" :columns="areaList" @change="onChange" />
    </div>
  </div>
</template>

<script>
import mask from "./../../api/mask";
import md5 from "js-md5";
export default {
  name: "Subscribe",
  data() {
    return {
      title: "请录入信息",
      token: "",
      value: "",
      userName: "",
      idCardNo: "",
      mobileNo: "",
      area: "",
      address: "",

      // userName: "李大白",
      // idCardNo: "111111111111111111",
      // mobileNo: "15534404594",
      // area: "西湖区",
      // address: "8幢3单元",

      verifyCode: "",
      verifyId: "",
      areaList: [
        "上城区",
        "下城区",
        "江干区",
        "拱墅区",
        "西湖区",
        "滨江区",
        "钱塘新区",
        "萧山区",
        "余杭区",
        "富阳区",
        "临安区",
        "桐庐县",
        "淳安县",
        "建德市"
      ],
      isShowPick: false,
      startGoTime: null,
      isSubscribe: true // 是否禁用立即预约按钮
    };
  },
  props: {
    msg: String
  },
  methods: {
    onChange(picker, value, index) {
      console.log(`当前值：${value}, 当前索引：${index}`);
      this.isShowPick = false;
      this.area = value;
    },
    startGo() {
      let that = this;

      clearInterval(that.startGoTime);
      that.startGoTime = setInterval(function() {
        mask.getMaskSum().then(res => {
          if (res.msg) {
            that.title = res.msg + " " + res.data;
            if (res.data != null) {
              that.token = res.data.split("|")[1];
            }
            console.log("当前数量", res);
            if (res.code != "1002" && res.data != "0|") {
              // 开始抢啦,直接发送验证码
              that.sendVerifyCode();
            }
          } else {
            that.title = "它系统崩了";
          }
        });
      }, 2000);
    },
    sendVerifyCode() {
      let that = this;

      mask
        .sendVerifyCode(that.mobileNo, md5(that.token + that.mobileNo))
        .then(r => {
          console.log("验证码结果：", r);
          if (r.code) {
            if (r.code != "1001" && r.data != null && r.code != "1") {
              that.verifyId = r.data;
              that.isSubscribe = false;
              that.title = "验证码已发送";
              clearInterval(that.startGoTime);
            }
          } else {
            that.title = "它系统崩了";
          }
        });
    },
    subscribeGo() {
      let that = this;
      clearInterval(that.startGoTime);
      let a = {
        userName: that.userName,
        idCardNo: that.idCardNo,
        mobileNo: that.mobileNo,
        verifyCode: md5(that.token + that.verifyId + that.verifyCode),
        verifyId: that.verifyId,
        area: that.area,
        address: that.address
      };
      mask.appointment(a).then(res => {
        if (res.msg) {
          that.title = res.msg;
          console.log("预约结果", res);
        } else {
          that.title = "它系统崩了";
        }
      });
    }
  },
  created() {
    let that = this;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.hello {
  height: 100%;
}
.picker {
  position: fixed;
  bottom: 0px;
  width: 100%;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
