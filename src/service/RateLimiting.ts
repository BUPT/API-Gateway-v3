import express = require("express");
import {MyMongoose} from "../util/GetConnectedMongoose"
import {LogModel} from "../model/LogModel";
import fs = require("fs");
import {RateLimitingModel} from "../model/RateLimitingModel";
import * as  path from "path";
class RateLimiting{
    /**
     * 日志存放入mongodb中
     * @param log 
     */
    public async rateLimitingDataInsert(rateLimiting:RateLimitingModel):Promise<any>{
        var mongoose:any = await MyMongoose.getMongoose();
        var Schema =mongoose.Schema;
        var rateLimitingSchema = new Schema({
            AI:String,
            UI:String,
            MV: Number,
            DV: Number,
            HV: Number,
            MiV: Number,
            SV: Number,
            TM: { type: Date, default: Date.now }
        });
        var rateLimitingModel = mongoose.model('rateLimitingModel',rateLimitingSchema);
        var doc = new rateLimitingModel({
            AI:rateLimiting.apiID,
            UI:rateLimiting.userID,
            MV: rateLimiting.monthVisit,
            DV: rateLimiting.dayVisit,
            HV: rateLimiting.hourVisit,
            MiV: rateLimiting.minuteVisit,
            SV: rateLimiting.secondVisit
        })
        doc.save();
    }

     
}
export {RateLimiting}