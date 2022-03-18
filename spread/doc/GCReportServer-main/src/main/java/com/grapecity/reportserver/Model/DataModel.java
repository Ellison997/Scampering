package com.grapecity.reportserver.Model;

import com.google.gson.Gson;
import org.springframework.util.ResourceUtils;

import javax.json.*;
import java.io.*;
import java.lang.reflect.Type;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collection;
import java.util.zip.GZIPInputStream;
import java.util.zip.GZIPOutputStream;

public class DataModel {

    private static final String dataPath = "src/main/resources/database/";
    private static final String dataFileName = "/data.json";



    public static String getData(String path){
        if(path != null && !path.isEmpty()) {
            try {
                checkPath(dataPath + path);
                String jsonPath = dataPath + path + dataFileName;
                File file = ResourceUtils.getFile(jsonPath);
                if(!file.exists()){
                    return "";
                }
                String encoding = "UTF-8";
                long fileLength = file.length();
                byte[] fileContent = new byte[(int) fileLength];
                FileInputStream in = new FileInputStream(file);
                in.read(fileContent);
                in.close();
                return new String(fileContent, encoding);
            } catch (Exception ignored) {

            }
        }
        return "";
    }

    public static void saveData(String path, String data){
        if(path != null && !path.isEmpty()) {
            try {
                checkPath(dataPath + path);
                String jsonPath = dataPath + path + dataFileName;
                Files.write(Paths.get(jsonPath), data.getBytes());

            } catch (Exception ignored) {

            }
        }
    }


    public  static <T> Collection<T> getDataObject(Type collectionType, String path){
        Gson gson = new Gson();
        Collection<T> list;
        String dataJSON = getData(path);
        if(dataJSON.isEmpty()){
            list = new ArrayList<>();
        }
        else {
            list = gson.fromJson(dataJSON, collectionType);
        }
        return list;
    }

    public static <T> void saveDataObject(String path, Collection<T> list){
        Gson gson = new Gson();
        String json = gson.toJson(list);
        saveData(path, json);
    }

    public static <T> void addData(Type collectionType, String path, T data){
        Gson gson = new Gson();
        Collection<T> list = getDataObject(collectionType, path);
        list.add(data);
        saveDataObject(path, list);
    }

    public static <T> void addDataWithFile(Type collectionType,String path, T data, String fileName, byte[] content){
        addData(collectionType, path, data);
        addFile(path, fileName, content);
    }

    public static <T> void addDataWithFullFile(Type collectionType,String path, T data, String fileName, byte[] content, String fullContentFileName, byte[] fullContent){
        addDataWithFile(collectionType, path, data, fileName, content);
        addFile(path, fullContentFileName, fullContent);
    }

    public static void addFile(String path, String name, byte[] content){
        if(path != null && !path.isEmpty() && name != null  && content != null) {
            String filePath = dataPath + path;
            checkPath(filePath);

            try {
                filePath = filePath + "/" + name;

                Files.write(Paths.get(filePath), content);
            } catch (IOException e) {
                e.printStackTrace();
            }

        }
    }

    public static String getFile(String path, String name){
        if(path != null && !path.isEmpty()) {
            try {
                String filePath = dataPath + path+ "/" + name;
                File file = ResourceUtils.getFile(filePath);
                String encoding = "UTF-8";
                long fileLength = file.length();
                byte[] fileContent = new byte[(int) fileLength];
                FileInputStream in = new FileInputStream(file);
                in.read(fileContent);
                in.close();
                return new String(fileContent, encoding);
            } catch (IOException ignored) {

            }

        }
        return "";
    }

    public static String list(String path){
        if(path != null && !path.isEmpty()) {
            try {
                String filePath = dataPath + path;
                checkPath(filePath);
                File reportDir = ResourceUtils.getFile(filePath);
                File[] files = reportDir.listFiles();
                if(files != null && files.length > 0) {
                    JsonArrayBuilder jsonArray = Json.createArrayBuilder();
                    for (File file : files) {
                        if (file.isFile() && !file.isHidden()) {
                            jsonArray.add(Json.createObjectBuilder()
                                    .add("Name", file.getName())
                                    .add("Path", path));
                        }
                    }
                    return jsonArray.build().toString();
                }

            } catch (IOException e) {
                e.printStackTrace();
            }

        }
        return "";
    }

    public static void checkPath(String path){

        try {
            File dir = ResourceUtils.getFile(path);
            if(!dir.exists()){
                dir.mkdirs();
            }
        }
        catch (Exception e){
            e.printStackTrace();
        }
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

    public static String unCompress(String str) {
        if (str.length() <= 0) {
            return str;
        }
        try {
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ByteArrayInputStream in = new ByteArrayInputStream(str.getBytes("ISO-8859-1"));
            GZIPInputStream ungzip = new GZIPInputStream(in);
            byte[] buffer = new byte[256];
            int n;
            while ((n = ungzip.read(buffer)) >= 0) {
                out.write(buffer, 0, n);
            }
            return new String(out.toByteArray(), "UTF-8");
        } catch (Exception e) {

        }
        return str;
    }
}
