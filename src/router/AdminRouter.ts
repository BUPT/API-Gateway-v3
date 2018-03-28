import express = require("express");
let router = express.Router();

import {AdminPlugin} from "../plugin/AdminPlugin";
import {UserPlugin} from "../plugin/UserPlugin";
import {RegisterPlugin} from "../plugin/RegisterPlugin";
import { Config } from "../config/config";

import {CombinationPlugin} from "../plugin/CombinationPlugin";

import {PerformanceMonitorPlugin} from "../plugin/PerformanceMonitorPlugin";

class AdminRouter{
    private _router = router;
    public getRouter(){
        this.setRouter();
        return this._router;
    }
    public setRouter(){
        let config: Config = new Config();
        let adminPlugin: AdminPlugin = new AdminPlugin();
        let userPlugin: UserPlugin = new UserPlugin();
        let registerPlugin: RegisterPlugin = new RegisterPlugin();

        let combinationPlugin: CombinationPlugin = new CombinationPlugin();

        let performanceMonitor:PerformanceMonitorPlugin = new PerformanceMonitorPlugin();

        // 允许跨域访问
        this._router.all('*', adminPlugin.allowCORSAccess);
        //性能监控
        this._router.all('*',performanceMonitor.logPerformanceMonitor);
        //一级能力平台监控
        this._router.all('*',performanceMonitor.topPerformanceMonitor);
        //一级监控数据
        this._router.all('/viewTopPerformance',performanceMonitor.viewTopPerformance);
        //api这一级监控数据的所有api名称
        this._router.all('/viewSoursePerformanceKeys',performanceMonitor.viewSoursePerformanceKeys);
        //api这一级监控数据
        this._router.all('/viewSoursePerformance',performanceMonitor.viewSoursePerformance);
        //用户监控数据查看
        this._router.all('/viewUserPerformance',performanceMonitor.viewUserPerformance);
        // 对管理员操作进行basic-auth身份认证
        //this._router.all("/apis/*", adminPlugin.basicAuth);


        /**
         * @swagger
         * /apis/register:
         *     get:
         *       description: 重启服务并注册默认swagger配置文件下的API数据
         *       deprecated: false
         *       tags:
         *           - "API管理"
         */
        this._router.get("/apis/register", adminPlugin.APIRegister);


        /**
         * @swagger
         * /apis/updateSingleAPI:
         *   post:
         *       description: 更新单个已注册API信息
         *       deprecated: false
         *       tags:
         *           - "API管理"
         *       parameters:
         *         - name: oldURL
         *           in: query
         *           description: 需要修改的API对应的URL
         *           required: true
         *           type: string
         *         - name: userName
         *           in: query
         *           description: 发布者姓名
         *           required: true
         *           type: string
         *         - name: newURL
         *           in: query
         *           description: 新API对应的URL
         *           required: false
         *           type: string
         *         - name: APPId
         *           in: query
         *           description: 将API服务注册在API网关的公司对应的ID标识
         *           required: true
         *           type: string
         *         - name: status
         *           in: query
         *           description: 标识API是否有效，0为有效，1为无效
         *           required: false
         *           type: string
         *         - name: method
         *           in: query
         *           description: API对应的访问方法
         *           required: false
         *           type: string
         *         - name: name
         *           in: query
         *           description: API对应的名称
         *           required: false
         *           type: string
         *         - name: type
         *           in: query
         *           description: API对应的类型
         *           required: false
         *           type: string
         *         - name: argument
         *           in: query
         *           description: API对应的参数
         *           required: false
         *           type: string
         *         - name: event
         *           in: query
         *           description: API对应的响应
         *           required: false
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.post("/apis/updateSingleAPI", registerPlugin.updateSingleAPI);

        /**
         * @swagger
         * /apis/removeSingleAPI:
         *   post:
         *       description: 注销单个已注册API信息
         *       deprecated: false
         *       tags:
         *           - "API管理"
         *       parameters:
         *         - name: APPId
         *           in: query
         *           description: 注册API公司对应的APPId
         *           required: true
         *           type: string
         *         - name: from
         *           in: query
         *           description: 需要注销API对应的URL
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.post("/apis/removeSingleAPI", registerPlugin.removeSingleAPI);


        /**
         * @swagger
         * /apis/addSingleAPI:
         *   post:
         *       description: 注册单个API信息
         *       deprecated: false
         *       tags:
         *           - "API管理"
         *       parameters:
          *         - name: userName
         *           in: query
         *           description: 登录用户名(对应API发布者)
         *           required: true
         *           type: string
         *         - name: URL
         *           in: query
         *           description: 需要增加API对应的URL
         *           required: true
         *           type: string
         *         - name: APPId
         *           in: query
         *           description: 将API服务注册在API网关的公司对应的ID标识
         *           required: true
         *           type: string
         *         - name: to
         *           in: query
         *           description: API服务实际所在服务器域名
         *           required: true
         *           type: string
         *         - name: status
         *           in: query
         *           description: 标识API是否有效，0为有效，1为无效
         *           required: true
         *           type: string
         *         - name: method
         *           in: query
         *           description: API对应的访问方法
         *           required: true
         *           type: string
         *         - name: name
         *           in: query
         *           description: API对应的名称
         *           required: false
         *           type: string
         *         - name: type
         *           in: query
         *           description: API对应的类型
         *         - name: argument
         *           in: query
         *           description: API对应的参数
         *           required: false
         *           type: string
         *         - name: event
         *           in: query
         *           description: API对应的响应
         *           required: false
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.post("/apis/addSingleAPI", registerPlugin.addSingleAPI);



        /**
         * @swagger
         * /apis/recoverySingleAPI:
         *   post:
         *       description: 恢复单个已注销API信息
         *       deprecated: false
         *       tags:
         *           - "API管理"
         *       parameters:
         *         - name: APPId
         *           in: query
         *           description: 注册API公司对应的APPId
         *           required: true
         *           type: string
         *         - name: from
         *           in: query
         *           description: 需要注销API对应的URL
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.post("/apis/recoverySingleAPI", registerPlugin.recoverySingleAPI);

        /**
         * @swagger
         * /apis/uploads:
         *   get:
         *       description: 上传API的swagger配置文件完成API数据的添加注册
         *       deprecated: false
         *       tags:
         *           - "API管理"
         */
        this._router.get("/apis/uploads", adminPlugin.uploadFileView);

        // 上传文件接口
        this._router.post("/apis/uploads", adminPlugin.upload);
        /**
         * @swagger
         * /apis/viewAPIs:
         *   get:
         *       description: 可视化查看API
         *       deprecated: false
         *       tags:
         *           - "查看API"
         *       parameters:
         *         - name: fileName
         *           in: query
         *           description: swagger配置文件的名称 
         *           required: false
         *           type: string
         */
        this._router.get("/apis/viewAPIs", adminPlugin.viewAPIs);

        /**
         * @swagger
         * /user/doLogin:
         *   get:
         *       description: 用户登录
         *       deprecated: false
         *       tags:
         *           - "用户管理"
         *       parameters:
         *         - name: username
         *           in: query
         *           description: 用户名
         *           required: true
         *           type: string
         *         - name: pwd
         *           in: query
         *           description: 用户登录密码
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/user/doLogin", userPlugin.doLogin);



        /**
         * @swagger
         * /user/register:
         *   get:
         *       description: 用户注册
         *       deprecated: false
         *       tags:
         *           - "用户管理"
         *       parameters:
         *         - name: username
         *           in: query
         *           description: 用户名
         *           required: true
         *           type: string
         *         - name: pwd
         *           in: query
         *           description: 用户登录密码
         *           required: true
         *           type: string
         *         - name: realname
         *           in: query
         *           description: 用户名真实姓名
         *           required: true
         *           type: string
         *         - name: email
         *           in: query
         *           description: 用户邮箱
         *           required: true
         *           type: string
         *         - name: role
         *           in: query
         *           description: 用户角色
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/user/register", userPlugin.register);


        /**
         * @swagger
         * /user/getAllUser:
         *   get:
         *       description: 获取全部用户信息
         *       deprecated: false
         *       tags:
         *           - "用户管理"
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/user/getAllUser", userPlugin.getAllUser);


        /**
         * @swagger
         * /user/getUserByName:
         *   get:
         *       description: 根据用户名获取用户信息
         *       deprecated: false
         *       tags:
         *           - "用户管理"
         *       parameters:
         *         - name: username
         *           in: query
         *           description: 用户名
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/user/getUserByName", userPlugin.getUserByname);

        /**
         * @swagger
         * /user/removeUserByName:
         *   get:
         *       description: 根据用户名删除用户信息
         *       deprecated: false
         *       tags:
         *           - "用户管理"
         *       parameters:
         *         - name: username
         *           in: query
         *           description: 用户名
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/user/removeUserByName", userPlugin.removeUserByName);

        /**
         * @swagger
         * /user/updateUser:
         *   get:
         *       description: 更改用户信息
         *       deprecated: false
         *       tags:
         *           - "用户管理"
         *       parameters:
         *         - name: username
         *           in: query
         *           description: 用户名
         *           required: true
         *           type: string
         *         - name: pwd
         *           in: query
         *           description: 用户登录密码
         *           required: true
         *           type: string
         *         - name: realname
         *           in: query
         *           description: 用户名真实姓名
         *           required: true
         *           type: string
         *         - name: email
         *           in: query
         *           description: 用户邮箱
         *           required: true
         *           type: string
         *         - name: role
         *           in: query
         *           description: 用户角色
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/user/updateUser", userPlugin.updateUser);


        /**
         * @swagger
         * /user/logout:
         *   get:
         *       description: 用户注销
         *       deprecated: false
         *       tags:
         *           - "用户管理"
         *       parameters:
         *         - name: username
         *           in: query
         *           description: 用户名
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/user/logout", userPlugin.logout);

        /**
         * @swagger
         * /apis/single:
         *   get:
         *       description: 获取单个API的界面
         *       deprecated: false
         *       tags:
         *           - "API管理"
         *       parameters:
         *         - name: id
         *           in: query
         *           description: API对应的ID
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/apis/single", adminPlugin.viewSingleAPI);

        // 静态页面
        this._router.use("/static", express.static(config.getPath().static));

        /**
         * @swagger
         * /apis/getAllAPI:
         *   get:
         *       description: 获取全部API数据
         *       deprecated: false
         *       tags:
         *           - "API管理"
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/apis/getAllAPI", adminPlugin.getAllAPI);


        /**
         * @swagger
         * /apis/getAllAPIInfoWithKong:
         *   get:
         *       description: 根据Kong的格式获取全部API数据
         *       deprecated: false
         *       tags:
         *           - "API管理"
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/apis/getAllAPIInfoWithKong", adminPlugin.getAllAPIInfoWithKong);


        /**
         * @swagger
         * /apis/getAPIInfoByAPPIdAndURL:
         *   get:
         *       description: 根据API的appId和url获取API信息
         *       deprecated: false
         *       tags:
         *           - "API管理"
         *       parameters:
         *         - name: appId
         *           in: query
         *           description: 注册API的公司的appId
         *           required: true
         *           type: string
         *         - name: url
         *           in: query
         *           description: API服务对应的url
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/apis/getAPIInfoByAPPIdAndURL", adminPlugin.getAPIInfoByAPPIdAndURL);


        /**
         * @swagger
         * /apis/getApiInfoByType:
         *   get:
         *       description: 根据API的类型获取API信息
         *       deprecated: false
         *       tags:
         *           - "API管理"
         *       parameters:
         *         - name: APIType
         *           in: query
         *           description: API的类型
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/apis/getApiInfoByType", adminPlugin.getApiInfoByType);


        /**
         * @swagger
         * /apis/renameServiceName:
         *   get:
         *       description: 组合API重命名
         *       deprecated: false
         *       tags:
         *           - "组合API管理"
         *       parameters:
         *         - name: url
         *           in: query
         *           description: API对应的url
         *           required: true
         *           type: string
         *         - name: serviceName
         *           in: query
         *           description: 组合API的新名字
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/apis/renameServiceName", adminPlugin.renameServiceName);

        /**
         * @swagger
         * /apis/debugAPI:
         *   get:
         *       description: 组合API测试
         *       deprecated: false
         *       tags:
         *           - "组合API管理"
         *       parameters:
         *         - name: url
         *           in: query
         *           description: API对应的ID
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/apis/debugAPI", adminPlugin.debugAPI);


        /**
         * @swagger
         * /apis/storeAtomApiInfo:
         *   get:
         *       description: 存储组合API的原子API的信息
         *       deprecated: false
         *       tags:
         *           - "组合API管理"
         *       parameters:
         *         - name: moduleId
         *           in: query
         *           description: 原子API的对应的块ID
         *           required: true
         *           type: string
         *         - name: type
         *           in: query
         *           description: 原子API对应的类型
         *           required: false
         *           type: string
         *         - name: name
         *           in: query
         *           description: 原子API的名称
         *           required: false
         *           type: string
         *         - name: id
         *           in: query
         *           description: 原子API对应的ID
         *           required: false
         *           type: string
         *         - name: argument
         *           in: query
         *           description: 原子API的对应参数信息
         *           required: true
         *           type: string
         *         - name: response
         *           in: query
         *           description: 原子API对应的返回结果
         *           required: false
         *           type: string
         *         - name: URL
         *           in: query
         *           description: 原子API的对应的URL
         *           required: true
         *           type: string
         *         - name: isAsync
         *           in: query
         *           description: 是否异步
         *           required: false
         *           type: string
         *         - name: condition
         *           in: query
         *           description: 原子API的执行条件
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/apis/storeAtomApiInfo", combinationPlugin.storeAtomApiInfo);


        /**
         * @swagger
         * /apis/getAtomApiInfo:
         *   get:
         *       description: 获取组合API的原子API的信息
         *       deprecated: false
         *       tags:
         *           - "组合API管理"
         *       parameters:
         *         - name: moduleId
         *           in: query
         *           description: 原子API的对应的块ID
         *           required: true
         *           type: string
         *         - name: combinationUrl
         *           in: query
         *           description: 组合API对应的url
         *           required: false
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/apis/getAtomApiInfo", combinationPlugin.getAtomApiInfo);

        /**
         * @swagger
         * /apis/getAllAtomApiArgument:
         *   get:
         *       description: 获取组合API的原子API的参数信息
         *       deprecated: false
         *       tags:
         *           - "组合API管理"
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/apis/getAllAtomApiArgument", combinationPlugin.getAllAtomApiArgument)


        /**
         * @swagger
         * /apis/registerCombinationAPI:
         *   post:
         *       description: 注册组合API
         *       deprecated: false
         *       tags:
         *           - "组合API管理"
         *       parameters:
         *         - name: combinationUrl
         *           in: query
         *           description: 组合API对应的url
         *           required: true
         *           type: string
         *         - name: method
         *           in: query
         *           description: 组合API的请求方法
         *           required: false
         *           type: string
         *         - name: name
         *           in: query
         *           description: 组合API对应的名称
         *           required: false
         *           type: string
         *         - name: ID
         *           in: query
         *           description: 组合API对应的ID
         *           required: false
         *           type: string
         *         - name: argument
         *           in: query
         *           description: 组合API对应的参数
         *           required: false
         *           type: string
         *         - name: response
         *           in: query
         *           description: 组合API对应的输出
         *           required: false
         *           type: string
         *         - name: flowJson
         *           in: query
         *           description: 组合API对应的流程文件
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.post("/apis/registerCombinationAPI", combinationPlugin.registerCombinationAPI);




        /**
         * @swagger
         * /apis/getCombinationAPIFlow:
         *   get:
         *       description: 获取组合API的流程树信息
         *       deprecated: false
         *       tags:
         *           - "组合API管理"
         *       parameters:
         *         - name: combinationUrl
         *           in: query
         *           description: 组合API对应的url
         *           required: true
         *           type: string
         *         - name: publisher
         *           in: query
         *           description: 组合API的发布者
         *           required: false
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/apis/getCombinationAPIFlow", combinationPlugin.getCombinationAPIFlow);

        /**
         * @swagger
         * /voicePlatform/notify:
         *   post:
         *       description: 语音平台通知API网关相关事件发生的地址
         *       deprecated: false
         *       tags:
         *           - "事件通知"
         *       consumes:
         *           - application/json
         *       parameters:
         *         - in: body
         *           name: NotifyEvent
         *           description: 通知网关发生事件的相关参数
         *           schema:
         *             type: object
         *             properties:
         *               callEvent:
         *                 type: object
         *                 required:
         *                   - notifyEvent
         *                 properties:
         *                   event: 
         *                     type: string
         * 
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.post("/voicePlatform/notify", combinationPlugin.notify)



        /**
         * @swagger
         * /project/addProject:
         *   post:
         *       description: 添加一个项目
         *       deprecated: false
         *       tags:
         *           - "项目管理"
         *       parameters:
         *         - name: projectName
         *           in: query
         *           description: 新增项目名称
         *           required: true
         *           type: string
         *         - name: projectDescription
         *           in: query
         *           description: 项目信息简介
         *           required: false
         *           type: string
         *         - name: publisher
         *           in: query
         *           description: 项目创建和API注册发布者
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.post("/project/addProject", adminPlugin.addProject);

        /**
         * @swagger
         * /project/editProject:
         *   post:
         *       description: 添加一个项目
         *       deprecated: false
         *       tags:
         *           - "项目管理"
         *       parameters:
         *         - name: oldProjectName
         *           in: query
         *           description: 原项目名称
         *           required: true
         *           type: string
         *         - name: newProjectName
         *           in: query
         *           description: 新项目名称
         *           required: false
         *           type: string
         *         - name: projectDescription
         *           in: query
         *           description: 项目信息简介
         *           required: false
         *           type: string
         *         - name: publisher
         *           in: query
         *           description: 项目创建和API注册发布者
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.post("/project/editProject", adminPlugin.editProject);


        /**
         * @swagger
         * /project/deleteProject:
         *   get:
         *       description: 删除一个项目
         *       deprecated: false
         *       tags:
         *           - "项目管理"
         *       parameters:
         *         - name: projectName
         *           in: query
         *           description: 需要删除的项目名称
         *           required: true
         *           type: string
         *         - name: publisher
         *           in: query
         *           description: 项目创建和API注册发布者
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/project/deleteProject", adminPlugin.deleteProject);

        /**
         * @swagger
         * /project/queryProject:
         *   get:
         *       description: 根据项目名称查找项目信息，项目名称不存在，则查询全部项目信息，否则查询指定项目信息
         *       deprecated: false
         *       tags:
         *           - "项目管理"
         *       parameters:
         *         - name: projectName
         *           in: query
         *           description: 需要查找的项目名称
         *           required: false
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/project/queryProject", adminPlugin.queryProject);

        /**
         * @swagger
         * /project/queryAPIByProjectName:
         *   get:
         *       description: 根据项目名称查找其项下的API信息
         *       deprecated: false
         *       tags:
         *           - "项目管理"
         *       parameters:
         *         - name: projectName
         *           in: query
         *           description: 需要查找的项目名称
         *           required: true
         *           type: string
         *       produces:
         *         - application/json
         *       responses:
         *         200:
         *           description:OK
         */
        this._router.get("/project/queryAPIByProjectName", adminPlugin.queryAPIByProjectName);
    }
}
export{AdminRouter};