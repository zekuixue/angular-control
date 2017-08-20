/**
 * Created by xuezekui on 2017/7/13.
 */
;

'use strict';
var app = angular.module('myApp',['ui.bootstrap']);
app.service('Modal',['$modal','$timeout',function($modal,$timeout){
    this.alert = function(title,msg,size,height,time){
        if("" != size && undefined != size){
            $modal.open({
                templateUrl: './libs/html/alertmodel.html',
                backdrop: 'static',
                size: size,
                controller: ['$scope','$modalInstance',function($scope,$modalInstance){
                    $scope.msg = msg;
                    $scope.title = title;
                    $scope.height = height;
                    $scope.sure = function(){
                        $modalInstance.close();
                    };
                    $scope.cancel = function(){
                        $modalInstance.close();
                    };
                    if("" != time && undefined != time){
                        $timeout(function(){
                            $modalInstance.close();
                        },time);
                    }
                }]
            });
        } else {
            $modal.open({
                templateUrl: './libs/html/alertmodel.html',
                backdrop: 'static',
                size: 'sm',
                controller: ['$scope','$modalInstance',function($scope,$modalInstance){
                    $scope.msg = msg;
                    $scope.title = title;
                    $scope.height = height;
                    $scope.sure = function(){
                        $modalInstance.close();
                    };
                    $scope.cancel = function(){
                        $modalInstance.close();
                    };
                    if(null != time && undefined != time){
                        $timeout(function(){
                            $modalInstance.close();
                        },time);
                    }
                }]
            });
        }
    };


    this.confirm = function(title,msg,size,height,time){
        if("" != size && undefined != size){
            $modal.open({
                templateUrl: './libs/html/confirm.html',
                backdrop: 'static',
                size: size,
                controller: ['$scope','$modalInstance',function($scope,$modalInstance){
                    $scope.msg = msg;
                    $scope.title = title;
                    $scope.height = height;
                    $scope.sure = function(){
                        $modalInstance.close();
                    };
                    $scope.cancel = function(){
                        $modalInstance.dismiss('cancel');
                    };
                    if("" != time && undefined == time){
                        $timeout(function(){
                            $modalInstance.close();
                        },time);
                    }
                }]
            });
        } else {
            $modal.open({
                templateUrl: './libs/html/confirm.html',
                backdrop: 'static',
                size: 'sm',
                controller: ['$scope','$modalInstance',function($scope,$modalInstance){
                    $scope.msg = msg;
                    $scope.title = title;
                    $scope.height = height;
                    $scope.sure = function(){
                        $modalInstance.close();
                    };
                    $scope.cancel = function(){
                        $modalInstance.dismiss('cancel');
                    };
                    if("" != time && undefined != time){
                        $timeout(function(){
                            $modalInstance.close();
                        },time);
                    }
                }]
            });
        }
    };


    this.dialog = function(title,msg,size,height,time){
        if("" != size && undefined != size){
            $modal.open({
                templateUrl: './libs/html/dialog.html',
                backdrop: 'static',
                size: size,
                controller: ['$scope','$modalInstance',function($scope,$modalInstance){
                    $scope.msg = msg;
                    $scope.title = title;
                    $scope.height = height;
                    $scope.sure = function(){
                        $modalInstance.close();
                    };
                    $scope.no = function(){
                        $modalInstance.close();
                    };
                    $scope.cancel = function(){
                        $modalInstance.dismiss('cancel');
                    };
                    if("" != time && undefined != time){
                        $timeout(function(){
                            $modalInstance.close();
                        },time);
                    }
                }]
            });
        } else {
            $modal.open({
                templateUrl: './libs/html/dialog.html',
                backdrop: 'static',
                size: 'sm',
                controller: ['$scope','$modalInstance',function($scope,$modalInstance){
                    $scope.msg = msg;
                    $scope.title = title;
                    $scope.height = height;
                    $scope.sure = function(){
                        $modalInstance.close();
                    };
                    $scope.no = function(){
                        $modalInstance.close();
                    };
                    $scope.cancel = function(){
                        $modalInstance.dismiss('cancel');
                    };
                    if("" != time && undefined != time){
                        timeout(function(){
                            $modalInstance.close();
                        },time);
                    };
                }]
            });
        }
    };

}]);