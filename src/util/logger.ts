import * as log4js from "log4js";
import * as path from "path";

let dir = path.join(__dirname, "../../log/")
console.log(dir);

export const getLogger = function(category?: string){
  log4js.configure({
    appenders: { 
      info: { type: 'file', filename: dir + 'apigateway.log' },
      apiInfo: { type: 'file', filename: dir + 'apigateway.log' },
      urlTable: { type: 'file', filename: dir + 'apigateway.log' }, 
      combination: { type: 'file', filename: dir + 'apigateway.log' },
      combinationFlow: { type: 'file', filename: dir + 'apigateway.log' },
       
    },
    categories: { default: { appenders: ['info', 'apiInfo', 'urlTable', 'combination', 'combinationFlow'], level: 'info' } },
  });
  return log4js.getLogger(category === undefined ? null : category);    
}

