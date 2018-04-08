import express = require("express");
import {MyMongoose} from "../util/GetConnectedMongoose"
import {LogModel} from "../model/LogModel";
import fs = require("fs");
import {TopPerformanceModel} from "../model/TopPerformanceModel";
import {SoursePerformanceModel} from "../model/SoursePerformanceModel";
import { UserPerformanceModel } from "../model/UserPerformanceModel";
import {PerformanceMonitorPlugin} from "../plugin/PerformanceMonitorPlugin";
import * as  path from "path";
class PerformanceService{
    /**
     * 日志存放到本地文件中
     * @param log
     */
    public logPerformanceToFile(log:LogModel):void{
        fs.appendFileSync(path.join(__dirname, "../../performanceFile/logPerformance.txt"),log.getAll()+'\n');
    }
    /**
     * 日志存放入mongodb中
     * @param log 
     */
    public async logPerformanceInsert(log:LogModel):Promise<any>{
        var mongoose:any = await MyMongoose.getMongoose();
        var Schema =mongoose.Schema;
        var logSchema = new Schema({
            classes:String,
            username:String,
            ip: String,
            // comments: [{ body: String, date: Date }],
            time: { type: Date, default: Date.now },
            device: String,
            service:String,
            status:String,
            responseTime:Date,
        });
        var logModel = mongoose.model('logModel',logSchema);
        var doc = new logModel({
            classes:log.classes,
            time:log.time,
            username:log.username,
            ip: log.ip,
            device: log.device,
            service:log.service,
            status:log.status,
            responseTime:log.responseTime,
        })
        doc.save();
    }

    /**
    * 一级平台监控数据存放到本地文件中
    * @param 
    */
    public topPerformanceToFile():void{
        PerformanceMonitorPlugin.topPerformanceMonitorCommen();
        fs.writeFileSync(path.join(__dirname, '../../performanceFile/topPerformance.txt'),TopPerformanceModel.getAll()); 
    }
    /**
    * 系统整体监控数据存放到mongodb中 (每次访问都会调用一次,不再存放cpu与内存等)
    * @param SoursePerformance
    */
    public async topPerformanceInsert():Promise<void>{
        var mongoose:any = await MyMongoose.getMongoose();
        var Schema =mongoose.Schema;
        var topPerformanceMonitorSchema = new Schema({
            time: { type: Date, default: Date.now },
            totleVisit:Number,
            unitTimeTotleVisit: Number,
            concurrentVolume: Number,
            averageResponseTime:Number,
        });
        var topPerformanceMonitorModel = mongoose.model('topPerformanceMonitorModel',topPerformanceMonitorSchema);
        var doc = new topPerformanceMonitorModel({
            totleVisit:TopPerformanceModel.topPerformance.totleVisit,
            unitTimeTotleVisit: TopPerformanceModel.topPerformance.unitTimeTotleVisit,
            concurrentVolume: TopPerformanceModel.topPerformance.concurrentVolume,
            averageResponseTime:TopPerformanceModel.topPerformance.averageResponseTime,
        })
        doc.save();
    }
    /**
    * Api监控数据存放到本地文件中
    * @param 
    */
    public SoursePerformanceToFile():void{
        fs.writeFileSync(path.join(__dirname, '../../performanceFile/SoursePerformance.txt'),SoursePerformanceModel.getAll());         
    }
    /**
     * Api监控数据存放到mongodb中 (每次访问都会调用一次)
     * @param SoursePerformance
     */
    public async SoursePerformanceInsert(SoursePerformance:SoursePerformanceModel):Promise<void>{
        var mongoose:any = await MyMongoose.getMongoose();
        var Schema =mongoose.Schema;
        var apiPerformanceMonitorSchema = new Schema({
            time: { type: Date, default: Date.now },
            serverName:String,
            totleVisit:Number,
            unitTimeTotleVisit: Number,
            concurrentVolume: Number,
            averageResponseTime:Number,
        });
        var apiPerformanceMonitorModel = mongoose.model('apiPerformanceMonitorModel',apiPerformanceMonitorSchema);
        var doc = new apiPerformanceMonitorModel({
            serverName:SoursePerformance.serverName,
            totleVisit:SoursePerformance.totleVisit,
            unitTimeTotleVisit: SoursePerformance.unitTimeTotleVisit,
            concurrentVolume: SoursePerformance.concurrentVolume,
            averageResponseTime:SoursePerformance.averageResponseTime,
        })
        doc.save();
    }
     /**
     * 用户访问监控数据存放到本地文件中
     * @param 
     */
    public userPerformanceToFile():void{
        fs.writeFileSync(path.join(__dirname, '../../performanceFile/userPerformance.txt'),UserPerformanceModel.getAll());                 
    } 
     
}
export {PerformanceService}