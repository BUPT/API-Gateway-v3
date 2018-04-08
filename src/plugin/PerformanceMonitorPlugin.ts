import express = require("express");
import {LogModel} from "../model/LogModel";
import {TopPerformanceModel} from "../model/TopPerformanceModel";
import {SoursePerformanceModel} from "../model/SoursePerformanceModel";

import sd = require('silly-datetime');
import {GetIP} from "../util/GetIP"
import fs = require("fs");
import util = require("util")
import os = require("os")
import osUtils = require("os-utils");
import { print } from "util";
import { UserPerformanceModel } from "../model/UserPerformanceModel";
import {PerformanceService} from "../service/PerformanceService"
import { GeneralResult } from "../general/GeneralResult";
/**
 * 性能监控插件
 */
class PerformanceMonitorPlugin{

    private _topPerformance = new TopPerformanceModel();
    private _soursePerformanceHost:String = '_soursePerformanceHost';
    set soursePerformanceHost(soursePerformanceHost:String){
        this._soursePerformanceHost = soursePerformanceHost;
    }
    get soursePerformanceHost(){
        return this._soursePerformanceHost;
    }
    /**
     * 
     * @param req 
     * @param res 
     * @param next 
     */
    public logPerformanceMonitor(req, res, next): void{
        let logModel :LogModel= new LogModel();
        if(req.query.username!=undefined){
            logModel.username = req.query.username;    
            logModel.classes = 'common';
        }else{
            logModel.username = 'null';
            logModel.classes = 'null';
        }
        // logModel.time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        logModel.time = new Date();
        logModel.ip = GetIP.getClientIP(req);
        logModel.status = 'succeed';        //默认为成功
        logModel.service = req.originalUrl;
        logModel.device = req.rawHeaders[5];
        req.on('end',function(){
            // logModel.responseTime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss'); 
            logModel.responseTime =new Date(); 
            // console.log(logModel.get())           
        }).on('error',function(){
            logModel.status = 'error'
            // console.log(logModel.get())  
        })
        let performanceService :PerformanceService= new PerformanceService();
        performanceService.logPerformanceToFile(logModel);
        performanceService.logPerformanceInsert(logModel);
        // fs.writeFileSync('req',util.inspect(req,{depth:null})); //depth:null 展开全部层级
        next();
    }
         /**
     * 一级网关能力平台性能监控1
     * 获取系统自带信息,cpu,memory信息
     */
    public static topPerformanceMonitorCommen(): void{
        TopPerformanceModel.topPerformance.memoryUsage = ((os.totalmem()-os.freemem())/os.totalmem()).toFixed(3);
        osUtils.cpuUsage(function(value){
            TopPerformanceModel.topPerformance.cpuUsage = value;
        });
    }
      /**
     * 一级网关能力平台性能监控2
     * @param req 
     * @param res 
     * @param next 
     * 
     */
    public topPerformanceMonitor(req, res, next): void{
        TopPerformanceModel.topPerformance.totleVisit = TopPerformanceModel.topPerformance.totleVisit +1;
        TopPerformanceModel.topPerformance.unitTimeTotleVisit =TopPerformanceModel.topPerformance.unitTimeTotleVisit+1 ;
        TopPerformanceModel.topPerformance.concurrentVolume= TopPerformanceModel.topPerformance.concurrentVolume+1;
        let visitTime = new Date();
        req.on('end',function(){
            let responseTime =new Date(); 
            //这里得到的时间是毫秒为单位
            let time :number  = (responseTime.getTime()-visitTime.getTime());
            TopPerformanceModel.topPerformance.averageResponseTime =(TopPerformanceModel.topPerformance.averageResponseTime*(TopPerformanceModel.topPerformance.unitTimeTotleVisit-1)+time)/TopPerformanceModel.topPerformance.unitTimeTotleVisit;
            TopPerformanceModel.topPerformance.concurrentVolume--;
        }).on('error',function(){
            TopPerformanceModel.topPerformance.concurrentVolume--;            
        })
        //每次访问就写入文件一次
        new PerformanceService().topPerformanceToFile();
        next();
    }

     /**
     * 二级能力平台性能监控1
     * @param req 
     * @param res 
     * @param next 
     */
    public soursePerformanceMonitor(req, res, next): void{
        //二级平台性能监控的的服务名称
        let serverName = this._soursePerformanceHost.toString()+req.originalUrl.toString();
        // serverName 目前都是这种www.linyimin.club:10010/bookTo?isBuy=true
        let SoursePerformance :SoursePerformanceModel;
        let visitTime = new Date();
        if(SoursePerformanceModel._soursePerformanceMap.has(serverName)){
            SoursePerformance = SoursePerformanceModel._soursePerformanceMap.get(serverName);
        }else{
            SoursePerformance = new SoursePerformanceModel();
        }
        SoursePerformance.totleVisit++;
        SoursePerformance.unitTimeTotleVisit++;
        SoursePerformance.concurrentVolume++;
        SoursePerformance.serverName = serverName;
        SoursePerformanceModel._soursePerformanceMap.set(serverName,SoursePerformance);

        req.on('end',function(){
            SoursePerformanceModel._soursePerformanceMap.get(serverName).concurrentVolume--;
            let responseTime = new Date();      
            //这里得到的时间是毫秒为单位
            let time = (responseTime.getTime() - visitTime.getTime());     
            SoursePerformanceModel._soursePerformanceMap.get(serverName).averageResponseTime  =(SoursePerformanceModel._soursePerformanceMap.get(serverName).averageResponseTime*(SoursePerformanceModel._soursePerformanceMap.get(serverName).unitTimeTotleVisit-1)+time)/SoursePerformanceModel._soursePerformanceMap.get(serverName).unitTimeTotleVisit; 
        }).on('error',function(){
            SoursePerformanceModel._soursePerformanceMap.get(serverName).concurrentVolume--;
        })
        SoursePerformanceModel._soursePerformanceMap.forEach(function(value,key,map){
            console.log(key+' value= '+value.totleVisit+' '+value.unitTimeTotleVisit+' '+value.concurrentVolume+' '+value.averageResponseTime)
        })
        new PerformanceService().SoursePerformanceToFile();
        next();
    }

     /**
     * 二级能力平台性能监控1
     * @param req 
     * @param res 
     * @param next 
     */
    public userPerformanceMonitor(req, res, next): void{
        //用户性能监控的的服务名称
        let username = req.query.username;
        if(username==undefined){
        }else{
            let userPerformance :UserPerformanceModel;
            let lastVIsitTime = new Date();
            if(UserPerformanceModel._userPerformanceMap.has(username)){
                userPerformance = UserPerformanceModel._userPerformanceMap.get(username);
            }else{
                userPerformance = new UserPerformanceModel();
            }
            userPerformance.totleVisit++;
            userPerformance.unitTimeTotleVisit++;
            userPerformance.lastVisitTime = lastVIsitTime;
            UserPerformanceModel._userPerformanceMap.set(username,userPerformance);
        }
        next();
    }

     /**
     * 返回二级能力平台性能监控数据的全部serverName
     * 通过http://localhost:8001/viewSoursePerformanceKeys
     * @param req 
     * @param res 
     */
    public viewSoursePerformanceKeys(req, res):any{
        let keys = [];
        SoursePerformanceModel._soursePerformanceMap.forEach(function(value,key,map){
            keys.push(key);
        });
        res.json(new GeneralResult(true,null,keys));
        return ;
    }
    /**
     * 返回二级能力平台性能监控数据
     * 通过http://localhost:8001/viewSoursePerformance?name=/bookBack 返回json
     * @param req 
     * @param res 
     */
    public viewSoursePerformance(req, res):any{
        // /user?name=tobi
        let serverName :String= req.param('name');
        if(SoursePerformanceModel._soursePerformanceMap.has(serverName)){
            res.json(new GeneralResult(false,null,SoursePerformanceModel._soursePerformanceMap.get(serverName)));
            return ;
        }else{
            res.json(new GeneralResult(false,null,{'data':'name dose not visit'}));
            return ;
        }
          
    }
    /**
     * 返回用户监控数据
     * 通过http://localhost:8001/viewUserPerformance?username= 返回json
     * @param req 
     * @param res 
     */
    public viewUserPerformance(req, res):any{
        // /user?name=tobi
        let userName :String= req.param('username');
            if(UserPerformanceModel._userPerformanceMap.has(userName)){
                res.json(new GeneralResult(true,null,UserPerformanceModel._userPerformanceMap.get(userName)));
                return ;
            }else{
                res.json(new GeneralResult(false,null,{'data':'username dose not visit'}));
                return ;
            }
    }
    
    public viewTopPerformance(req, res):any{
        res.json(new GeneralResult(true,null,TopPerformanceModel.topPerformance));
        return ;
    }

}
export{PerformanceMonitorPlugin};