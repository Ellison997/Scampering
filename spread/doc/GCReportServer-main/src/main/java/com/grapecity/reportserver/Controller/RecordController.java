package com.grapecity.reportserver.Controller;


import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.grapecity.reportserver.Model.DataModel;
import com.grapecity.reportserver.Model.RecordModel;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.lang.reflect.Type;
import java.util.Collection;
import java.util.stream.Collectors;

@RestController
@RequestMapping({"record"})
public class RecordController {



    @CrossOrigin
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public String list(@RequestParam("templateId") String templateId) {
        return RecordModel.list(templateId);
    }

    @CrossOrigin
    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public String get(@RequestParam("id") String id) {
        if (id.isEmpty()) {
            return "";
        }
        return RecordModel.get(id);
    }

    @CrossOrigin
    @RequestMapping(value = "/update", headers = ("content-type=multipart/form-data"), method = RequestMethod.POST)
    public String update(@RequestParam(value = "id", required = false) String id,
                         @RequestParam("name") String name,
                         @RequestParam("templateId") String templateId,
                         @RequestParam("recordJSON") MultipartFile recordJSON,
                         @RequestParam("fullRecordJSON") MultipartFile fullRecordJSON) throws IOException {

        if(name == null || name.isEmpty()){
            return "";
        }

        byte[] recordJSONData = recordJSON != null ? recordJSON.getBytes() : null;
        byte[] fullRecordJSONData = recordJSON != null ? fullRecordJSON.getBytes() : null;

        if(id == null || id.isEmpty()){
            return RecordModel.add(name, templateId, recordJSONData, fullRecordJSONData);
        }
        return RecordModel.update(id, name, templateId, fullRecordJSONData, fullRecordJSONData);
    }


    @CrossOrigin
    @RequestMapping(value = "/getAll", method = RequestMethod.GET)
    public String getAll(@RequestParam("templateId") String templateId) {
        return RecordModel.getAll(templateId);
    }


    @CrossOrigin
    @RequestMapping(value = "/getTotalReport", method = RequestMethod.GET)
    public static String getTotalReport(String templateId) {
        return RecordModel.getTotalReport(templateId);
    }




}
