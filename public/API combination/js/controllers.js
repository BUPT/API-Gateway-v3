var apiGatewayCtrls = angular.module('apiGatewayCtrls', []);

apiGatewayCtrls.controller('StartCtrl', ['$scope', '$http', 'ngDialog', '$window',
    function ($scope, $http, ngDialog, $window) {
        $scope.title = "API动态组合编排系统";

        $scope.file = "文件";
        $scope.file1 = "新建";
        $scope.file2 = "打开";
        $scope.file3 = "查看";
        $scope.file4 = "重命名";
        $scope.file5 = "退出";

        $scope.operate = "操作";
        $scope.operate1 = "生成json格式树";
        $scope.operate2 = "注册";
        $scope.operate3 = "撤销";
        $scope.operate4 = "调试";
        $scope.operate5 = "json格式树导出";

        $scope.tool = "工具";
        $scope.tool1 = "";
        $scope.tool2 = "";
        $scope.tool3 = "";

        $scope.window = "窗口";
        $scope.window1 = "打开新窗口";
        $scope.window2 = "关闭窗口";
        $scope.window3 = "全屏显示";
        $scope.window4 = "退出全屏";

        $scope.help = "帮助";
        $scope.help1 = "Swagger帮助";
        $scope.help2 = "使用说明";

        $scope.show = function () { //生成JSON树结构
            console.log(JSON.stringify(SDT.returnTree()[0])); //返回树，接受一个参数，参数类型为值为 true 或 false 的变量，若值为 true 则返回精简树（元素只包含 id 、 name 、 foresideObjId 、 childEles 信息），不可用于重绘；若值为 false 则返回完整树，完整树可用于重绘 注: 重绘要求有页面有图标信息，即相应的 class = "sdt-drag-element-lis" 的 <div> 标签所包涵的图标列表
            console.log(JSON.stringify(SDT.returnTree()[1]));
            console.log(JSON.stringify(SDT.returnTree()[2]));
            document.getElementById("jsontext").innerHTML = JSON.stringify(SDT.returnTree()[0], null, 2);
            $('#myTab li:eq(1) a').tab('show');
        };

        $scope.outjson = function () { //json格式树导出
            var txtdata = JSON.stringify(SDT.returnTree()[0], null, 2);
            // alert(txtdata);
            var content = "" + txtdata;
            var blob = new Blob([content], { type: "text/plain;charset=utf-8" });
            saveAs(blob, "tree.json"); //saveAs(blob,filename) //仅限于chorme的下载目录里
        }

        // $scope.center = function() { //居中
        //     SDT.backCenter(); //返回画布中心，不接受参数
        // };

        $scope.goback = function () { //撤销
            SDT.removeELe(); //删除元素，接受一个参数，参数类型为数组，数组元素应为要删除的元素的 id 注: 若不传入参数则删除最近放置的元素   
            isroot();
        };

        $scope.save = function () { //存储设置
            var condition = $scope.condition;
            //alert(condition);
            var nodeid = $("#nodeid").val();
            var asn = $("#asn").val();
            //alert(asn);
            var type = $("#tp").val();
            var name = $("#name").find("option:selected").text();
            var id = $("#idid").val();
            var input = $("#inputt").val();
            var output = $("#output").val();
            var url = $("#url").val();
            var method = $("#method").val();

            var Json = SDT.returnTree()[0];

            function json(jsontree) { //根据id找到相应树节点
                if ((typeof jsontree == 'object') && (jsontree.constructor == Object.prototype.constructor)) {
                    var arrey = [];
                    arrey.push(jsontree);
                } else arrey = jsontree;
                for (var i = 0; i < arrey.length; i++) {
                    var node = arrey[i];
                    if (node.id == nodeid) {
                        if (condition == undefined) { node.condition = ""; } else { node.condition = condition; }
                        node.asntype = asn;
                        node.name = name;
                        $("#nodeid").children('text').html(node.name);
                        node.url = url;
                        node.isfirst = 0;
                        node.argument = input;
                        node.method = method;
                        alert("设置成功！");
                        return;
                    }
                    if (node.childEles && node.childEles.length > 0) {
                        json(node.childEles);
                    }
                }
            }
            //json(Json);

            $http({
                method: 'get',
                url: 'http://www.linyimin.club:8001/apis/storeAtomApiInfo',
                params: {
                    "moduleId": nodeid,
                    "type": type,
                    "name": name,
                    "id": id,
                    "argument": input,
                    "response": output,
                    "URL": url,
                    "isAsync": asn,
                    "condition": condition,
                    "method":method
                }, // 传递数据作为字符串，从前台传到后台  
            }).success(function (data, status, headers, config) { //这里的data，就是后台传递过来的数据jsonArray  
                if (data.result == true) {
                    json(Json);
                } else {
                    alert(data.reason);
                }
            }).error(function (data, status, headers, config) {
                alert("错误");
            });
        };

        $scope.register = function () { //点击注册
            $http({
                method: 'get',
                url: 'http://www.linyimin.club:8001/apis/getAllAtomApiArgument',
                params: {}, // 传递数据作为字符串，从前台传到后台  
            }).success(function (dataa, status, headers, config) { //这里的data，就是后台传递过来的数据jsonArray  
                ngDialog.open({
                    template: 'register.html',
                    className: 'ngdialog-theme-default',
                    controller: function ($scope) {
                        $scope.r_input = dataa;
                        $scope.show = function () {
                            $scope.closeThisDialog(); //关闭弹窗
                        };
                        $scope.registeryes = function () {
                            $http({
                                method: 'post',
                                url: 'http://www.linyimin.club:8001/apis/registerCombinationAPI',
                                params: {
                                    "name": $scope.r_name,
                                    "ID": $scope.r_id,
                                    "argument": $scope.r_input,
                                    "response": $scope.r_output,
                                    "combinationUrl": $scope.r_url,
                                    "flowJson": JSON.stringify(SDT.returnTree()[0], null, 2),
                                    "method":$("#methods option:selected").val()
                                }, // 传递数据作为字符串，从前台传到后台  
                            }).success(function (data, status, headers, config) { //这里的data，就是后台传递过来的数据jsonArray  
                                if (data.result == true) {
                                    alert("注册成功！");
                                    $scope.closeThisDialog(); //关闭弹窗
                                    //alert(JSON.parse(JSON.stringify(SDT.returnTree()[0], null, 2)));
    
                                    function json(jsontree) { //遍历树
                                        if ((typeof jsontree == 'object') && (jsontree.constructor == Object.prototype.constructor)) {
                                            var arrey = [];
                                            arrey.push(jsontree);
                                        } else arrey = jsontree;
                                        for (var i = 0; i < arrey.length; i++) {
                                            var node = arrey[i];
                                            //node.isfirst = 2;
                                            (function () {
                                                var oob = $('#' + node.id);
                                                oob.click(function () {
                                                    shownodeattr2(oob);
                                                    //alert(oob.attr('id'))
                                                })
                                            })();
                                            if (node.childEles && node.childEles.length > 0) {
                                                json(node.childEles);
                                            }
                                        }
                                    }
                                    json(JSON.parse(JSON.stringify(SDT.returnTree()[0], null, 2))); //json格式
    
                                    function shownodeattr2(oob) {
                                        function json(jsontree) { //根据id找到相应树节点
                                            if ((typeof jsontree == 'object') && (jsontree.constructor == Object.prototype.constructor)) {
                                                var arrey = [];
                                                arrey.push(jsontree);
                                            } else arrey = jsontree;
                                            for (var i = 0; i < arrey.length; i++) {
                                                var node = arrey[i];
                                                //node.isfirst = 2;
                                                if (node.id == oob.attr('id')) {
                                                    shownodeattr1(node, oob, $scope.r_url);
                                                    return;
                                                }
                                                if (node.childEles && node.childEles.length > 0) {
                                                    json(node.childEles);
                                                }
                                            }
                                        }
                                        json(JSON.parse(JSON.stringify(SDT.returnTree()[0], null, 2))); 
                                    }
    
    
                                } else {
                                    alert(data.reason);
                                }
                            }).error(function (data, status, headers, config) {
                                alert("错误");
                            });
                        }
                    }
                });
            }).error(function (data, status, headers, config) {
                alert("错误");
            });
            
        };

        $scope.debug = function () { //点击调试
            ngDialog.open({
                template: 'debug.html',
                className: 'ngdialog-theme-default',
                controller: function ($scope) {
                    $scope.show = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    };
                    $scope.debugyes = function () {
                        $http({
                            method: 'get',
                            url: 'http://www.linyimin.club:8001/apis/debugAPI',
                            params: {
                                "url": $scope.d_url
                            }, // 传递数据作为字符串，从前台传到后台  
                        }).success(function (data, status, headers, config) { //这里的data，就是后台传递过来的数据jsonArray  
                            if (data.result == true) {
                               // alert("成功");
                                $scope.closeThisDialog(); //关闭弹窗
                                document.getElementById("debuginformation").innerHTML= "成功！<br/><br/>"+JSON.stringify(data.datum,null, 2);
                                //$scope.debuginformation = data.result;
                                $('#myTab li:eq(2) a').tab('show');
                            }
                            else {
                                //alert("失败");
                                $scope.closeThisDialog(); //关闭弹窗
                                if(data.reason == null){
                                    document.getElementById("debuginformation").innerHTML= "失败！<br/><br/>"+JSON.stringify(data.datum,null, 2);
                                }
                                else{
                                    document.getElementById("debuginformation").innerHTML= "失败！<br/><br/>"+data.reason;
                                }
                               
                                //$scope.debuginformation = data.result;
                                $('#myTab li:eq(2) a').tab('show');
                            }
                        }).error(function (data, status, headers, config) {
                            alert("错误");
                        });
                    }
                }
            });
        };

        $scope.lookall = function () {//查看所有组合API
            var combination = [];
            $http({
                method: 'get',
                url: 'http://www.linyimin.club:8001/apis/getAllAPI',
                params: {}, // 传递数据作为字符串，从前台传到后台  
            }).success(function (data, status, headers, config) { //这里的data，就是后台传递过来的数据jsonArray  
                if (data.result == true) {
                    ngDialog.open({
                        template: 'lookall.html',
                        className: 'ngdialog-theme-default',
                        width: 1100,
                        controller: function ($scope) {
                            $scope.show = function () {
                                $scope.closeThisDialog(); //关闭弹窗
                            };
                            angular.forEach(data.datum, function (data) {
                                if (data.type == "组合") {
                                    combination.push(data);
                                }
                            });
                            $scope.datas = combination;
                        }
                    });
                }
                else {
                    alert(data.reason);
                }
            }).error(function (data, status, headers, config) {
                alert("错误");
            });

        };

        $scope.rename = function () {//重命名
            var combination_r = [];
            $http({
                method: 'get',
                url: 'http://www.linyimin.club:8001/apis/getAllAPI',
                params: {}, // 传递数据作为字符串，从前台传到后台  
            }).success(function (data, status, headers, config) { //这里的data，就是后台传递过来的数据jsonArray  
                if (data.result == true) {
                    ngDialog.open({
                        template: 'rename.html',
                        className: 'ngdialog-theme-default',
                        width: 900,
                        controller: function ($scope) {
                            $scope.show = function () {
                                $scope.closeThisDialog(); //关闭弹窗
                            };
                            angular.forEach(data.datum, function (data) {
                                if (data.type == "组合") {
                                    combination_r.push(data);
                                }
                            });
                            $scope.datas = combination_r;
                            $scope.modify = function (item, $event, index) {//点击修改
                                $($event.target).parent().parent().children('td').eq(1).children('input').removeAttr("disabled");
                            };
                            $scope.ok = function (item, $event, index) {//点击确定
                                var newname = $($event.target).parent().parent().children('td').eq(1).children('input').val();
                                $http({
                                    method: 'get',
                                    url: 'http://www.linyimin.club:8001/apis/renameServiceName',
                                    params: {
                                        "url": item.URL,
                                        "serviceName": newname
                                    }, // 传递数据作为字符串，从前台传到后台  
                                }).success(function (data, status, headers, config) { //这里的data，就是后台传递过来的数据jsonArray  
                                    if (data.result == true) {
                                        alert("修改成功！");
                                        $($event.target).parent().parent().children('td').eq(1).children('input').val(newname);
                                        $($event.target).parent().parent().children('td').eq(1).children('input').attr("disabled", "disabled");
                                    }
                                    else {
                                        alert("失败");
                                        alert(data.reason);
                                    }
                                }).error(function (data, status, headers, config) {
                                    alert("错误");
                                });
                            }
                        }
                    });
                }
                else {
                    alert("失败");
                    alert(data.reason);
                }
            }).error(function (data, status, headers, config) {
                alert("错误");
            });
        };

        $scope.openapi = function () {// 打开某组合api
            var combination_r = [];
            $http({
                method: 'get',
                url: 'http://www.linyimin.club:8001/apis/getAllAPI',
                params: {}, // 传递数据作为字符串，从前台传到后台  
            }).success(function (data, status, headers, config) { //这里的data，就是后台传递过来的数据jsonArray  
                if (data.result == true) {
                    ngDialog.open({
                        template: 'openapi.html',
                        className: 'ngdialog-theme-default',
                        width: 900,
                        controller: function ($scope) {
                            $scope.show = function () {
                                $scope.closeThisDialog(); //关闭弹窗
                            };
                            angular.forEach(data.datum, function (data) {
                                if (data.type == "组合") {
                                    combination_r.push(data);
                                }
                            });
                            $scope.datas = combination_r;

                            $scope.open = function (item, $event, index) {//点击打开
                                $http({
                                    method: 'get',
                                    url: 'http://www.linyimin.club:8001/apis/getCombinationAPIFlow',
                                    params: {
                                        "combinationUrl": item.URL,
                                        "publisher": ''
                                    }, // 传递数据作为字符串，从前台传到后台  
                                }).success(function (data, status, headers, config) { //这里的data，就是后台传递过来的数据jsonArray  
                                    if (data.result == true) {
                                        var intTree = data.datum;//返回字符串
                                        var json_intTree = JSON.parse(intTree);//转为json格式
                                        var str_intTree = '[' + intTree + ']';
                                        SDT.drawInputTree(JSON.parse(str_intTree)); //重绘树，接受一个参数，参数类型为完整树 ，调用后会清空目标画布，并立即重绘
                                        $scope.closeThisDialog();

                                        function json(jsontree) { //遍历树
                                            if ((typeof jsontree == 'object') && (jsontree.constructor == Object.prototype.constructor)) {
                                                var arrey = [];
                                                arrey.push(jsontree);
                                            } else arrey = jsontree;
                                            for (var i = 0; i < arrey.length; i++) {
                                                var node = arrey[i];
                                                (function () {
                                                    var oob = $('#' + node.id);
                                                    oob.click(function () {
                                                        shownodeattr(oob);
                                                        //alert(oob.attr('id'))
                                                    })
                                                })();
                                                if (node.childEles && node.childEles.length > 0) {
                                                    json(node.childEles);
                                                }
                                            }
                                        }
                                        json(json_intTree); //json格式

                                        isroot();

                                        function shownodeattr(oob) {//显示打开的组合api中某个原子api的属性 
                                            function json(jsontree) { //根据id找到相应树节点
                                                if ((typeof jsontree == 'object') && (jsontree.constructor == Object.prototype.constructor)) {
                                                    var arrey = [];
                                                    arrey.push(jsontree);
                                                } else arrey = jsontree;
                                                for (var i = 0; i < arrey.length; i++) {
                                                    var node = arrey[i];
                                                    if (node.id == oob.attr('id')) {
                                                        shownodeattr1(node, oob, item.URL);
                                                        return;
                                                    }
                                                    if (node.childEles && node.childEles.length > 0) {
                                                        json(node.childEles);
                                                    }
                                                }
                                            }
                                            json(json_intTree);
                                        }
                                    }
                                    else {
                                        alert("失败");
                                        alert(data.reason);
                                    }
                                }).error(function (data, status, headers, config) {
                                    alert("错误");
                                });

                            }
                        }
                    });
                }
                else {
                    alert("失败");
                    alert(data.reason);
                }
            }).error(function (data, status, headers, config) {
                alert("错误");
            });
        };

        $scope.newwindow = function () {//打开新窗口
            window.open("index.html");
        };

        $scope.systemClose = function () {//关闭窗口
            if (confirm("您确定要关闭该窗口吗？")) {
                //$window.close();
                //window.location.href = "about:blank";
                if (navigator.userAgent.indexOf("Firefox") != -1 || navigator.userAgent.indexOf("Chrome") != -1) {
                    window.location.href = "about:blank";
                    window.close();
                } else {
                    window.opener = null;
                    window.open("", "_self");
                    window.close();
                }
            }
        };

        $scope.fullScreen = function () {//全屏显示
            var obj = document.getElementById("navnav");
            obj.style.cssText = "background-color: #1e79a9;height:60px;    margin-bottom: 60px;";
            var foot = document.getElementById('foot');
            foot.style.cssText = "text-align:center;background-color:#cfd5d6;position: absolute; bottom:0;";
            var docElm = document.documentElement;
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }
            else if (docElm.msRequestFullscreen) {
                docElm = document.body; //overwrite the element (for IE)
                docElm.msRequestFullscreen();
            }
            else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }
            else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            }
        };

        $scope.exitScreen = function () {//退出全屏
            var obj = document.getElementById("navnav");
            obj.style.cssText = "background-color: #1e79a9;height:60px;    margin-bottom: 40px;";
            var foot = document.getElementById('foot');
            foot.style.cssText = "text-align:center;position: absolute;bottom:0;background-color:#cfd5d6;";
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
        };

        $scope.howtouse = function () {//使用说明
            ngDialog.open({
                template: 'howtouse.html',
                className: 'ngdialog-theme-default',
                width: 1100,
                appendClassName: 'upup' ,
                controller: function ($scope) {
                    $scope.show = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    };
                }
            });

        };


    }
]);