/**
 * Created by xuezekui on 2017/7/25.
 */

;
'use strict';

var app = angular.module('myApp',[]);

    app.directive('listGroup',['$parse',function($parse){
        function ctrler($scope,$element,$attrs,$timeout){
            $scope.liststyle = {
                'width': $attrs.width,
                'height': $attrs.height
            }

            var datas = [];
            $scope.$watchCollection('listData',function(v){
                if(v){
                    datas = [];
                    angular.forEach(v,function(data,index){
                        datas.push(data);
                    })
                    $scope.listDatas = datas;
                }
            });

            $scope.onRoleItemClick = function(role){
                role.selected = role.selected == true ? false : true;
            };
        }

        return {
            restrict: 'EA',
            scope: {
                listData: '=listData',
                code: '@code',
                text: '@text',
                width: '@width',
                height: '@height'
            },
            replace: true,
            templateUrl: './libs/html/listGroup.html',
            controller:ctrler
        }
    }]);

