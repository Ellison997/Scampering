package com.grapecity.reportserver.Model;

import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Collection;

public class TaskModel {

    private static final String path = "task";
    static Type collectionType = new TypeToken<Collection<TaskModel>>() {  }.getType();


    public long ID;
    public String TestName;
    public String TestCompany;
    public String TaskNumber;

    //委托单模板
    public String TaskTemplateContent;
    //填报单模板
    public String RecordTemplateContent;
    //报告表模板
    public String ReportTemplateContent;

    //委托单内容
    public String TaskRecordID;
    public String TaskContent;

    //填报单内容
    public String RecordRecordID;
    public String RecordContent;


    public static String list(){
        return DataModel.getData(path);
    }

    public static String add(TaskModel model){
        DataModel.addData(collectionType, path, model);
        return String.valueOf(model.ID);
    }


    public static String updateTaskRecordID(String id, String taskRecordID){
        Collection<TaskModel> list = DataModel.getDataObject(collectionType, path);
        TaskModel record = list.stream().filter(t -> String.valueOf(t.ID).equals(id)).findFirst().orElse(null);
        if(record != null){
            record.TaskRecordID = taskRecordID;
            DataModel.saveDataObject(path, list);
            return id;
        }
        return "";
    }

    public static String updateRecordRecordID(String id, String recordRecordID){
        Collection<TaskModel> list = DataModel.getDataObject(collectionType, path);
        TaskModel record = list.stream().filter(t -> String.valueOf(t.ID).equals(id)).findFirst().orElse(null);
        if(record != null){
            record.RecordRecordID = recordRecordID;
            DataModel.saveDataObject(path, list);
            return id;
        }
        return "";
    }

    public static TaskModel getObject(String id){
        Collection<TaskModel> list = DataModel.getDataObject(collectionType, path);
        return list.stream().filter(t -> String.valueOf(t.ID).equals(id)).findFirst().orElse(null);
    }
}
