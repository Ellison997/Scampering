Component({
  // 组件对外属性
  properties: {
    monthCount: {
      type: Number,
      value: 12,
      description: '显示几个月份'
    },
    leastDays: {
      type: Number,
      value: 0,
      description: '最小日期间隔'
    },
    timeArr: {
      type: Array,
      value: [0, 0],
      description: '数组的两个元素分别为选中的开始毫秒时间戮和结束开始毫秒时间戮'
    }
  },

  data: {
    state: 0,
    curYear: '',
    curMonth: '',
    curDay: '',
    calendars: [],
    head_year: 0,
    head_month: 0,
    head_week: 1,
    head_week_month: 0
  },

  // 组件生命周期函数，在组件实例进入页面节点树时执行
  attached: function() {
    let that = this;
    let date = new Date();
    that._init();

  },

  // 组件中的方法
  methods: {
    _calendarFactory: function(year, month) {
      let that = this;
      let daysCount = that._getDays(year, month);
      let startWeek = that._getWeek(year, month);
      let days = Array.from(new Array(daysCount), (val, index) => {
        return {
          text: index + 1,
          timestamp: new Date(`${year}/${month}/${index + 1}`).getTime()
        };
      });
      // 占位符
      let placeholders = Array.from(new Array(startWeek), (val, index) => index + 1);

      return {
        year,
        month,
        days,
        startWeek,
        placeholders
      }
    },

    // 创建月日历
    _createMonthCalendars: function() {
      let that = this;
      let calendars = [];
      let currentYear = that.data.curYear;
      let startMonth = 1;

      for (let i = 0; i < that.data.monthCount; i++) {
        calendars.push(that._calendarFactory(currentYear, startMonth));

        startMonth += 1;
      }

      that.setData({
        calendars
      })
    },

    // 创建周日历
    _createWeekCalendars: function(month) {
      let that = this;
      let calendars = [];
      let date = new Date();

      let year = parseInt(date.getFullYear(), 10);
      // let month = parseInt(date.getMonth(), 10)+1;

      let startWeek = that._getWeek(year, month);
      let placeholdersTemp = Array.from(new Array(startWeek), (val, index) => index + 1);

      let monthDays = that._calendarFactory(year, month);
      console.log('placeholders', placeholdersTemp)
      let daysTemp = placeholdersTemp.concat(monthDays.days);

      for (var i = 0, len = daysTemp.length; i < len; i += 7) {

        let days = (i == 0 ? daysTemp.slice(i + placeholdersTemp.length, i + 7) : daysTemp.slice(i, i + 7));
        let placeholders = (i == 0 ? placeholdersTemp : []);
        calendars.push({
          year,
          month,
          days,
          startWeek,
          placeholders
        });
      }

      that.setData({
        calendars
      })
    },


    // 初始化日历
    _init: function() {
      let that = this;
      let date = new Date();

      // 时间为今天
      that.setData({
        curYear: parseInt(date.getFullYear(), 10),
        curMonth: parseInt(date.getMonth(), 10),
        curDay: parseInt(date.getDate(), 10),
        head_year: parseInt(date.getFullYear(), 10),
        head_month: parseInt(date.getMonth(), 10) + 1
      });

      that._createMonthCalendars();
    },

    // 获取当前月的天数
    _getDays: function(curYear, curMonth) {
      let day = new Date(curYear, curMonth, 0);

      return day.getDate();
    },

    _getWeek: function(year, month) {
      let date = new Date();

      date.setYear(year);
      date.setMonth(month - 1);
      date.setDate(1);

      return date.getDay();
    },

    // 点击时间
    _chooseDay: function(e) {
      let that = this;
      const timestamp = e.currentTarget.dataset.timestamp;
      const disabled = e.currentTarget.dataset.disabled;

      if (disabled) return false;

      that.setData({
        'timeArr[0]': timestamp
      })
      that._notify();
    },

    _notify: function() {
      let that = this;
      let count = 0;
      if (that.data.timeArr[1]) {
        count = (that.data.timeArr[1] - that.data.timeArr[0]) / 864e5 + 1;
      } else if (that.data.timeArr[0] && !that.data.timeArr[1]) {
        count = 1;
      } else {
        count = 0;
      }

      // 组件外部通信
      that.triggerEvent('calendarchange', {
        days: that.data.timeArr,
        count
      });
    },

    clearChoose: function() {
      that.setData({
        timeArr: [0, 0]
      })
      that._notify();
    },

    // 日历切换
    swiperChange: function(e) {
      let that = this;
      if (that.data.state == 0) {
        that.setData({
          head_month: e.detail.current + 1
        })
      } else {
        that.setData({
          head_week: e.detail.current + 1
        })

      }

    },

    // 状态切换
    stateSwith: function() {
      let that = this;

      if (that.data.state == 0) {
        that._createWeekCalendars(that.data.head_month);
        that.setData({
          state: 1,
          head_week_month: that.data.head_month
        })
      } else {
        that._createMonthCalendars();
        that.setData({
          state: 0
        })
      }
      that.triggerEvent('statechange', {
        state: that.data.state
      });
    },
    // 切换到今日
    currDay: function() {
      let that = this;
      let date = new Date();

      let month = parseInt(date.getMonth(), 10)+1;
      that._createMonthCalendars();
      that.setData({
        state: 0,
        head_month:month,
      })
    }
  }
})