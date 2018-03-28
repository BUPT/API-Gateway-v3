import * as path from "path";
class Config{
    private _baseDir = path.join(__dirname, "../../");
    private _storage = {
        "host": '******',
        "user": '******',
        "password": '******',
        "database": '******',
        "protocol": "mysql",
        "port": "3306"
    };
    private _api_server = {
        "host": "www.linyimin.club",
        "port": "8000",
    }
    private _admin_server = {
        "host": "www.linyimin.club",
        "port": "8001",
    }
    private _path = {
        // API的swagger配置文件存放目录
        "swaggerDir": this._baseDir + "/views/uploads/swagger/",
        // 初始化注册API数据的swagger配置文件路径
        "swaggerFile": this._baseDir + "/views/uploads/swagger/swagger.yaml",
        // xml流程文件的存放目录
        "flowXMLDir": this._baseDir + "/views/uploads/xml/",
        "flowXMLFile": this._baseDir + "/views/uploads/xml/test.xml",
        // 管理员API的swagger配置文件路径
        "adminAPIsFile": this._baseDir + "/views/uploads/json/file.json",
        // 注册API的swagger UI的首页html路径
        "swaggerUIURL": "http://www.linyimin.club:8001/static/index.html",
        // 管理员API的swagger UI的首页HTML路径
        "adminAPIsURL": "http://www.linyimin.club:8001/static/viewAPIs.html",
        // 文件上传页面的HTML页面路径
        "uploadFileURL": this._baseDir + "/views/fileUpload.html",
        // 定义swagger注释的文件路径
        "defineSwaggerFile": this._baseDir + "/src/router/*.ts",
        // 静态文件目录
        "static": this._baseDir + "/views/",
        // 组合API流程文件目录
        "combinationFileDir": this._baseDir + "/views/uploads/json/",
        // 单个接口的swagger配置文件
        "singleSwaggerFile": this._baseDir + "/views/uploads/json/single.json",
        // 单个API的swagger UI的首页HTML路径
        "singleSwaggerFileURL": "http://www.linyimin.club:8001/static/single.html"
    }

    public getBaseDir(){
        return this._baseDir;
    }
    public getStorage(){
        return this._storage;
    }

    public getApiServer(){
        return this._api_server;
    }
    public getAdminServer(){
        return this._admin_server;
    }
    public getPath(){
        return this._path;
    }
}

export{Config};
