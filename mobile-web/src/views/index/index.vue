<template>
  <div class="container">
    <div class="title-box">
      <h2>辐射工作人员培训报名</h2>
      <div>
        2021年辐射工作人员培训报名又开始了，欢迎相关从业者报名参加！如欲报名，请如实提交下面您的报名信息！感谢大家信任！
      </div>
    </div>
    <!-- <van-divider /> -->
    <div class="form-box">
      <van-form @submit="onSubmit" class="my-input">
        <div class="item-box">
          <h4>姓名:</h4>
          <van-field
            v-model="form.applicant"
            name="申请人"
            placeholder="申请人"
            :rules="[{ required: true, message: '请填写申请人' }]"
          />
        </div>
        <div class="item-box">
          <h4>身份证号:</h4>
          <van-field
            v-model="form.identity"
            name="checkID"
            placeholder="身份证号"
            :rules="[
              { required: true, message: '请填写身份证号' },
              { validator: checkID, message: '格式不正确！' },
            ]"
          />
        </div>
        <div class="item-box">
          <h4>手机号:</h4>
          <van-field
            v-model="form.contact"
            name="手机号码"
            placeholder="手机号码"
            :rules="[
              { required: true, message: '请填写手机号码' },
              {
                // 自定义表单校验
                validator: checkPhoneNumber,
                message: '格式不正确！',
              },
            ]"
          />
        </div>
        <div class="item-box">
          <h4>文化程度:</h4>
          <van-field
            v-model="form.degree"
            name="文化程度"
            placeholder="文化程度"
            :rules="[{ required: true, message: '请填写文化程度' }]"
          />
        </div>
        <div class="item-box">
          <h4>专业:</h4>
          <van-field
            v-model="form.major"
            is-link
            readonly
            placeholder="点击选择专业"
            @click="showMajorPicker = true"
          />
          <van-popup v-model="showMajorPicker" round position="bottom">
            <van-cascader
              v-model="cascaderValue"
              :options="majorColumns"
              @close="showMajorPicker = false"
              @finish="onMajorConfirm"
            />
          </van-popup>
        </div>
        <div class="item-box">
          <h4>工作单位:</h4>
          <van-field
            v-model="form.companyName"
            name="工作单位"
            placeholder="工作单位"
            :rules="[{ required: true, message: '请填写工作单位' }]"
          />
        </div>
        <div class="item-box">
          <h4>单位城市:</h4>
          <van-field
            readonly
            clickable
            name="picker"
            :value="form.city"
            placeholder="点击选择省份"
            @click="showCityPicker = true"
          />
          <van-popup v-model="showCityPicker" position="bottom">
            <van-area
              :area-list="areaList"
              @confirm="onCityConfirm"
              @cancel="showCityPicker = false"
            />
          </van-popup>
        </div>
        <div style="width: 90%; margin: 100px">
          <van-button type="info" size="large">提交</van-button>
        </div>
      </van-form>
    </div>
    <van-overlay :show="isLoading" @click="show = false">
      <van-loading color="#fff" class="loading" />
    </van-overlay>
  </div>
</template>

<script>
import { v4 as uuidv4 } from "uuid";
import { addEnroll } from "../../api/enroll";
import { Dialog } from "vant";
import { areaList } from "@vant/area-data";
export default {
  data() {
    return {
      form: {
        companyName: "",
        address: "",
        applicant: "",
        contact: "",
        identity: "",
        city: "",
        degree: "",
        major: "",
        category: "",
      },
      cascaderValue: "",
      isLoading: false,
      showCityPicker: false,
      cityColumns: {
        province_list: {},
        city_list: {},
        county_list: {},
      },
      showMajorPicker: false,
      majorColumns: [
        {
          text: "FS01医用X射线诊断与介入放射学",
          value: "FS01医用X射线诊断与介入放射学",
          children: [
            {
              text: "FS001医用X射线诊断与介入",
              value: "FS001医用X射线诊断与介入",
            },
          ],
        },
        {
          text: "FS22辐射安全管理",
          value: "FS22辐射安全管理",
          children: [
            {
              text: "FS221单位辐射安全与防护管理",
              value: "FS221单位辐射安全与防护管理",
            },
            {
              text: "FS222同位素与射线装置销售",
              value: "FS222同位素与射线装置销售",
            },
            {
              text: "FS223辐射安全监管",
              value: "FS223辐射安全监管",
            },
          ],
        },
        {
          text: "FS23科研、生产及其他",
          value: "FS23科研、生产及其他",
          children: [
            {
              text: "FS231科研",
              value: "FS231科研",
            },
            {
              text: "FS232开放性实验室",
              value: "FS232开放性实验室",
            },
            {
              text: "FS233同位素生产",
              value: "FS233同位素生产",
            },
            {
              text: "FS234射线装置/含源设备生产、安装、调试、维修",
              value: "FS234射线装置/含源设备生产、安装、调试、维修",
            },
            {
              text: "FS235放射性物品运输",
              value: "FS235放射性物品运输",
            },
            {
              text: "FS236其他",
              value: "FS236其他",
            },
          ],
        },
        {
          text: "FS02放射治疗",
          value: "FS02放射治疗",
          children: [
            {
              text: "FS002放射治疗",
              value: "FS002放射治疗",
            },
          ],
        },
        {
          text: "FS03核医学",
          value: "FS03核医学",
          children: [
            {
              text: "FS003核医学",
              value: "FS003核医学",
            },
          ],
        },
        {
          text: "FS11伽马射线探伤",
          value: "FS11伽马射线探伤",
          children: [
            {
              text: "FS101伽马射线探伤",
              value: "FS101伽马射线探伤",
            },
          ],
        },
        {
          text: "FS12X射线探伤",
          value: "FS12X射线探伤",
          children: [
            {
              text: "FS102X射线探伤",
              value: "FS102X射线探伤",
            },
          ],
        },
        {
          text: "FS13放射性测井",
          value: "FS13放射性测井",
          children: [
            {
              text: "FS103放射性测井",
              value: "FS103放射性测井",
            },
          ],
        },
        {
          text: "FS14核子仪",
          value: "FS14核子仪",
          children: [
            {
              text: "FS104核子仪",
              value: "FS104核子仪",
            },
          ],
        },
        {
          text: "FS15伽马辐照",
          value: "FS15伽马辐照",
          children: [
            {
              text: "FS105伽马辐照",
              value: "FS105伽马辐照",
            },
          ],
        },
        {
          text: "FS16工业辐照电子加速器",
          value: "FS16工业辐照电子加速器",
          children: [
            {
              text: "FS106电子加速器辐照",
              value: "FS106电子加速器辐照",
            },
          ],
        },
      ],
      areaList,
    };
  },
  mounted() {},
  methods: {
    checkID(val) {
      return /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(
        val
      );
    },
    checkPhoneNumber(mobile) {
      var tel = /^0\d{2,3}-?\d{7,8}$/;
      var phone = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1}))+\d{8})$/;
      if (mobile.length == 11) {
        //手机号码
        if (phone.test(mobile)) {
          console.log(mobile);
          return true;
        }
      } else if (mobile.length == 13 && mobile.indexOf("-") != -1) {
        //电话号码
        if (tel.test(mobile)) {
          console.log(mobile);
          return true;
        }
      }
      return false;
    },
    onCityConfirm(value) {
      console.log(value);
      this.form.city = value[0].name;
      this.form.address = value[1].name + "/" + value[2].name;
      // this.form.city = value;
      this.showCityPicker = false;
    },
    onMajorConfirm({ selectedOptions }) {
      this.showMajorPicker = false;
      this.form.major = selectedOptions.map((option) => option.text).join("/");
    },
    onSubmit() {
      let createTime = this.$moment(new Date()).format("YYYY-MM-DD HH:mm:ss");
      let id = uuidv4();
      let arr = this.form.major.split("/");
      // 解析major
      let major = arr[0];
      let category = arr[1];
      let data = {
        id,
        createTime,
        companyName: this.form.companyName,
        address: this.form.address,
        applicant: this.form.applicant,
        contact: this.form.contact,
        identity: this.form.identity,
        city: this.form.city,
        degree: this.form.degree,
        major,
        category,
      };
      this.isLoading = true;
      addEnroll(data)
        .then((res) => {
          console.log(res);
          Dialog({ message: "报名成功" });
          this.form = {
            companyName: "",
            address: "",
            applicant: "",
            contact: "",
            identity: "",
            city: "",
            degree: "",
            major: "",
            category: "",
          };
          this.isLoading = false;
        })
        .catch((err) => {
          console.log(err);
          Dialog({ message: "报名失败" });
          this.isLoading = false;
        });
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
  height: 30vh;
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
