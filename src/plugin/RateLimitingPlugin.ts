import express = require("express");
import {LogModel} from "../model/LogModel";
import sd = require('silly-datetime');
import {GetIP} from "../util/GetIP"
import fs = require("fs");
import util = require("util")
import os = require("os")
import osUtils = require("os-utils");
import { print } from "util";
import {RateLimitingModel} from "../model/RateLimitingModel"
import { UserPerformanceModel } from "../model/UserPerformanceModel";
import {PerformanceService} from "../service/PerformanceService"
import { GeneralResult } from "../general/GeneralResult";

//这里转化的时间戳是1s 为1000
let TimeToStamp ={
    second:1000,
    minute:60000,
    hour:3600000,
    day: 86400000,
   //the month here is 30 day
    month:2592000000
}
//每个用户对每个api单位时间内的限制次数
let Limits ={
    secondLimitVisit:100,
    minuteLimitVisit:1000,
    hourLimitVisit:10000,
    dayLimitVisit: 50000,
   //the month here is 30 day
    monthLimitVisit:200000
}
 /**
 * 速率监控插件
 */
class RateLimitingPlugin{   
    static rateLimitNum:Map<String,RateLimitingModel> = new Map();
    /**
     * @param req 
     * @param res 
     * @param next 
     */
     
    public RateLimiting(req, res, next): void{
        let ip = GetIP.getClientIP(req);
        let service = req.originalUrl;
        if(!RateLimitingPlugin.rateLimitNum.has(ip+'&'+service)){
            let ratelimitingmodel = new RateLimitingModel()
            ratelimitingmodel.apiID = service;
            ratelimitingmodel.userID = ip;
            ratelimitingmodel.lastChangeTime = new Date();
            RateLimitingPlugin.rateLimitNum.set(ip+'&'+service,ratelimitingmodel);
            next();
        }else{
            let ratelimitingmodel:RateLimitingModel = RateLimitingPlugin.rateLimitNum.get(ip+'&'+service);
            let currentTimeS = Number(new Date());
            let lastChangeTimeS = Number(ratelimitingmodel.lastChangeTime);
            ratelimitingmodel.lastChangeTime = new Date(currentTimeS);
            //判断时间戳
            if(Math.floor(currentTimeS/TimeToStamp.second)-Math.floor(lastChangeTimeS/TimeToStamp.second)<1){
                ratelimitingmodel.monthVisit++;
                ratelimitingmodel.dayVisit++;
                ratelimitingmodel.hourVisit++;
                ratelimitingmodel.minuteVisit++;
                ratelimitingmodel.secondVisit++;
            }else if(Math.floor(currentTimeS/TimeToStamp.minute)-Math.floor(lastChangeTimeS/TimeToStamp.minute)<1){
                ratelimitingmodel.monthVisit++;
                ratelimitingmodel.dayVisit++;
                ratelimitingmodel.hourVisit++;
                ratelimitingmodel.minuteVisit++;
                ratelimitingmodel.secondVisit = 1;
            }else if(Math.floor(currentTimeS/TimeToStamp.hour)-Math.floor(lastChangeTimeS/TimeToStamp.hour)<1){
                ratelimitingmodel.monthVisit++;
                ratelimitingmodel.dayVisit++;
                ratelimitingmodel.hourVisit++;
                ratelimitingmodel.minuteVisit= 1;
                ratelimitingmodel.secondVisit = 1;
            }else if(Math.floor(currentTimeS/TimeToStamp.day)-Math.floor(lastChangeTimeS/TimeToStamp.day)<1){
                ratelimitingmodel.monthVisit++;
                ratelimitingmodel.dayVisit++;
                ratelimitingmodel.hourVisit = 1;
                ratelimitingmodel.minuteVisit = 1;
                ratelimitingmodel.secondVisit = 1;
            }else if(Math.floor(currentTimeS/TimeToStamp.month)-Math.floor(lastChangeTimeS/TimeToStamp.month)<1){
                ratelimitingmodel.monthVisit++;
                ratelimitingmodel.dayVisit= 1;
                ratelimitingmodel.hourVisit= 1;
                ratelimitingmodel.minuteVisit= 1;
                ratelimitingmodel.secondVisit = 1;
            }else{
                ratelimitingmodel.monthVisit = 1;
                ratelimitingmodel.dayVisit= 1;
                ratelimitingmodel.hourVisit= 1;
                ratelimitingmodel.minuteVisit= 1;
                ratelimitingmodel.secondVisit = 1;
            }
            if(ratelimitingmodel.monthVisit<Limits.monthLimitVisit && ratelimitingmodel.dayVisit<Limits.dayLimitVisit && ratelimitingmodel.hourVisit<Limits.hourLimitVisit && ratelimitingmodel.minuteVisit<Limits.minuteLimitVisit && ratelimitingmodel.secondVisit<Limits.secondLimitVisit){
                // console.log('秒： '+ratelimitingmodel.secondVisit);
                // console.log('分： ' +ratelimitingmodel.minuteVisit);
                // console.log('时： '+ratelimitingmodel.hourVisit);
                next();
            }else{
                console.log('用户'+ip+'  访问服务'+service+'  超出限定次数');
            }
            
        }
    }
     

}
export{RateLimitingPlugin};