/**
 * 使用单例设计模式完成事件订阅发布
 */

import {EventEmitter} from "events";

export class Event extends EventEmitter{
    private static event: Event = null;
    private constructor(){
        super();
    }

    public static getEvent(): Event{
        if(this.event === null){
            this.event = new Event();
        }
        return this.event;
    }
}