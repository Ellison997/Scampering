package com.grapecity.reportserver.Model;


import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;

import java.lang.reflect.Type;
import java.util.Collection;

public class TemplateModel {

    private static final String path = "template";
    static Type collectionType = new TypeToken<Collection<TemplateModel>>() {  }.getType();

    public long ID;
    public String Name;
    public String FileName;
    public String Content;


    public static String list(){
        return DataModel.getData(path);
    }

    public static String add(String name, byte[] content){
        return add(System.currentTimeMillis(), name, content);
    }


    public static String add(long id, String name, byte[] content){

        TemplateModel template = new TemplateModel();
        template.ID = id;
        template.Name = name;
        template.FileName = path + template.ID + ".ssjson";

        DataModel.addDataWithFile(collectionType, path, template, template.FileName, content);

        return String.valueOf(template.ID);
    }


    public static String update(String id, String name, byte[] content) {
        Collection<TemplateModel> list = DataModel.getDataObject(collectionType, path);
        TemplateModel template = list.stream().filter(t -> String.valueOf(t.ID).equals(id)).findFirst().orElse(null);
        if(template != null){
            template.Name = name;
            DataModel.saveDataObject(path, list);
            DataModel.addFile(path, template.FileName, content);
            return id;
        }
        return "";
    }

    public static TemplateModel getObject(String id){
        Collection<TemplateModel> list = DataModel.getDataObject(collectionType, path);
        TemplateModel template = list.stream().filter(t -> String.valueOf(t.ID).equals(id)).findFirst().orElse(null);
        if(template != null){
            template.Content = DataModel.getFile(path, template.FileName);
        }
        return template;
    }

    public static String get(String id){
        TemplateModel template = getObject(id);
        if(template != null){
            Gson gson = new Gson();
            return  gson.toJson(template);
        }
        return "";
    }
}
