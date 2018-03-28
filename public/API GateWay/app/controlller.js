var apiGatewayCtrls = angular.module('apiGatewayCtrls', ['ionic', 'ngDialog']);

apiGatewayCtrls.controller('projectCtrl', ['$scope', '$http', '$timeout', 'ngDialog','$rootScope',
	function($scope, $http, $timeout, ngDialog,$rootScope) {
		$http({
			method: 'GET',
			url: 'http://www.linyimin.club:8001/project/queryProject'
		}).then(function successCallback(response) {
			$scope.projects = response.data.datum;
			//			alert(response.data.datum);
            $rootScope.posts=response.data.datum;
		}, function errorCallback(response) {
			alert(response);
		});
		$scope.openProject = function(project) {
			//			alert(project.introduction);
			ngDialog.open({
				templateUrl: '../tpls3/projectIntroduction.html',
				controller: function($scope, $http) { 
					//					alert(project.introduction);
					var introduction = project.introduction;
					$scope.Introduction = introduction;
				}
			});
		};
		$scope.queryApi = function(project){
		    var a = project.name;
		     // alert(a);
     localStorage.name = a;
     // localStorage.publisher = project.publisher;

              // var a = project.name;
              // return a;
		}
		// console.log(localStorage.name);
        $scope.logout = function () {
            $http({
                method:'GET',
                url:'http://www.linyimin.club:8001/user/logout',
                params:{
                    username:sessionStorage.userName
                }
            }).success(function (data,status,headers,config) {
                window.open("../UIRoute3.html","_self");
            }).error(function (data,status,headers,config) {

            });
        }
		$scope.editproject = function(project) {
		    alert(project.name);
		    alert(project.publisher);
			ngDialog.open({
				templateUrl: '../tpls3/editproject.html',
				controller: function($scope, $http) {
					                 $http({
					                     method: 'POST',
					                     url: 'http://www.linyimin.club:8001/project/editProject',
					                     params: {"oldProjectName": project.name, "publisher": project.publisher},
					                 }).then(function successCallback(response) {
					                     $scope.datas = response.data.datum;
					                     // testFactory.setter($scope.datas);
                                         alert($scope.datas);
					                     $scope.name = $scope.datas.name;
					                     $scope.URL = $scope.datas.URL;
					                     // alert(response.data.datum.name);
					                     console.log(response.data.datum);
					                     return response.data.datum;
					                 }, function errorCallback(response) {
					                     alert(response);
				   });
                }
			});
		};
		$scope.addproject = function () {
            ngDialog.open({
                templateUrl: '../tpls3/addproject.html',
                controller: function ($scope, $http) {

                }
            });
        };
		$scope.deleteProject = function (project) {
            ngDialog.open({
                template: '<p>确定要删除该项目吗?</p>' +
                '<div class="ngdialog-buttons">' +
                ' <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="n()">No</button>' +
                ' <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="delete()">Yes</button>' +
                '</div>',
                plain: true,
                className: 'ngdialog-theme-default',
                controller: function ($scope, $http) {
                    $scope.delete = function () {
                        alert(project.name);
                        alert(project.publisher);
//                      $scope.names.splice($scope.names.indexOf(list), 1);
                        $http({
                            method: 'GET',
                            url: 'http://www.linyimin.club:8001/project/deleteProject',
                            params: {"projectName": project.name, "publisher": project.publisher},
                        }).then(function successCallback(response) {
                            alert("删除成功");
                            $scope.closeThisDialog();
                            // $scope.projects.splice($scope.projects.indexOf(project), 1);
                            window.location.href=window.location.href;
                        }, function errorCallback(response) {
                            // 请求失败执行代码
                            alert(response);
                        });
                    };
                }
            });
        };
        // $scope.doUpload = function () {
        //     var formData = new FormData($("#formde")[0]);
        //     $.ajax({
        //         url: 'http://www.linyimin.club:8001/project/addProject',
        //         type: 'POST',
        //         data: formData,
        //         dataType: "json",
        //         success: function(returndata) {
        //             alert(returndata.result);
        //             if(returndata.result == true){
        //                 window.location.href="tpls3/project.html";
        //             }
        //         },
        //         error: function(returndata) {
        //             alert(returndata);
        //         }
        //     });
        // };
	}
]);

apiGatewayCtrls.controller('UploadCtrl', ['$scope', '$http', '$timeout', 'ngDialog',
	function($scope, $http, $timeout, ngDialog) {//顺序很重要，顺序不对出错fn is not function
		$scope.AtomicAPI = '原子API';
		$scope.CombinedAPI = '组合API';
		$scope.LogOutAPI = '注销API';
        // alert(localStorage.name);
		$http({
			method: 'get',
			url: 'http://www.linyimin.club:8001/project/queryAPIByProjectName',
            params:{"projectName":localStorage.name},
		}).then(function successCallback(response) {
			var a = JSON.stringify(response.data.datum);
            var xqo = eval('(' + a + ')');
            var names = [];//创建一个空数组
            var datums = [];
            var datas = [];
            for(var i in xqo) {//对xqo进行遍历，然后对其进行筛选，遍历两遍的原因是第一遍遍历需要把符合条件的json选出来
                if(xqo[i].status == 0 && xqo[i].isAtom == 1 ){
                    names.push(xqo[i]);//对选出来的json数据合并在一起。
                }
                else if(xqo[i].status == 0 && xqo[i].isAtom == 0){
                    datums.push(xqo[i]);
                }
                else if(xqo[i].status == 1){
                    datas.push(xqo[i]);
                }
            }
            for(var i in xqo){
                if(xqo[i].status == 0 && xqo[i].isAtom == 1 ){
                    $scope.names = names;//对数据进行操作
                }
                else if(xqo[i].status == 0 && xqo[i].isAtom == 0){
                    $scope.datums = datums;
                }
                else if(xqo[i].status == 1){
                    $scope.datas = datas;
                }
            }


// alert(response);
//             var a = response.data.datum;
//             alert(a);
//             if()

			console.log(response.data.datum);
//			return a;
		}, function errorCallback(response) {
			// 请求失败执行代码
			alert(response);
		});
		//上传文件弹出框
		$scope.openModal = function() {
			ngDialog.open({
				templateUrl: '../tpls3/addapi.html',
				controller: function($scope, $http) {

				}
			});
		};
		//注销
        $scope.logout = function () {
            $http({
                method:'GET',
                url:'http://www.linyimin.club:8001/user/logout',
                params:{
                    username:sessionStorage.userName
                }
            }).success(function (data,status,headers,config) {
                window.open("../UIRoute3.html","_self");
            }).error(function (data,status,headers,config) {

            });
        }
		//编辑API信息弹出框
		 $scope.editAPI = function (list) {
               alert(list.appId);
               alert(list.interface);
            ngDialog.open({
                templateUrl: '../tpls3/editapi1.html',
                controller: function ($scope, $http) {
                    $http({
                        method: 'GET',
                        url: 'http://www.linyimin.club:8001/apis/getAPIInfoByAPPIdAndURL',
                        params: {"APPId": list.appId, "oldURL": list.interface,"userName":list.publisher},
                    }).then(function successCallback(response) {
                        $scope.datas = response.data.datum;
                        // testFactory.setter($scope.datas);
                         alert($scope.datas);
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
         $scope.deleteAPI = function (list) {
            ngDialog.open({
                template: '<p>确定要删除?</p>'+
			                '<div class="ngdialog-buttons">'+
			                   ' <button type="button" class="ngdialog-button ngdialog-button-secondary" ng-click="n()">No</button>'+
			                   ' <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click="delete()">Yes</button>'+
			                '</div>',
                plain: true,
                className: 'ngdialog-theme-default',
                controller: function ($scope, $http) {
                    $scope.delete = function () {
                        alert(list.appId);
                        alert(list.interface);
//                      $scope.names.splice($scope.names.indexOf(list), 1);
                        $http({
                            method: 'POST',
                            url: 'http://www.linyimin.club:8001/apis/removeSingleAPI',
                            params: {"APPId": list.appId, "from": list.interface},
                        }).then(function successCallback(response) {
                            alert("注销成功");
                            $scope.closeThisDialog();
                        }, function errorCallback(response) {
                            // 请求失败执行代码
                            alert(response);
                        });
                    };
                }
            });
        };
	}
]);

apiGatewayCtrls.controller('loginCtrl', ['$scope', '$http','$location','$state',
    function($scope, $http,$location,$state) {
    $scope.login = function () {
        window.open("tpls3/login.html","_self");
    }
        $scope.entity={currentRole: "超级管理员"};
        $scope.roles =
            [
                "超级管理员",
                "项目管理员"
            ];
        //获取cookie
        // alert(document.cookie);
        $scope.getCookie =function(name){
            var reg=RegExp(name+'=([^;]+)');//不太懂
            var arr=document.cookie.match(reg);
            if(arr){
                return arr[1];
            }else{
                return "";
            }
        }
        //删除cookie
        $scope.delCookie=function(name) {
            setCookie(name,null,-1);
        }
        //设置cookie
        $scope.setCookie=function(name,value,day) {
            var date=new Date();
            date.setDate(date.getDate()+day);
            document.cookie=name+"="+value+";expires"+date;
        }
        //记住密码
        //页面初始化时，如果账号密码cookie存在则填充
        if($scope.getCookie('username')&& $scope.getCookie('password')){
            $scope.entity.userName=$scope.getCookie('username');
            $scope.entity.password=$scope.getCookie('password');
            $scope.entity.remember=true;
        }
        $scope.submitForm=function(valid){
            if(valid){
                console.log('hello AngularJS');
            }
            //alert($scope.entity.remember);
            //表单提交事件发生时，如果复选框是勾选状态则保存cookie
            if($scope.entity.remember==true){
                $scope.setCookie('username',$scope.entity.userName,7);//保存账号到cookie，有限期7天
                $scope.setCookie('password',$scope.entity.password,7);
            }else{
                //如果未勾选则清除cookie
                $scope.delCookie('username');
                $scope.delCookie('password');
            }

            $http({
                method:'GET',
                url:'http://www.linyimin.club:8001/user/doLogin',
                params:{
                    username:$scope.entity.userName,
                    pwd:$scope.entity.password,
                    role:$scope.entity.currentRole
                }
            }).success(function(data,status,headers,config){
                if(data.result==true){
                    console.log(data.datum.role);
                    sessionStorage.userName=data.datum.userName;
                    window.open("../tpls3/project.html","_self");
                    // if(data.datum.role == '超级管理员'){
                    //     $location.path('/indexlogin');
                    // }
                    // if(data.datum.role == '项目管理员'){
                    //     $location.path('/projectindexlogin');
                    // }
                }
                if(data.result==false){
                    alert(data.reason);
                }
            }).error(function(data,status,headers,config){
                alert("接口不可用");
            });
        };
        $scope.regist = function () {
            window.open("tpls3/register.html","_self");
        };

        $scope.userdata={currentRole: "超级管理员"};

        $scope.roles =
            [
                "超级管理员",
                "项目管理员"
            ];
        $scope.submitForm1 =function(){
            //		console.log($scope.userdata);
            //		if($scope.signUpForm.$invalid){
            //			alert("请检查信息");
            //		}else{
            //			alert("成功");
            //		}
            if($scope.userdata.password != $scope.userdata.password2){
                alert("两次输入密码不一致");
            }else{
                $http({
                    method:'GET',
                    url:'http://www.linyimin.club:8001/user/register',
                    params:{
                        username:$scope.userdata.username,
                        email:$scope.userdata.email,
                        pwd:$scope.userdata.password,
                        role:$scope.userdata.currentRole,
                        realname:$scope.userdata.realname
                    }
                }).success(function(data,status,headers,config){
                    if(data.result){
                        alert("success");
                        window.open("../tpls3/login.html","_self");
                        // window.open("login.html")
                    }else{
                        alert("用户名重复");
                    }

                }).error(function(data,status,headers,config){
                    alert("接口不可用");
                });
            }
        };

    }

    ]);
apiGatewayCtrls.controller('checkCtrl', ['$scope', '$http',
    function($scope, $http) {
        //注销
        $scope.logout = function () {
            $http({
                method:'GET',
                url:'http://www.linyimin.club:8001/user/logout',
                params:{
                    username:sessionStorage.userName
                }
            }).success(function (data,status,headers,config) {
                window.open("../UIRoute3.html");
            }).error(function (data,status,headers,config) {

            });
        };
    }
    ]);