package com.grapecity.reportserver.Controller;

import com.google.gson.Gson;
import com.grapecity.reportserver.Model.RecordModel;
import com.grapecity.reportserver.Model.TaskModel;
import com.grapecity.reportserver.Model.TemplateModel;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping({"task"})
public class TaskController {
    private static final long taskTemplateID = 111111111;
    private static final long recordTemplateID = 222222222;
    private static final long reportTemplateID = 333333333;

    @CrossOrigin
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public String list() {
        return TaskModel.list();
    }

    // 获取模板
    @CrossOrigin
    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public String get(@RequestParam(value = "type", required = false) String type) {
        long id = taskTemplateID;
        String name = "委托单模板";
        switch (type){
            case "record":
                id = recordTemplateID;
                name = "实验记录模板";
                break;
            case "report":
                id = reportTemplateID;
                name = "报告单模板";
                break;
        }
        System.out.println(id + "-" + type);
        String template = TemplateModel.get(String.valueOf(id));
        if(template.equals("")){
            TemplateModel.add(id, name, "".getBytes());
            TemplateModel emptyTemplate = new TemplateModel();
            emptyTemplate.ID = id;
            emptyTemplate.Name = name;
            Gson gson = new Gson();
            return  gson.toJson(emptyTemplate);
        }
        return template;
    }

    // 保存模板
    @CrossOrigin
    @RequestMapping(value = "/update", headers = ("content-type=multipart/form-data"), method = RequestMethod.POST)
    public String update(@RequestParam(value = "id", required = false) String id,
                         @RequestParam("name") String name,
                         @RequestParam("templateJSON") MultipartFile templateJSON) throws IOException {

        if(name == null || name.isEmpty() || templateJSON == null || templateJSON.isEmpty()){
            return "";
        }

        if(id == null || id.isEmpty()){
            return TemplateModel.add(name, templateJSON.getBytes());
        }
        return TemplateModel.update(id, name, templateJSON.getBytes());
    }

    @CrossOrigin
    @RequestMapping(value = "/new", method = RequestMethod.POST)
    public String template(@RequestParam(value = "testCompany", required = true) String testCompany,
                           @RequestParam(value = "testName", required = true) String testName) {

        TaskModel newTask = new TaskModel();
        newTask.TestName = testName;
        newTask.TestCompany = testCompany;
        newTask.ID = System.currentTimeMillis();
        newTask.TaskNumber = "WTD" + newTask.ID;

        return TaskModel.add(newTask);
    }


    @CrossOrigin
    @RequestMapping(value = "/getTask", method = RequestMethod.GET)
    public String getTask(@RequestParam(value = "id", required = true) String id,
                          @RequestParam(value = "type", required = true) String type) {

        TaskModel task = TaskModel.getObject(id);
        if(task == null){
            return "";
        }
        if(type.equals("task") || type.equals("report")) {
            TemplateModel taskTemplate = TemplateModel.getObject(String.valueOf(taskTemplateID));
            if (taskTemplate != null) {
                task.TaskTemplateContent = taskTemplate.Content;
            }
        }

        if (task.TaskRecordID != null) {
            RecordModel record = RecordModel.getObject(task.TaskRecordID);
            if (record != null) {
                task.TaskContent = record.Content;
            }
        }

        if(type.equals("record") || type.equals("report")) {
            TemplateModel recordTemplate = TemplateModel.getObject(String.valueOf(recordTemplateID));
            if (recordTemplate != null) {
                task.RecordTemplateContent = recordTemplate.Content;
            }
            if (task.RecordRecordID != null) {
                RecordModel record = RecordModel.getObject(task.RecordRecordID);
                if (record != null) {
                    task.RecordContent = record.Content;
                }
            }
        }

        if(type.equals("report")){
            TemplateModel reportTemplate = TemplateModel.getObject(String.valueOf(reportTemplateID));
            if (reportTemplate != null) {
                task.ReportTemplateContent = reportTemplate.Content;
            }
        }
        Gson gson = new Gson();
        return  gson.toJson(task);
    }

    @CrossOrigin
    @RequestMapping(value = "/saveTask", headers = ("content-type=multipart/form-data"), method = RequestMethod.POST)
    public String saveTask(@RequestParam(value = "id", required = true) String id,
                           @RequestParam(value = "type", required = true) String type,
                           @RequestParam("content") MultipartFile content,
                           @RequestParam(value = "fullContent", required = false) MultipartFile fullContent) throws IOException {

        TaskModel task = TaskModel.getObject(id);
        if(task == null){
            return "";
        }
        byte[] contentData = content != null ? content.getBytes() : null;
        byte[] fullContentData = fullContent != null ? fullContent.getBytes() : null;

        if(type.equals("task")) {
            if (task.TaskRecordID == null || task.TaskRecordID.isEmpty()) {
                task.TaskRecordID = RecordModel.add(task.TaskNumber, String.valueOf(taskTemplateID), contentData, fullContentData);
                TaskModel.updateTaskRecordID(id, task.TaskRecordID);
            }
            RecordModel.update(task.TaskRecordID, task.TaskNumber, String.valueOf(taskTemplateID), contentData, fullContentData);
        }
        else if(type.equals("record")) {
            if (task.RecordRecordID == null || task.RecordRecordID.isEmpty()) {
                task.RecordRecordID = RecordModel.add(task.TaskNumber, String.valueOf(recordTemplateID), contentData, fullContentData);
                TaskModel.updateRecordRecordID(id, task.RecordRecordID);
            }
            RecordModel.update(task.RecordRecordID, task.TaskNumber, String.valueOf(recordTemplateID), contentData, fullContentData);
        }
        return  id;
    }
}
