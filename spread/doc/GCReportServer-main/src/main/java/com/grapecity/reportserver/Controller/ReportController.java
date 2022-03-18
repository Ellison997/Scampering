package com.grapecity.reportserver.Controller;


import com.google.gson.Gson;

import com.google.gson.reflect.TypeToken;
import com.grapecity.documents.excel.*;
import com.grapecity.documents.excel.extension.*;
import com.grapecity.documents.excel.drawing.IShape;
import com.grapecity.documents.excel.drawing.ImageType;
import com.grapecity.reportserver.Model.DataModel;
import com.grapecity.reportserver.Model.MocData.CertificateRecord;
import com.grapecity.reportserver.Model.RecordModel;
import com.grapecity.reportserver.Model.TemplateModel;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.lang.reflect.Type;
import java.util.Base64;
import java.util.Collection;
import java.util.EnumSet;
import java.util.stream.Collectors;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

@RestController
@RequestMapping({"report"})
public class ReportController {

    public ReportController(){
//        Workbook.FontsFolderPath = "/Users/dexteryao/Documents/Projects/IdeaProjects/common/pdfFont";
    }

    @CrossOrigin
    @RequestMapping(value = "/bindPDF", method = RequestMethod.GET)
    public ResponseEntity<byte[]> bindPDF(@RequestParam("templateId") String templateId , @RequestParam(value = "recordId",required = false) String recordId) {
        if(templateId.isEmpty()){
            return null;
        }
        TemplateModel template = TemplateModel.getObject(templateId);
        if(template == null || template.Content.isEmpty()){
            return null;
        }
        String templateJson = uncompress(template.Content);
        Workbook workbook = new Workbook();
        workbook.fromJson(templateJson);

        if(recordId != null && !recordId.isEmpty()){
            RecordModel record = RecordModel.getObject(recordId);
            if(record != null && !record.Content.isEmpty()) {
                String recordJson = uncompress(record.Content);
                IWorksheet sheet = workbook.getActiveSheet();
                Gson gson = new Gson();
                CertificateRecord data = gson.fromJson(recordJson, CertificateRecord.class);
                sheet.setDataSource(data);
            }
        }

        IWorksheet sheet = workbook.getActiveSheet();
        IRange dataRange = sheet.getUsedRange(EnumSet.of(UsedRangeType.Data));

        for(int row = dataRange.getRow(); dataRange.getRow() + row < dataRange.getRowCount(); row++) {
            for (int col = dataRange.getColumn(); col < dataRange.getColumn() + dataRange.getColumnCount(); col++) {
                IRange cell = sheet.getRange(row, col);
                if(cell.getTag() !=null && cell.getTag().equals("signature") && cell.getValue() != null){
                    try {
                        System.out.println(cell.getValue().toString());
                        byte[] image = Base64.getDecoder().decode(cell.getValue().toString().split(",")[1]);
                        InputStream stream = new ByteArrayInputStream(image);


                        double x = 0, y = 0;
                        for (int i = 0; i < row; i++) {
                            y += sheet.getRows().get(i).getHeight();
                        }
                        for (int i = 0; i < col; i++) {
                            x += sheet.getColumns().get(i).getWidth();
                        }

                        double width = 0, height = 0;

                        IRange span = cell.getMergeArea();
                        if(span!=null) {
                            for (int i = span.getRow(); i < span.getRow() + span.getRowCount(); i++) {
                                height += sheet.getRows().get(i).getRowHeight();
                            }
                            for (int i = span.getColumn(); i < span.getColumn() + span.getColumnCount(); i++) {
                                width += sheet.getColumns().get(i).getColumnWidth();
                            }
                        }
                        else {
                            width = cell.getColumnWidthInPixel();
                            height = cell.getRowHeight();
                        }

                        cell.getEntireColumn().setColumnWidth(20);

                        IShape picture = sheet.getShapes().addPicture(stream, ImageType.JPEG, x + 1, y + 1, cell.getColumnWidth() - 2, height - 2);
                        cell.setValue("");
                    }
                    catch (Exception ignored){
                        System.out.println(cell);
                    }
                }
            }
        }


        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.save(out, SaveFileFormat.Pdf);
        byte[] contents = out.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        // Here you have to set the actual filename of your pdf
        String filename = "output.pdf";
        headers.setContentDispositionFormData(filename, filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        ResponseEntity<byte[]> response = new ResponseEntity<>(contents, headers, HttpStatus.OK);
        return response;
    }


    @CrossOrigin
    @RequestMapping(value = "/getpdf", method = RequestMethod.POST)
    public ResponseEntity<byte[]> getPDF(@RequestParam(value = "data", required = true) MultipartFile data,
                                         @RequestParam(value = "isActiveSheet", required = false) boolean isActiveSheet) throws IOException {
        String json = uncompress(data);
        DataModel.addFile("log", "printPdf.ssjson", json.getBytes());
        Workbook workbook = new Workbook();
        workbook.fromJson(json);


        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.save(out, SaveFileFormat.Pdf);
        byte[] contents = out.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        // Here you have to set the actual filename of your pdf
        String filename = "output.pdf";
        headers.setContentDispositionFormData(filename, filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        ResponseEntity<byte[]> response = new ResponseEntity<>(contents, headers, HttpStatus.OK);
        return response;

    }


    @CrossOrigin
    @RequestMapping(value = "/getfullpdf", method = RequestMethod.POST)
    public ResponseEntity<byte[]> getfullpdf(@RequestParam(value = "content1", required = true) MultipartFile content1,
                                             @RequestParam(value = "content2", required = false) MultipartFile content2,
                                             @RequestParam(value = "content3", required = false) MultipartFile content3) {
        String json1 = uncompress(content1);
        DataModel.addFile("log", "content1.ssjson", json1.getBytes());
        Workbook workbook1 = new Workbook();
        workbook1.fromJson(json1);

        try {

            if (content2 != null) {
                String json2 = uncompress(content2);
                DataModel.addFile("log", "content1.ssjson", json2.getBytes());
                Workbook workbook2 = new Workbook();
                workbook2.fromJson(json2);
                workbook2.getWorksheets().add();
                workbook2.getActiveSheet().move(workbook1);
            }
            if (content3 != null) {
                String json3 = uncompress(content3);
                DataModel.addFile("log", "content1.ssjson", json3.getBytes());
                Workbook workbook3 = new Workbook();
                workbook3.fromJson(json3);
                workbook3.getWorksheets().add();
                workbook3.getActiveSheet().move(workbook1);
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }


        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook1.save(out, SaveFileFormat.Pdf);
        byte[] contents = out.toByteArray();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        // Here you have to set the actual filename of your pdf
        String filename = "output.pdf";
        headers.setContentDispositionFormData(filename, filename);
        headers.setCacheControl("must-revalidate, post-check=0, pre-check=0");
        ResponseEntity<byte[]> response = new ResponseEntity<>(contents, headers, HttpStatus.OK);
        return response;

    }


    public static String compress(String str) {
        if (str.length() <= 0) {
            return str;
        }
        try {
            ByteArrayOutputStream bos = null;
            GZIPOutputStream os = null; //使用默认缓冲区大小创建新的输出流
            byte[] bs = null;
            try {
                bos = new ByteArrayOutputStream();
                os = new GZIPOutputStream(bos);
                os.write(str.getBytes()); //写入输出流
                os.close();
                bos.close();
                bs = bos.toByteArray();
                return new String(bs, "ISO-8859-1");
            } finally {
                bs = null;
                bos = null;
                os = null;
            }
        } catch (Exception ex) {
            return str;
        }
    }

    public static  String uncompress(MultipartFile file){
        try {
            String content = new String(file.getBytes());
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ByteArrayInputStream in = new ByteArrayInputStream(content.getBytes("ISO-8859-1"));
            GZIPInputStream ungzip = new GZIPInputStream(in);

            InputStreamReader reader = new InputStreamReader(ungzip);

            byte[] buffer = new byte[256];
            int n;
            while ((n = ungzip.read(buffer)) >= 0) {
                out.write(buffer, 0, n);
            }
            return new String(out.toByteArray(), "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    public static String uncompress(String str) {
        if (str.length() <= 0) {
            return str;
        }
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ByteArrayInputStream in = new ByteArrayInputStream(str.getBytes("ISO-8859-1"));
            GZIPInputStream ungzip = new GZIPInputStream(in);

            InputStreamReader reader = new InputStreamReader(ungzip);

            byte[] buffer = new byte[256];
            int n;
            while ((n = ungzip.read(buffer)) >= 0) {
                out.write(buffer, 0, n);
            }
            return new String(out.toByteArray(), "UTF-8");
        } catch (Exception e) {
            e.printStackTrace();
        }
        return str;
    }
}
