"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var db_czf_1 = require("../util/db_czf");
var FluidControl = /** @class */ (function () {
    function FluidControl(type, name, response) {
        this.type = type;
        this.name = name;
        this.response = response;
        this.db = new db_czf_1.DB();
    }
    FluidControl.prototype.getType = function () {
        return this.type;
    };
    FluidControl.prototype.getName = function () {
        return this.name;
    };
    FluidControl.prototype.getDb = function () {
        return this.db;
    };
    FluidControl.prototype.getLock = function () {
        return this.lock;
    };
    FluidControl.prototype.setType = function (type) {
        this.type = type;
    };
    FluidControl.prototype.setName = function (name) {
        this.name = name;
    };
    FluidControl.prototype.setDb = function (db) {
        this.db = db;
    };
    FluidControl.prototype.setLock = function (lock) {
        this.lock = lock;
    };
    FluidControl.prototype.search_lock = function () {
        return __awaiter(this, void 0, void 0, function () {
            var lock_string, sql, sqlParams, result, lock;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        switch (this.type) {
                            case '消息':
                                this.id = '1';
                                break;
                            case 'IVR':
                                this.id = '2';
                                break;
                            case '管道':
                                this.id = '3';
                                break;
                            default:
                                console.info('the type is wrong!');
                                return [2 /*return*/];
                        }
                        lock_string = 'lock_' + this.id;
                        sql = 'SELECT * FROM users where name=?';
                        sqlParams = [this.name];
                        return [4 /*yield*/, this.db.select(sql, sqlParams)];
                    case 1:
                        result = _a.sent();
                        lock = result[0][lock_string];
                        this.lock = lock;
                        return [2 /*return*/];
                }
            });
        });
    };
    FluidControl.prototype.fluid_control = function () {
        return __awaiter(this, void 0, void 0, function () {
            var login_time_str, login_count_str, last_login_time_str, login_continue_count_str, lock_str, sql, sqlParams, result, login_time, login_count, last_login_time, login_continue_count, lock, level, timediff, updatedAt, lg_count_limited;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        login_time_str = 'login_time_' + this.id;
                        login_count_str = 'login_count_' + this.id;
                        last_login_time_str = 'last_login_time_' + this.id;
                        login_continue_count_str = 'login_continue_count_' + this.id;
                        lock_str = 'lock_' + this.id;
                        sql = 'SELECT * FROM users where name=?';
                        sqlParams = [this.name];
                        return [4 /*yield*/, this.db.select(sql, sqlParams)];
                    case 1:
                        result = _a.sent();
                        login_time = result[0][login_time_str];
                        login_count = result[0][login_count_str];
                        last_login_time = result[0][last_login_time_str];
                        login_continue_count = result[0][login_continue_count_str];
                        lock = result[0][lock_str];
                        level = result[0]['level'];
                        console.info('user:' + this.name + '  last login time is ' + new Date(last_login_time)); //上一次登录时间
                        timediff = new Date(Date.now()).getTime() - new Date(last_login_time).getTime();
                        console.log('timediff:' + timediff);
                        //如果时间间隔小于等于1s,且重复操作大于等于3次，则记访问过于频繁，上锁
                        if (timediff <= 2000) {
                            login_continue_count++;
                        }
                        else {
                            login_continue_count = 0;
                        }
                        if (login_continue_count >= 3) {
                            lock = 1;
                        }
                        last_login_time = Date.now();
                        login_time = Date.now();
                        login_count++;
                        updatedAt = Date.now();
                        lg_count_limited = 0;
                        if (level === 0) {
                            lg_count_limited = 5;
                        }
                        else {
                            lg_count_limited = 10;
                        }
                        if (login_count >= lg_count_limited) {
                            lock = 1;
                        }
                        sql = 'UPDATE users SET ' + login_time_str + ' = ?,' + login_count_str + '=?,' + last_login_time_str + '=?,' + login_continue_count_str + '=?,' + lock_str + '=? WHERE name = ?'; //保存更新
                        sqlParams = [login_time, login_count, last_login_time, login_continue_count, lock, this.name];
                        return [4 /*yield*/, this.db.update(sql, sqlParams)];
                    case 2:
                        result = _a.sent();
                        console.info('user:' + this.name + '  login counts is ' + login_count);
                        console.info('user:' + this.name + '  now login time is ' + new Date(login_time));
                        return [2 /*return*/];
                }
            });
        });
    };
    return FluidControl;
}());
exports.FluidControl = FluidControl;
