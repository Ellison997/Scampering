import {getImageBase64} from '../../utils/common'
import * as GC from "@grapecity/spread-sheets";


function processLock(sheet, rule) {
    sheet.suspendPaint();
    sheet.options.isProtected = true;
    for (var row = 0; row < sheet.getRowCount(); row++) {
        for (var col = 0; col < sheet.getColumnCount(); col++) {
            var cell = sheet.getCell(row, col);
            if (cell.bindingPath()) {
                if (rule) {
                    var tag = cell.tag();
                    if (tag && tag.rule) {
                        if (tag.rule[rule]) {
                            cell.locked(false)
                            cell.backColor("lightblue")
                        }
                        else{
                            cell.locked(true);
                        }
                    }
                    else {
                        cell.locked(false)
                        cell.backColor("lightblue")
                    }
                }
                else {
                    cell.locked(true);
                }
            }
        }
    }
    sheet.resumePaint();
}
function getSpanInfo(sheet, row, col) {
    var spans = sheet.getSpans(new GC.Spread.Sheets.Range(row, col, 1, 1));
    if (spans && spans.length) {
        var span = spans[0]
        if(span.row === row, span.col === col){
            var width = 0, height = 0;
            for (var i = span.row; i < span.row + span.rowCount; i++) {
                height += sheet.getRowHeight(i)
            }
            for (var i = span.col; i < span.col + span.colCount; i++) {
                width += sheet.getColumnWidth(i)
            }
            return {
                width, height
            }
        }
        else{
            return null
        }
    }
    else {
        return {
            width: sheet.getColumnWidth(col),
            height: sheet.getRowHeight(row)
        }
    }
}
function getCellInfo(sheet, row, col) {

    var width = 0, height = 0;
    for (var i = 0; i < row; i++) {
        height += sheet.getRowHeight(i)
    }
    for (var i = 0; i < col; i++) {
        width += sheet.getColumnWidth(i)
    }

    return { width, height }
}

async function addCellImage(sheet, row, col, url, imageName){
    var spanInfo = getSpanInfo(sheet, row, col)
    var cellInfo = getCellInfo(sheet, row, col)
    var src = await getImageBase64(url)
    if (src) {
        var picture = sheet.pictures.add(imageName || sheet.name() + sheet.pictures.all().length, src, cellInfo.width + 2, cellInfo.height + 2, spanInfo.width - 4, spanInfo.height - 4);
    }
    return src
}


async function processCellImage(sheet) {
    sheet.suspendPaint();
    for (var row = 0; row < sheet.getRowCount(); row++) {
        for (var col = 0; col < sheet.getColumnCount(); col++) {
            var cell = sheet.getCell(row, col), tag = cell.tag(), value = cell.value();
            if (tag && tag["signature"] && value) {
                var spanInfo = getSpanInfo(sheet, row, col)
                if(spanInfo){
                    var cellInfo = getCellInfo(sheet, row, col)
                    var src = value;
                    if(value.indexOf("data:image") < 0){
                        value = "/signatures/" + value + ".png";
                        var src = await getImageBase64(value)
                    }
                    if (src) {
                        var picture = sheet.pictures.add(sheet.name() + sheet.pictures.all().length, src, cellInfo.width + 2, cellInfo.height + 2, spanInfo.width - 4, spanInfo.height - 4);
                    }
                }
                // picture.startRow(row);
                // picture.startColumn(col)
                // picture.width(spanInfo.width);
                // picture.height(spanInfo.height)
            }
        }
    }
    sheet.resumePaint();
}
function setViewMode(spread){
    spread.suspendPaint();
    let sheet = spread.getActiveSheet();
    sheet.options.rowHeaderVisible = false;
    sheet.options.colHeaderVisible = false;
    sheet.options.gridline.showHorizontalGridline = false;
    sheet.options.gridline.showVerticalGridline = false;
    
    spread.options.scrollbarMaxAlign = true;
    spread.options.scrollbarShowMax = true;
    spread.options.tabStripVisible = false;
    // disable the vertical scrollbar
    spread.options.showVerticalScrollbar = false;
    // disable the horizontal scrollbar
    spread.options.showHorizontalScrollbar = false;
    spread.resumePaint();
}

function copyTableStyle(sheet, table){
    var range = table.dataRange();
    var rowHeight = sheet.getRowHeight(range.row);
    for (var i = 1; i < range.rowCount; i++) {
        // Copy Style
        sheet.copyTo(range.row + i - 1, range.col, range.row + i, range.col, 1, range.colCount, GC.Spread.Sheets.CopyToOptions.style);
        // Copy Formula
        sheet.copyTo(range.row + i - 1, range.col, range.row + i, range.col, 1, range.colCount, GC.Spread.Sheets.CopyToOptions.formula);
        // Copy Span
        sheet.copyTo(range.row + i - 1, range.col, range.row + i, range.col, 1, range.colCount, GC.Spread.Sheets.CopyToOptions.span);
        // Set Row Height
        sheet.setRowHeight(range.row + i, rowHeight);
    }
}

function processTable(sheet, locked, data){
    sheet.suspendPaint();
    sheet.tables.all().forEach(table => {
        
        if(data){
            let bindingPath = table.bindingPath();
            if(bindingPath && data[bindingPath] && data[bindingPath].length > 0){
                let range = table.range(),
                    dataRange= table.dataRange();
                range.rowCount = range.rowCount - dataRange.rowCount + data[bindingPath].length;
                sheet.tables.resize(table, range);
            }
        }
        copyTableStyle(sheet, table)
        if(!locked){
            let range = table.dataRange();
            sheet.getRange(range.row, range.col, range.rowCount, range.colCount).locked(false);
        }
    });
    sheet.resumePaint();
}


export {
    processCellImage,
    processLock,
    setViewMode,
    processTable,
    addCellImage
}