package com.grapecity.reportserver.Controller;


import com.grapecity.reportserver.Model.TemplateModel;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping({"template"})
public class TemplateController {



    @CrossOrigin
    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public String list() {
        return TemplateModel.list();
    }

    @CrossOrigin
    @RequestMapping(value = "/get", method = RequestMethod.GET)
    public String get(@RequestParam("id") String id) {
        if (id.isEmpty()) {
            return "";
        }
        return TemplateModel.get(id);
    }

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

}
