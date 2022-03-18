
<template>
  <el-row>
    <el-col :span="18">
      <gc-spread-sheets class="spread-host" @workbookInitialized="initSpread">
        <gc-worksheet></gc-worksheet>
      </gc-spread-sheets>
      <div id="statusBar"></div>
    </el-col>
    <el-col :span="6">
      <h1>操作面板</h1>
      <div>
        <el-button type="primary" size="small" @click="addRow()"
          >加一行</el-button
        >
        <el-button type="primary" size="small" @click="deleteRow()"
          >减一行</el-button
        >
        <el-button type="primary" size="small" @click="getData()"
          >获取数据</el-button
        >
        <el-button type="primary" size="small" @click="setData()"
          >设置数据</el-button
        >
      </div>
    </el-col>
  </el-row>
</template>
<script>
import "@grapecity/spread-sheets/styles/gc.spread.sheets.excel2016colorful.css";
import "@grapecity/spread-sheets-resources-zh";
GC.Spread.Common.CultureManager.culture("zh-cn"); // 设置语言为中文
import "@grapecity/spread-sheets-vue";
import GC from "@grapecity/spread-sheets";
import "@grapecity/spread-sheets-shapes";
import "@grapecity/spread-sheets-pivot-addon";

import jsonStr from "./data.json";
import jsonOptions from "./jsonOptions.json";

const spreadNS = GC.Spread.Sheets;

class BindingPathCellType extends GC.Spread.Sheets.CellTypes.Text {
  constructor() {
    super();
  }

  paint(ctx, value, x, y, w, h, style, context) {
    if (value === null || value === undefined) {
      let sheet = context.sheet,
        row = context.row,
        col = context.col;
      if (sheet && (row === 0 || !!row) && (col === 0 || !!col)) {
        let bindingPath = sheet.getBindingPath(context.row, context.col);
        if (bindingPath) {
          value = "[" + bindingPath + "]";
        }
      }
    }
    super.paint(ctx, value, x, y, w, h, style, context);
  }
}

export default {
  data() {
    return {
      hostClass: "spread-host",
      autoGenerateColumns: true,
      width: 300,
      visible: true,
      resizable: true,
      formatter: "$ #.00",
      spread: null,
      sheet: null,
      deviceArr: [
        {
          text: "仪器一",
          value: "item1",
          model: "001",
          number: "1001",
        },
        {
          text: "仪器二",
          value: "item2",
          model: "002",
          number: "1002",
        },
        {
          text: "仪器三",
          value: "item3",
          model: "003",
          number: "1003",
        },
        {
          text: "仪器四",
          value: "item4",
          model: "004",
          number: "1004",
        },
      ],
      data: {
        taskNum: "100011",
        projectName: "SpreadJS集成测试项目",
        weather: "多云转晴",
      },
    };
  },
  computed: {
    dataTable() {
      let dataTable = [];
      for (let i = 0; i < 42; i++) {
        dataTable.push({ price: i + 0.56 });
      }
      return dataTable;
    },
  },
  methods: {
    addRow() {
      console.log("加一行");
      this.sheet.addRows(
        this.sheet.getRowCount(GC.Spread.Sheets.SheetArea.viewport),
        1
      );
    },
    deleteRow() {
      console.log("减一行");
      this.sheet.deleteRows(
        this.sheet.getRowCount(GC.Spread.Sheets.SheetArea.viewport) - 1,
        1
      );
    },
    setData() {
      let that = this;
      this.sheet.setText(2, 1, "设置文本");
      // 表格数据绑定
      let bindingPathCellType = new BindingPathCellType();
      this.sheet
        .getCell(2, 1)
        .bindingPath("projectName")
        .cellType(bindingPathCellType);

      let dataSource = new GC.Spread.Sheets.Bindings.CellBindingSource({
        taskNum: "100011",
        projectName: "SpreadJS集成测试项目",
        weather: "多云转晴",
        measurePoint: [{}],
        measuringPeople: "田春乐",
        checkPeople: "黄世凯",
        auditPeople: "田春乐",
      });
      this.sheet.setDataSource(dataSource);
    },
    getData() {
      // 获取绑定的数据
      console.log("绑定的数据：", this.sheet.getDataSource().getSource());
    },
    onItemSelected(i) {
      console.log(i);
    },
    //  初始化方法
    initSpread(spread) {
      let that = this;
      console.log("spread:", spread);
      this.spread = spread;

      console.log("spread.options", spread.options);

      spread.fromJSON(jsonStr, jsonOptions);
      spread.setSheetCount(2);
      spread.options = Object.assign(spread.options, {
        showHorizontalScrollbar: false,
        showVerticalScrollbar: false,
        allowUserResize: false,
        allowUserDragDrop: false,
      });
      // 通过使用 suspendPaint/resumePaint 方法你可以提升渲染性能。 Suspend Paint 和 Resume Paint用于在耗时的更新期间暂停和恢复绘制以提高渲染性能。
      spread.suspendPaint();

      //init Status Bar
      let statusBar = new GC.Spread.Sheets.StatusBar.StatusBar(
        document.getElementById("statusBar")
      );
      statusBar.bind(spread);

      // // 解绑
      // statusBar.unbind();
      // // 移除
      // statusBar.dispose();

      spread.resumePaint();

      // spread.options.showHorizontalScrollbar = false;

      // let verticalStyle = new GC.Spread.Sheets.Style();
      // verticalStyle.cellButtons = [
      //   {
      //     imageType: GC.Spread.Sheets.ButtonImageType.dropdown,
      //     command: "openList",
      //     useButtonStyle: false,
      //   },
      // ];
      // verticalStyle.dropDowns = [
      //   {
      //     type: GC.Spread.Sheets.DropDownType.list,
      //     option: {
      //       multiSelect: false,
      //       items: that.deviceArr,
      //     },
      //   },
      // ];

      let sheet = spread.getSheet(0);
      that.sheet = sheet;
      console.log("sheet:", sheet);

      const combo = new spreadNS.CellTypes.ComboBox();
      combo
        .items(that.deviceArr)
        .editorValueType(spreadNS.CellTypes.EditorValueType.value);
      sheet
        .getCell(3, 2, spreadNS.SheetArea.viewport)
        .cellType(combo)
        .value("item4");

      // 编辑事件
      sheet.bind(GC.Spread.Sheets.Events.EditChange, function (sender, args) {
        console.log(
          "Cell (" + args.row + ", " + args.col + ") EditChange.",
          sender,
          args
        );
      });

      sheet.bind(spreadNS.Events.SelectionChanged, (sender, args) => {
        console.log("spreadNS.Events.SelectionChanged", sender, args);
      });
      // 数据改变事件
      // sheet.bind(GC.Spread.Sheets.Events.ValueChanged, function (sender, args) {
      //   console.log(
      //     "Cell (" + args.row + ", " + args.col + ") ValueChanged.",
      //     sender,
      //     args,
      //     args.newValue,
      //     args.oldValue
      //   );

      //   let device = that.deviceArr.find((i) => i.value == args.newValue);
      //   console.log(device);
      //   sheet.setText(args.row, args.col, device.text);
      //   sheet.setText(args.row + 1, args.col, "hahahahahaha");
      // });

      // 解绑事件监听
      // sheet.unbind(GC.Spread.Sheets.Events.ValueChanged);

      // 暂停事件监听
      // sheet.suspendEvent();
      // 重启事件监听
      // sheet.resumeEvent();

      // 添加一个按钮
      let style = sheet.getStyle(7, 12) || new GC.Spread.Sheets.Style();
      style.cellButtons = [
        {
          useButtonStyle: true,
          caption: "+",
          command: function (i) {
            console.log("按钮点击：", i);
            sheet.options.showFormulas = !sheet.options.showFormulas;
            if (sheet.options.showFormulas) {
              style.cellButtons[0].imageType =
                GC.Spread.Sheets.ButtonImageType.ok;
            } else {
              style.cellButtons[0].imageType =
                GC.Spread.Sheets.ButtonImageType.none;
            }
          },
        },
      ];
      sheet.setStyle(7, 12, style);

      // 设置列宽  '2*' '3*'
      sheet.setColumnWidth(7, 100);

      // let sheet = this.spread.getActiveSheet();
      sheet.setColumnCount(13);
      sheet.setRowCount(20);

      // sheet.setStyle(3, 2, verticalStyle);
    },
  },

  mounted() {},
  created() {
    // let spread = this.spread;
    // spread.fromJSON(jsonStr, jsonOptions);
  },
};
</script>
<style scoped>
.spread-host {
  height: calc(100vh - 80px);
}
</style>


                    