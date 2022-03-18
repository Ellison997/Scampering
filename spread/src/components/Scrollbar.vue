<template>
  <div class="sample-tutorial">
    <gc-spread-sheets
      class="sample-spreadsheets"
      @workbookInitialized="initSpread"
    >
      <gc-worksheet></gc-worksheet>
    </gc-spread-sheets>
    <div class="options-container">
      <div class="option-row">
        <label>showScrollTip:</label>
        <select id="optShowScrollTip" @change="showScrollTip($event)">
          <option value="0" selected="selected">None</option>
          <option value="1">Horizontal</option>
          <option value="2">Vertical</option>
          <option value="3">Both</option>
        </select>
      </div>
      <hr />
      <div class="option-row">
        <input
          type="checkbox"
          id="showHorizontalScrollbar"
          checked="checked"
          @change="showHorizontalScrollbar($event)"
        />
        <label for="showHorizontalScrollbar">Show Horizontal Scrollbar</label>
      </div>
      <div class="option-row">
        <input
          type="checkbox"
          id="showVerticalScrollbar"
          checked="checked"
          @change="showVerticalScrollbar($event)"
        />
        <label for="showVerticalScrollbar">Show Vertical Scrollbar</label>
      </div>
      <div class="option-row">
        <input
          type="checkbox"
          id="scrollbarMaxAlign"
          @change="scrollbarMaxAlign($event)"
        />
        <label for="scrollbarMaxAlign">Scrollbar Max Align</label>
      </div>
      <label
        >Set this to restrict the scrolling to the max number of
        rows/columns.</label
      >
      <div class="option-row">
        <input
          type="checkbox"
          id="scrollbarShowMax"
          checked="checked"
          @change="scrollbarShowMax($event)"
        />
        <label for="scrollbarShowMax">Scrollbar Show Max</label>
      </div>
      <label>Set this to have the scrollbar show the max scroll space.</label>
      <hr />
      <div class="option-row">
        <input
          type="checkbox"
          id="scrollIgnoreHidden"
          @change="scrollIgnoreHidden($event)"
        />
        <label for="scrollIgnoreHidden">Scroll Ignore Hidden</label>
      </div>
    </div>
  </div>
</template>

<script>
import "@grapecity/spread-sheets-resources-zh";
GC.Spread.Common.CultureManager.culture("zh-cn");
import "@grapecity/spread-sheets-vue";
import GC from "@grapecity/spread-sheets";
import "./styles.css";

export default {
  data() {
    return {
      autoGenerateColumns: false,
      spread: null,
    };
  },
  methods: {
    initSpread: function (spread) {
      this.spread = spread;
    },
    showScrollTip(e) {
      let spread = this.spread;
      var result = parseInt(e.target.value);
      spread.options.showScrollTip = result;
    },
    showHorizontalScrollbar(e) {
      let spread = this.spread;
      console.log(e.target.checked);
      spread.options.showHorizontalScrollbar = e.target.checked;
    },
    showVerticalScrollbar(e) {
      let spread = this.spread;
      spread.options.showVerticalScrollbar = e.target.checked;
    },
    scrollbarMaxAlign(e) {
      let spread = this.spread;
      spread.options.scrollbarMaxAlign = e.target.checked;
    },
    scrollbarShowMax(e) {
      let spread = this.spread;
      spread.options.scrollbarShowMax = e.target.checked;
    },
    scrollIgnoreHidden(e) {
      let spread = this.spread;
      spread.options.scrollIgnoreHidden = e.target.checked;
    },
  },
};
</script>