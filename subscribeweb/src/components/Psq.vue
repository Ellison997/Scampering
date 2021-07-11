<template>
  <div class="hello">
    <h3 style="text-align: center;margin: 18px auto;">企业复工职工健康统计</h3>
    <van-row>
      <van-cell-group>
        <van-field v-model="name" required placeholder="请输入姓名" label="姓名" />
        <van-field
          readonly
          clickable
          required
          label="性别"
          :value="sex"
          placeholder="请选择性别"
          @click="isShowSexPick = true"
        />
        <van-field v-model="phone" type="tel" required placeholder="请输入手机号码" label="手机号" />
        <van-field v-model="idcard" required placeholder="请输入身份证号码" label="身份证号码" />
        <van-field v-model="idcardAdderss" required placeholder="请输入身份证地址" label="身份证地址" />

        <van-field
          readonly
          clickable
          required
          label="在杭住址"
          :value="hangAddress1"
          placeholder="请选择省市区"
          @click="isShowAddressPick = true"
        />
        <van-field v-model="hangAddress2" required placeholder="请输入详细地址" label="详细住址" />
        <van-field
          v-model="hangMode"
          :readonly="true"
          @focus="isShowHangModePick=true"
          required
          placeholder="请选择住宿方式"
          label="住宿方式"
        />
        <van-field
          v-model="is14"
          :readonly="true"
          @focus="isShowIs14Pick=true"
          required
          placeholder="请选择最近14天是否离杭"
          label="14天是否离杭"
        />
        <van-field
          v-model="ishang"
          :readonly="true"
          @focus="isShowIshangPick=true"
          required
          placeholder="请选择目前是否在杭"
          label="是否在杭"
        />

        <van-field
          readonly
          clickable
          required
          label="从何处来杭"
          :value="hangAddress3"
          placeholder="请选择省市区"
          @click="isShowAddress3Pick = true"
        />

        <van-field
          readonly
          clickable
          required
          label="来杭交通"
          :value="trafficMode"
          placeholder="请选择来杭交通方式"
          @click="isShowTrafficModePick = true"
        />

        <van-field
          readonly
          clickable
          required
          label="途径湖北"
          :value="iswayHubei"
          placeholder="请选择来杭是否途经湖北"
          @click="isShowIswayHubeiPick = true"
        />

        <van-field
          readonly
          clickable
          label="回杭时间"
          :value="date"
          placeholder="请选择回杭时间"
          @click="isShowDatePick = true"
        />

        <van-field
          readonly
          clickable
          label="预计回杭时间"
          :value="planDate"
          placeholder="请选择预计回杭时间"
          @click="isShowPlanDatePick = true"
        />

        <van-field
          readonly
          clickable
          required
          label="隔离方式"
          :value="insulateMode"
          placeholder="请选择隔离方式"
          @click="isShowInsulateModePick = true"
        />

        <van-field
          readonly
          clickable
          required
          label="当前身体状态"
          :value="physicalState"
          placeholder="请选择当前身体状态"
          @click="isShowPhysicalStatePick = true"
        />

        <van-field
          readonly
          clickable
          required
          label="外部聚会"
          :value="is14gathering"
          placeholder="请选择最近14天是否参加过外部聚会"
          @click="isShowIs14gatheringPick = true"
        />
        <van-field
          readonly
          clickable
          required
          label="接触重点疫区人员"
          :value="is14emphasis"
          placeholder="请选择最近14天是否接触重点疫区来源人员"
          @click="isShowIs14emphasisPick = true"
        />

        <van-field v-model="note" placeholder="请输入备注" label="备注" />

        <br />
        <van-button type="primary" size="large" @click="subscribeGo">提交</van-button>
      </van-cell-group>
      <div style="height: 60px;"></div>
    </van-row>

    <van-popup v-model="isShowSexPick" position="bottom">
      <van-picker
        show-toolbar
        :columns="['男','女']"
        @cancel="isShowSexPick = false"
        @confirm="onSexConfirm"
      />
    </van-popup>

    <van-popup v-model="isShowAddressPick" position="bottom">
      <van-area
        @cancel="isShowAddressPick = false"
        @confirm="onhangAddress1Confirm"
        :area-list="areaList"
      />
    </van-popup>

    <van-popup v-model="isShowAddress3Pick" position="bottom">
      <van-area
        @cancel="isShowAddress3Pick = false"
        @confirm="onhangAddress3Confirm"
        :area-list="areaList"
      />
    </van-popup>

    <van-popup v-model="isShowHangModePick" position="bottom">
      <van-picker
        show-toolbar
        :columns="['自住','租住']"
        @cancel="isShowHangModePick = false"
        @confirm="onHangModeConfirm"
      />
    </van-popup>

    <van-popup v-model="isShowIs14Pick" position="bottom">
      <van-picker
        show-toolbar
        :columns="['是','否']"
        @cancel="isShowIs14Pick = false"
        @confirm="onIs14eConfirm"
      />
    </van-popup>
    <van-popup v-model="isShowIshangPick" position="bottom">
      <van-picker
        show-toolbar
        :columns="['是','否']"
        @cancel="isShowIshangPick = false"
        @confirm="onIshangConfirm"
      />
    </van-popup>
    <van-popup v-model="isShowTrafficModePick" position="bottom">
      <van-picker
        show-toolbar
        :columns="['飞机','火车','自驾','其他公共交通']"
        @cancel="isShowTrafficModePick = false"
        @confirm="onTrafficModeConfirm"
      />
    </van-popup>
    <van-popup v-model="isShowIswayHubeiPick" position="bottom">
      <van-picker
        show-toolbar
        :columns="['是','否']"
        @cancel="isShowIswayHubeiPick = false"
        @confirm="onIswayHubeiConfirm"
      />
    </van-popup>

    <van-popup v-model="isShowDatePick" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @cancel="onDateCancel"
        @confirm="onDateConfirm"
      />
    </van-popup>
    <van-popup v-model="isShowPlanDatePick" position="bottom">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        :min-date="minDate"
        :max-date="maxDate"
        :formatter="formatter"
        @cancel="onPlanDateCancel"
        @confirm="onPlanDateConfirm"
      />
    </van-popup>

    <van-popup v-model="isShowInsulateModePick" position="bottom">
      <van-picker
        show-toolbar
        :columns="['无需隔离','居家隔离','企业集中隔离-酒店','企业集中隔离-宿舍','医学隔离-疑似','医学隔离-确诊']"
        @cancel="isShowInsulateModePick = false"
        @confirm="onInsulateModeConfirm"
      />
    </van-popup>

    <van-popup v-model="isShowPhysicalStatePick" position="bottom">
      <van-picker
        show-toolbar
        :columns="['健康','发烧','乏力','咳嗽']"
        @cancel="isShowPhysicalStatePick = false"
        @confirm="onPhysicalStateConfirm"
      />
    </van-popup>

    <van-popup v-model="isShowIs14gatheringPick" position="bottom">
      <van-picker
        show-toolbar
        :columns="['是','否']"
        @cancel="isShowIs14gatheringPick = false"
        @confirm="onIs14gatheringConfirm"
      />
    </van-popup>

    <van-popup v-model="isShowIs14emphasisPick" position="bottom">
      <van-picker
        show-toolbar
        :columns="['是','否']"
        @cancel="isShowIs14emphasisPick = false"
        @confirm="onIs14emphasisConfirm"
      />
    </van-popup>
    <van-overlay :show="showOverlay">
      <div class="wrapper" @click.stop>
        <div>
          <van-icon name="success" />
        </div>
        <h2 style="margin: 10px;">{{title}}</h2>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import psq from "./../../api/psq";
import areaList from "./../assets/area";
import md5 from "js-md5";
export default {
  name: "Subscribe",
  data() {
    return {
      title: "",
      tijiaoState: false,
      areaList: areaList,
      showOverlay: false,

      name: "", // 姓名
      sex: "", // 性别
      phone: "", // 手机号
      idcard: "", // 身份证号码
      idcardAdderss: "", // 身份证地址
      hangAddress1: "", // 在杭住址（详细地址，需要到街道乡镇小区）
      hangAddress2: "", // 在杭住址（详细地址，需要到街道乡镇小区）
      hangMode: "", //自住/租住
      is14: "", // 最近14天是否离杭
      ishang: "", // 目前是否在杭
      hangAddress3: "", //从何处来杭
      province: "", //从何处来杭（省份）
      city: "", // 市
      district: "", // 区
      trafficMode: "", // 来杭州交通方式（飞机/火车/自驾/其他公共交通）
      iswayHubei: "", // 来杭是否途经湖北
      date: "", // 回杭日期
      planDate: "", // 计划回杭日期
      insulateMode: "", // 隔离方式(无需隔离／居家隔离/企业集中隔离-酒店／企业集中隔离-宿舍／医学隔离-疑似／医学隔离-确诊）
      physicalState: "", // 当前身体状态（健康/发烧/乏力/咳嗽）
      is14gathering: "", // 最近14天是否参加过外部聚会
      is14emphasis: "", // 最近14天是否接触重点疫区来源人员
      note: "", // 备注

      verifyCode: "",
      verifyId: "",
      isShowPick: false,
      startGoTime: null,
      isSubscribe: true, // 是否禁用立即预约按钮

      isShowSexPick: false, // 选择性别
      isShowAddressPick: false, // 选择省市区
      isShowAddress3Pick: false, //从何处来杭
      isShowHangModePick: false, // 自住/租住
      isShowIs14Pick: false, // 最近14天是否离杭
      isShowIshangPick: false, // 目前是否在杭
      isShowTrafficModePick: false, //请选择来杭交通方式
      isShowIswayHubeiPick: false, // 请选择来杭是否途经湖北
      isShowDatePick: false, // 回杭时间
      isShowPlanDatePick: false, //预计回杭时间
      isShowInsulateModePick: false, // 隔离方式
      isShowPhysicalStatePick: false, // 身体状态
      isShowIs14gatheringPick: false, // 请选择最近14天是否参加过外部聚会
      isShowIs14emphasisPick: false, // 请选择最近14天是否接触重点疫区来源人员
      minDate: new Date(2020, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date()
    };
  },
  props: {
    msg: String
  },
  methods: {
    formatDate(time, format = "YY-MM-DD hh:mm:ss") {
      var date = new Date(time);

      var year = date.getFullYear(),
        month = date.getMonth() + 1, //月份是从0开始的
        day = date.getDate(),
        hour = date.getHours(),
        min = date.getMinutes(),
        sec = date.getSeconds();
      var preArr = Array.apply(null, Array(10)).map(function(elem, index) {
        return "0" + index;
      }); ////开个长度为10的数组 格式为 00 01 02 03

      var newTime = format
        .replace(/YY/g, year)
        .replace(/MM/g, preArr[month] || month)
        .replace(/DD/g, preArr[day] || day)
        .replace(/hh/g, preArr[hour] || hour)
        .replace(/mm/g, preArr[min] || min)
        .replace(/ss/g, preArr[sec] || sec);

      return newTime;
    },
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      } else if (type === "day") {
        return `${val}日`;
      }
      return val;
    },
    subscribeGo() {
      let that = this;
      if (
        that.name != "" &&
        that.sex != "" &&
        that.phone != "" &&
        that.idcard != "" &&
        that.idcardAdderss != "" &&
        that.hangAddress1 != "" &&
        that.hangAddress2 != "" &&
        that.hangMode != "" &&
        that.is14 != "" &&
        that.ishang != "" &&
        that.province != "" &&
        that.city != "" &&
        that.district != "" &&
        that.trafficMode != "" &&
        that.iswayHubei != "" &&
        that.insulateMode != "" &&
        that.physicalState != "" &&
        that.is14gathering != "" &&
        that.is14emphasis != ""
      ) {
        let s = {
          name: that.name,
          sex: that.sex,
          phone: that.phone,
          idcard: that.idcard,
          idcardAdderss: that.idcardAdderss,
          hangAddress: that.hangAddress1 + that.hangAddress2,
          hangMode: that.hangMode,
          is14: that.is14,
          ishang: that.ishang,
          province: that.province,
          city: that.city,
          district: that.district,
          trafficMode: that.trafficMode,
          iswayHubei: that.iswayHubei,
          date: that.date,
          planDate: that.planDate,
          insulateMode: that.insulateMode,
          physicalState: that.physicalState,
          is14gathering: that.is14gathering,
          is14emphasis: that.is14emphasis,
          note: that.note
        };
        psq.addStaff(s).then(res => {
          console.log(res);
          if (res.code == 20000) {
            that.showOverlay = true;
            that.title = res.msg;
          } else {
            alert(res.msg);
          }
        });
      } else {
        alert("请检查必填项");
      }
    },
    onSexConfirm(value) {
      this.isShowSexPick = false;
      this.sex = value;
    },
    onhangAddress1Confirm(arr) {
      this.isShowAddressPick = false;
      console.log(arr);
      for (const a of arr) {
        this.hangAddress1 += a.name;
      }
    },
    onhangAddress3Confirm(arr) {
      this.isShowAddress3Pick = false;
      console.log(arr);
      this.hangAddress3 = "";
      for (const a of arr) {
        this.hangAddress3 += a.name;
      }
      this.province = arr[0].name;
      this.city = arr[1].name;
      this.district = arr[2].name;
    },
    onHangModeConfirm(value) {
      this.hangMode = value;
      this.isShowHangModePick = false;
    },
    onIs14eConfirm(value) {
      this.is14 = value;
      this.isShowIs14Pick = false;
    },
    onIshangConfirm(value) {
      this.ishang = value;
      this.isShowIshangPick = false;
    },

    onTrafficModeConfirm(value) {
      this.trafficMode = value;
      this.isShowTrafficModePick = false;
    },
    onIswayHubeiConfirm(value) {
      this.iswayHubei = value;
      this.isShowIswayHubeiPick = false;
    },

    onDateCancel(value) {
      this.date = "";
      this.isShowDatePick = false;
    },
    onPlanDateCancel(value) {
      this.planDate = "";
      this.isShowPlanDatePick = false;
    },

    onDateConfirm(value) {
      this.date = this.formatDate(value, "YY-MM-DD");
      this.isShowDatePick = false;
    },
    onPlanDateConfirm(value) {
      this.planDate = this.formatDate(value, "YY-MM-DD");
      this.isShowPlanDatePick = false;
    },
    onInsulateModeConfirm(value) {
      this.insulateMode = value;
      this.isShowInsulateModePick = false;
    },
    onPhysicalStateConfirm(value) {
      this.physicalState = value;
      this.isShowPhysicalStatePick = false;
    },
    onIs14gatheringConfirm(value) {
      this.is14gathering = value;
      this.isShowIs14gatheringPick = false;
    },
    onIs14emphasisConfirm(value) {
      this.is14emphasis = value;
      this.isShowIs14emphasisPick = false;
    }
  },
  created() {
    let that = this;
    console.log(this.areaList);
    let arr=['123','456','789']
    let arrStr=``
    for (const a of arr) {
      arrStr+=a+'\n'
    }
    console.log(arrStr)
    console.log(`hahah
    xixixi
    heheh`)
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

.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  height: 100%;
  color: #fff;
  text-align: center;
}
.van-icon {
  font-size: 6rem;
}

.block {
  width: 120px;
  height: 120px;
  background-color: #fff;
}
</style>
