/**
 * @author: 林贻民
 * @description: 将swagger配置的yaml文件解析，返回url和API_info表字段对应的数组
 */

import fs = require("fs");
import yaml = require("yamljs");

class YamlParse{
    private _METHOD: string[] = ["get", "post", "put", "delete", "GET", "POST", "PUT", "DELETE"];
    
    /**
     * 加载yaml文件，并解析成JSON字符串
     * @param filePath yaml文件的路径
     */
    public loadFile(filePath: string): {[key: string]: any}{
        return yaml.parse(fs.readFileSync(filePath).toString());
    }

    /**
     * 解析JSON字段，构造API_info和url表批量插入数据数组
     * @param filePath 
     */
    public parse(filePath: string): {[key:string]: any}[][]{
        // 存储批量数据的二维数组
        let API_info: {[key:string]: string}[] = [];
        let url: {[key: string]: string}[] = [];
        let data: {[key: string]: any} = this.loadFile(filePath);
        // 基础URL
        let basePath: string = data.basePath;
        // 公司对应的ID
        let appId: string = data.info["x-appId"];
        // 真实服务器地址
        let realHost = data.info["x-realhost"];
        // 发布者姓名
        let publisher = data.info["x-publisher"];
        // API的ID
        let ID: string = "";
        // API名称
        let name: string = "";
        // API的类型
        let type: string = "";
        // API的参数
        let argument: string = "";
        // API触发的事件
        let event: string = "";
        // API的url
        let API: string = "";
        // API的状态，0正常服务，1暂停服务
        let status: string = "";
        // API是否加载进内存,0表示未加载，1表示已加载
        let is_new: string = "1";
        // API的访问方法
        let method: string = "";
        let paths:{[key: string]: any} = Object.keys(data.paths);
        for (let i = 0; i < paths.length; i++) {
            // 过滤"/swagger"路径
            if (paths[i] == "/swagger") {
                continue;
            }
            var pathsObject = data.paths[paths[i]];
            ID = pathsObject["x-ID"];
            name = pathsObject["x-name"];
            for (let j = 0; j < this._METHOD.length; j++) {
                if (pathsObject[this._METHOD[j]]) {
                    // API的访问方法
                    method = this._METHOD[j];
                    // API所处的类型
                    type = pathsObject[this._METHOD[j]].tags[0];
                    if (pathsObject[this._METHOD[j]].parameters) {
                        argument = JSON.stringify(pathsObject[this._METHOD[j]].parameters);
                    } else {
                        argument = null;
                    }
                    status = (pathsObject[this._METHOD[j]].deprecated == true) ? "1" : "0";
                    var operationID = pathsObject[this._METHOD[j]].operationId;
                    event = JSON.stringify([operationID + "Success", operationID + "fail"]);
                    break;
                }
            }
            API = ("/" != basePath) ? (basePath + paths[i]) : paths[i];
            API_info[i] = { 
                "ID": ID, 
                "name": name, 
                "type": type, 
                "argument": argument, 
                "event": event, 
                "URL": API, 
                "appId": appId,
                "status": status,
                "publisher": publisher
             };
            // 注册时间
            let timeString: string = new Date().toLocaleString();
            url[i] = {
                "from": API, 
                "to": realHost, 
                "status": status, 
                "is_new": is_new, 
                "appId": appId, 
                "is_atom": "1", 
                "register_time": timeString, 
                "method": method,
                "publisher": publisher
            };
        }
        return [url, API_info];
    }
}
export{YamlParse};