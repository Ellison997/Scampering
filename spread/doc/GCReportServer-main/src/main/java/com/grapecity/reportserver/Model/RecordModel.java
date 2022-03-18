package com.grapecity.reportserver.Model;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.grapecity.documents.excel.*;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.stream.Collectors;

public class RecordModel {

    private static final String path = "record";
    static Type collectionType = new TypeToken<Collection<RecordModel>>() {  }.getType();

    public long ID;
    public String Name;
    public String TemplateID;
    public String Content;
    public String FileName;
    public String FullContentFileName;
    public String FullContent;


    public static String list(String templateID){
        String listJSON = DataModel.getData(path);
        if(templateID ==null || templateID.isEmpty() || listJSON.isEmpty()){
            return "";
        }
        Gson gson = new Gson();
        Type collectionType = new TypeToken<Collection<RecordModel>>() { }.getType();
        Collection<RecordModel>  list = gson.fromJson(listJSON, collectionType);
        list =  list.stream().filter(r -> r.TemplateID.equals(templateID)).collect(Collectors.toList());

        return gson.toJson(list);
    }


    public static String add(String name,String templateID, byte[] content, byte[] fullContent){

        RecordModel record = new RecordModel();
        record.ID = System.currentTimeMillis();
        record.Name = name;
        record.TemplateID = templateID;
        record.FileName = path + "-"  + templateID +  "-" + record.ID+ ".json";
        record.FullContentFileName = path + "-"  + templateID +  "-" + record.ID+ ".ssjson";

        DataModel.addDataWithFullFile(collectionType, path, record, record.FileName, content, record.FullContentFileName, fullContent);

        return String.valueOf(record.ID);
    }

    public static String update(String id, String name, String templateId, byte[] content, byte[] fullContent) {
        Collection<RecordModel> list = DataModel.getDataObject(collectionType, path);
        RecordModel record = list.stream().filter(t -> String.valueOf(t.ID).equals(id)).findFirst().orElse(null);
        if(record != null){
            record.Name = name;
            record.TemplateID = templateId;
            DataModel.saveDataObject(path, list);
            DataModel.addFile(path, record.FileName, content);
            DataModel.addFile(path, record.FullContentFileName, fullContent);
            return id;
        }
        return "";
    }


    public static String getAll(String templateID){
        String listJSON = DataModel.getData(path);
        if(templateID ==null || templateID.isEmpty() || listJSON.isEmpty()){
            return "";
        }
        Gson gson = new Gson();
        Type collectionType = new TypeToken<Collection<RecordModel>>() { }.getType();
        Collection<RecordModel>  list = gson.fromJson(listJSON, collectionType);
        list =  list.stream().filter(r -> r.TemplateID.equals(templateID)).collect(Collectors.toList());
        final String[] listString = {"["};

        list.forEach(r -> {
            if(r.FileName !=null){
                String content = DataModel.getFile(path, r.FileName);
                if(!content.isEmpty()){
                    listString[0] += (DataModel.unCompress(content) + ",");
                }
            }
        });
        if(listString[0].indexOf(",") > 0){
            listString[0] = listString[0].substring(0 ,listString[0].length() - 1);
        }
        listString[0] += "]";

        return listString[0];
    }

    public static String getTotalReport(String templateID) {
        String listJSON = DataModel.getData(path);
        if (templateID == null || templateID.isEmpty() || listJSON.isEmpty()) {
            return "";
        }
        Gson gson = new Gson();
        Type collectionType = new TypeToken<Collection<RecordModel>>() {
        }.getType();
        Collection<RecordModel> list = gson.fromJson(listJSON, collectionType);
        list = list.stream().filter(r -> r.TemplateID.equals(templateID)).collect(Collectors.toList());

        Workbook workbook = new Workbook();
        TemplateModel template = TemplateModel.getObject(templateID);
        String templateJSON = DataModel.unCompress(template.Content);
        workbook.fromJson(templateJSON);
        IWorksheet sheet = workbook.getActiveSheet();
        ArrayList<String> bindPathList = new ArrayList<>();
        IRange usedRange = sheet.getUsedRange();
        for(int row = usedRange.getRow(); row < usedRange.getRow() + usedRange.getRowCount(); row++){
            for(int col = usedRange.getColumn(); col < usedRange.getColumn() + usedRange.getColumnCount(); col++){
                IRange range = sheet.getRange(row, col);
                String bindingPath = range.getBindingPath();
                if(bindingPath != null){
                    bindPathList.add(range.toString());
                    if(bindingPath.equals("RecordName")){
                        range.setValue("合计报告");
                    }
                    else{
                        range.setValue(0);
                    }
                }
            }
        }

        if(!bindPathList.isEmpty()) {
            list.forEach(r -> {
                if (r.FileName != null) {
                    String content = DataModel.getFile(path, r.FullContentFileName);
                    if (!content.isEmpty()) {
                        Workbook recordWorkbook = new Workbook();
                        recordWorkbook.fromJson(DataModel.unCompress((content)));
                        IWorksheet recordWorksheet = recordWorkbook.getActiveSheet();
                        bindPathList.forEach(path -> {
                            try {
                                Object newValue = recordWorksheet.getRange(path).getValue();
                                Object oldValue = sheet.getRange(path).getValue();
                                sheet.getRange(path).setValue((Double) newValue + (Double) oldValue);
                            }
                            catch (Exception ignored) {
                            }
                        });
                        recordWorksheet.setName(r.Name);
                        recordWorkbook.getWorksheets().add();
                        recordWorksheet.move(workbook);
                    }
                }
            });
        }
        sheet.setName("合计报告");
        return DataModel.compress(workbook.toJson());
    }
    public static RecordModel getObject(String id){
        Collection<RecordModel> list = DataModel.getDataObject(collectionType, path);
        RecordModel template = list.stream().filter(t -> String.valueOf(t.ID).equals(id)).findFirst().orElse(null);
        if(template != null){
            template.Content = DataModel.getFile(path, template.FileName);
        }
        return template;
    }

    public static String get(String id){
        RecordModel template = getObject(id);
        if(template != null){
            Gson gson = new Gson();
            return  gson.toJson(template);
        }
        return "";
    }

}
