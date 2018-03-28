var routerApp = angular.module('routerApp', ['ui.router', 'ngDialog']);
routerApp.config(function ($stateProvider, $urlRouterProvider) {//不再使用$routeProvider
    $urlRouterProvider.otherwise('/index');
    $stateProvider
        .state('index', {
            url: '/index',//url
            views: {
                '': {//该模板将ui-view分成了两个ui-view部分
                    templateUrl: 'tpls3/index.html'
                },
                'topbar@index': {//上方导航栏
                    templateUrl: 'tpls3/topbar.html'
                },
                'main@index': {//主要部分
                    templateUrl: 'tpls3/home.html'
                }
            }
        })
        .state('index.usermng', {//用.来分隔子模块
            url: '/usermng',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/userlist.html',
                    controller: function ($scope, $http, $state) {
                        $http({
                            method: 'GET',
                            url: 'json/user.json'
                        }).then(function successCallback(response) {
                            $scope.names = response.data.datum;
                            console.log(response.data.datum);
                        }, function errorCallback(response) {

                        });
                        $scope.edit = function () {
                            $state.go("index.edituser");
                        };
                        $scope.adduser = function () {
                            $state.go("index.adduser");
                        };
                        $scope.pluginmng1 = function () {
                            $state.go("index.userpluginmng");
                        };
                        //错误弹窗

                    }

                }
            }
        })
        .state('index.edituser', {
            url: '/edituser',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/edituser.html',
                    controller: function ($scope, $http, $state) {
                        $scope.edituser = function () {
                            $http({
                                method: "GET",
                                url: "http://www.linyimin.club:8001/user/updateUser",
                                params: {
                                    username: $scope.username,
                                    realname: $scope.realname,
                                    pwd: $scope.pwd,
                                    email: $scope.email,
                                    role: $scope.role
                                }
                            }).success(function (data, status, headers, config) {
                                alert("success");
                            }).error(function (data, status, headers, config) {
                                alert("fail");
                            });
                        };
                    }

                }
            }
        })
        .state('index.adduser', {
            url: '/adduser',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/adduser.html'
                }
            }
        })
        .state('index.userpluginmng', {
            url: '/userpluginmng',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/pluginmng.html',
                    controller: function ($scope, $http, $state) {
                        $http({
                            method: 'GET',
                            url: 'json/user.json'
                        }).then(function successCallback(response) {
                            $scope.names = response.data.datum;
                            console.log(response.data.datum);
                        }, function errorCallback(response) {

                        });
                        $scope.edit = function () {
                            $state.go("index.editplugin");
                        };
                        $scope.addplugin = function () {
                            $state.go("index.addplugin");
                        };
                    }
                }
            }
        })
        .state('index.project', {
            url: '/project',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/project1.html',
                    controller: function ($scope, $http, $state) {//不用加控制器直接运行就可以加载出来。
                        $http({
                            method: 'GET',
                            url: 'json/project.json'
                        }).then(function successCallback(response) {
                            $scope.projects = response.data.datum;
                            // alert(response.data.datum);
                        }, function errorCallback(response) {
                            alert(response);
                        });
                        $scope.editproject = function (list) {
                            $state.go('index.editproject', {ID: $scope.projects[0].ID});
                        }

                        $scope.delete = function () {

                        }
                        $scope.check = function (list) {
                            alert(list.upstreamUrl);
                            $http({
                                method: 'post',
                                url: 'http://www.linyimin.club:8001/viewSoursePerformance',
                                params: {"name": list.upstreamUrl}, // 传递数据作为字符串，从前台传到后台
                            }).then(function successCallback(response) { //这里的data，就是后台传递过来的数据jsonArray
                                alert(response.data._datum);
                                // alert($data);
                                // alert(data._totleVisit);
                                // $scope.data = [
                                //     data._serverName,data._totleVisit,data._concurrentVolume,data._averageResponseTime,data._unitTimeTotleVisit
                                // ]
                                // alert($scope.name);
                                api = response.data._datum;
                                alert(response.data._datum._serverName);
                                console.log(response.data._datum);
                                // $scope.apiname = data._serverName;
                                // $scope.totleVisit = data._totleVisit;
                                // $scope.concurrentVolume = data._concurrentVolume;
                                // $scope.averageResponseTime = data._averageResponseTime;
                                // $scope.unitTimeTotleVisit = data._unitTimeTotleVisit;
                            }, function errorCallback(response) {
                                alert("错误");
                                // $scope.information(data);
                            });
                        };
                    }
                }
            }
        })
        .state('index.addproject', {
            url: '/addproject',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/addproject.html'
                }
            }
        })
        .state('index.editproject', {
            url: '/editproject',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/editproject.html'
                }
            }
        })
        .state('index.queryapi', {
            url: '/queryapi',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/api.html',
                    controller: function ($scope, $http, $state, $rootScope, ngDialog) {
                        $http({
                            method: 'GET',
                            url: 'http://www.linyimin.club:8001/apis/getAllAPIInfoWithKong',
                        }).then(function successCallback(response) {
                            var a = JSON.stringify(response.data.datum)
                            //alert(a);
                            $scope.names = response.data.datum;
                            console.log(response.data.datum);
                            return a;
                        }, function errorCallback(response) {
                            // 请求失败执行代码
                            //alert(response);
                        });
                        $scope.deleteAPI = function (list) {
                            alert(list.appId);
                            alert(list.interface);
                            $scope.names.splice($scope.names.indexOf(list), 1);
                            $http({
                                method: 'POST',
                                url: 'http://www.linyimin.club:8001/apis/removeSingleAPI',
                                params: {"APPId": list.appId, "from": list.interface},
                            }).then(function successCallback(response) {
                                alert("注销成功");
                            }, function errorCallback(response) {
                                // 请求失败执行代码
                                alert(response);
                            });
                        };
                    }
                }
            }
        })
        .state('index.editapi', {
            url: '/editapi',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/editapi1.html'
                }
            }
        })
        .state('index.addapi', {
            url: '/addapi',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/addapi.html'
                }
            }
        })
        .state('index.report', {
            url: '/report',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/pluginmng.html',
                    controller: function ($scope, $http, $state) {
                        $http({
                            method: 'GET',
                            url: 'json/user.json'
                        }).then(function successCallback(response) {
                            $scope.names = response.data.datum;
                            console.log(response.data.datum);
                        }, function errorCallback(response) {

                        });
                        $scope.edit = function () {
                            $state.go("index.editplugin");
                        };
                        $scope.addplugin = function () {
                            $state.go("index.addplugin");
                        };
                    }
                }
            }
        })
        .state('index.editplugin', {
            url: '/editplugin',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/editplugin.html'
                }
            }
        })
        .state('index.addplugin', {
            url: '/addplugin',
            views: {
                'main@index': {
                    templateUrl: 'tpls3/addplugin.html'
                }
            }
        })
        .state('index.settings', {
            url: '/settings',
            views: {
                'main@index': {
                    template: '这里是系统设置'
                }
            }
        })
})
    .controller('popup', function ($scope, ngDialog) {
        $scope.clickToOpen = function () {
            ngDialog.open({
                template: '\
			                <p>确定要删除?</p>\
			                <div class="ngdialog-buttons">\
			                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="closeThisDialog(0)">No</button>\
			                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="confirm(1)">Yes</button>\
			                </div>',
                plain: true,
                className: 'ngdialog-theme-default',
                controller: function ($scope) {
                    $scope.show = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    }
                }
            });
        };
    })
    .controller("EngineeringController", ["$scope", function ($scope) {
        $scope.engineer = {
            name: "Dani",
            currentActivity: "Fixing bugs"
        };

        $scope.activities =
            [
                "Writing code",
                "Testing code",
                "Fixing bugs",
                "Dancing"
            ];
    }])
    //上传文件弹出框显示
    .controller('UploadCtrl', function ($scope, ngDialog) {
        $scope.openModal = function () {
            ngDialog.open({
                templateUrl: 'tpls3/addapi.html',
                controller: function ($scope, $http) {
                    $scope.close = function () {
                        $scope.closeThisDialog(); //关闭弹窗
                    },
                        $scope.ok = function () {
                            var form = new FormData();
                            var file = document.getElementById("fileUpload").files[0];

                            form.append('file', file);
                            $http({
                                method: 'POST',
                                url: 'http://www.linyimin.club:8001/apis/uploads' + '?fileName=' + $scope.text,
                                data: form,
                                headers: {'Content-Type': undefined},
                                transformRequest: angular.identity
                            }).success(function (data) {
                                alert('上传 success');
                                console.log(data);
                            }).error(function (data) {
                                alert('operation fail');
                            });
                        };
                }
            });
        };
    })
    //编辑api信息
    .controller('editAPICtrl', function ($scope, ngDialog) {
        $scope.editAPI = function (list) {
            // alert(list.appId);
            // alert(list.interface);
            ngDialog.open({
                templateUrl: 'tpls3/editapi1.html',
                controller: function ($scope, $http) {
                    $http({
                        method: 'GET',
                        url: 'http://www.linyimin.club:8001/apis/getAPIInfoByAPPIdAndURL',
                        params: {"appId": list.appId, "url": list.interface},
                    }).then(function successCallback(response) {
                        $scope.datas = response.data.datum;
                        // testFactory.setter($scope.datas);
                        // alert($scope.datas);
                        $scope.name = $scope.datas.name;
                        $scope.URL = $scope.datas.URL;
                        // alert(response.data.datum.name);
                        console.log(response.data.datum);
                        return response.data.datum;
                    }, function errorCallback(response) {
                        alert(response);
                    });
                    $scope.save = function () {
                        $http({
                            method: 'POST',
                            url: 'http://www.linyimin.club:8001/apis/updateSingleAPI',
                            params: {"appId": list.appId, "url": list.interface},
                        }).then(function successCallback(response) {
                            $scope.datas = response.data.datum;
                            // testFactory.setter($scope.datas);
                            // alert($scope.datas);
                            $scope.name = $scope.datas.name;
                            $scope.URL = $scope.datas.URL;
                            // alert(response.data.datum.name);
                            console.log(response.data.datum);
                            return response.data.datum;
                        }, function errorCallback(response) {
                            alert(response);
                        });
                    };
                }
            });
        };
    })
    //删除某个API
    .controller('deleteAPICtrl', function ($scope,ngDialog) {
        $scope.deleteAPI = function (list) {
            ngDialog.open({
                template: '\
			                <p>确定要删除?</p>\
			                <div class="ngdialog-buttons">\
			                    <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="n()">No</button>\
			                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="deleteAPI(list)">Yes</button>\
			                </div>',
                plain: true,
                className: 'ngdialog-theme-default',
                controller: function ($scope, $http) {
                    $scope.deleteAPI = function (list) {
                        alert(list.appId);
                        alert(list.interface);
                        $scope.names.splice($scope.names.indexOf(list), 1);
                        $http({
                            method: 'POST',
                            url: 'http://www.linyimin.club:8001/apis/removeSingleAPI',
                            params: {"APPId": list.appId, "from": list.interface},
                        }).then(function successCallback(response) {
                            alert("注销成功");
                        }, function errorCallback(response) {
                            // 请求失败执行代码
                            alert(response);
                        });
                    };
                }
            });
        };
    })

    //弹出框显示项目简介
    .controller('openProjectCtrl', function ($scope, ngDialog) {
        $scope.openProject = function (project) {
            alert(project.introduction);
            ngDialog.open({
                templateUrl: 'tpls3/projectIntroduction.html',
                controller: function ($scope, $http, $state) {//不用加控制器直接运行就可以加载出来。
                    alert(project.introduction);
                    var introduction = project.introduction;
                    $scope.Introduction = introduction;
                    // $http({
                    //     method: 'GET',
                    //     url: 'json/project.json'
                    // }).then(function successCallback(response) {
                    //     $scope.projects = response.data.datum;
                    //     $scope.Introduction = $scope.projects.introduction;
                    //     // alert(response.data.datum);
                    // }, function errorCallback(response) {
                    //     alert(response);
                    // });
                }
            });
        };
    })

// .controller('uploadController',['$scope', 'FileUploader', function($scope, FileUploader) {
//     $scope.uploadStatus = $scope.uploadStatus1 = false; //定义两个上传后返回的状态，成功获失败
//     var uploader = $scope.uploader = new FileUploader({
//         url: 'upload.php',
//         queueLimit: 1,     //文件个数
//         removeAfterUpload: true   //上传后删除文件
//     });
//     var uploader1 = $scope.uploader1 = new FileUploader({
//         url: 'upload.php',
//         queueLimit: 1,
//         removeAfterUpload: true
//     });
//     $scope.clearItems = function(){    //重新选择文件时，清空队列，达到覆盖文件的效果
//         uploader.clearQueue();
//     }
//     $scope.clearItems1 = function(){
//         uploader1.clearQueue();
//     }
//     uploader.onAfterAddingFile = function(fileItem) {
//         $scope.fileItem = fileItem._file;    //添加文件之后，把文件信息赋给scope
//     };
//     uploader1.onAfterAddingFile = function(fileItem) {
//         $scope.fileItem1 = fileItem._file;    //添加文件之后，把文件信息赋给scope
//         //能够在这里判断添加的文件名后缀和文件大小是否满足需求。
//     };
//     uploader.onSuccessItem = function(fileItem, response, status, headers) {
//         $scope.uploadStatus = true;   //上传成功则把状态改为true
//     };
//     uploader1.onSuccessItem = function(fileItem,response, status, headers){
//         $scope.uploadStatus1 = true;
//     }
//     $scope.UploadFile = function(){
//         uploader.uploadAll();
//         uploader1.uploadAll();
//         if(status){
//             if(status1){
//                 alert('上传成功！');
//             }else{
//                 alert('证书成功！私钥失败！');
//             }
//         }else{
//             if(status1){
//                 alert('私钥成功！证书失败！');
//             }else{
//                 alert('上传失败！');
//             }
//         }
//     }
// }])