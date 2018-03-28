import express = require("express");
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
     * @param 
     */
    public logPerformanceToFile(log:LogModel):void{
        fs.appendFileSync(path.join(__dirname, "../../performanceFile/logPerformance.txt"),log.getAll()+'\n');
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
     * Api监控数据存放到本地文件中
     * @param 
     */
    public SoursePerformanceToFile():void{
        fs.writeFileSync(path.join(__dirname, '../../performanceFile/SoursePerformance.txt'),SoursePerformanceModel.getAll());         
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