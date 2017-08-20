/**
 * Created by xuezekui on 2017/7/31.
 */
;
(function(){
    'use strict';

    var app = angular.module('intro.directive');
    app.directive('pageCommon',['$parse','introBaseURL',function($parse,baseUrl){
        function linker($scope,$elem,$attrs,$ctrl){
            $scope.limit = $parse($attrs.limit)($scope.light);
            $scope.id = $attrs.id;
            var emitkey = getEmitkey();


            function getEmitkey(){
                if($attrs.monitorName){
                    return attrs.monitorName;
                }else{
                    return 'pageTool.skipPage';
                }
            };

            $scope.limits = ['5','10','20','30','40','50','60','70','80','90','100'];

            $scope.skipNextPage = function(){
                if(($scope.totalPage === 0 && $scope._currentPage < 0) || ($scope.totalPage > 0 && $scope._currentPage < $scope.totalPage)){
                    $scope.skipPage(parseInt($scope._currentPage) + 1);
                }
            }

            $scope.skpPrePage = function(){
                if(($scope.totalPage === 0 && $scope._currentPage > 0) || ($scope.totalPage > 0 && $scope._currentPage > 1)){
                    $scope.skipPage(parseInt($scope._currentPage) - 1);
                }
            }


            $scope.skipPage = function(page){
                $scope._currentPage = page;
                $scope.currentPageInput = page;
                $scope.currentPage = page;
                $scope.$emit(emitkey.page);
            }


            $scope.onSkip = function(){
                if(isNan($scope.currentPageInput)){
                    alert('请输入数字');
                }else if($scope.currentPageInput < 1){
                    alert("输入页数不能小于1");
                }else if($scope.currentPageInput != parseInt($scope.currentPageInput)){
                    alert('输入页数必须为整数');
                }else if($scope.currentPageInput > $scope.totalPage){
                    alert('输入页数大于总页数');
                }else{
                    $scope.currentPage =  $scope.currentPageInput;
                    $scope._currentPage = $scope.currentPageInput;
                    $scope.$emit(emitkey,$scope.currentPageInput);
                }
            }

            $scope.$parent.$watch($attrs.currentPage,function(v){
                if(v){
                    $scope.currentPageInput = v;
                    $scope._currentPage = v;
                }else{
                    $scope.currentPageInput = 0;
                    $scope._currentPage = 0;
                }
            });

            $scope.$watch('totalCount',function(v){
                if(v){
                    $scope.pageTotalCount = v;
                    $scope.homePage = 1;
                    $scope.totalPage = Math.ceil(v/$scope.limit);
                    if(!$scope.currentPageInput){
                        $scope.currentPageInput = 1;
                        $scope._currentPage = 1;
                    }
                }else{
                    $scope.pageTotalCount = 0;
                    $scope.homePage = 0;
                    $scope.totalPage = 0;
                    $scope.currentPageInput = 0;
                    $scope._currentPage = 0;
                }
            });


            $scope.$watch('limit',function(v){
                if(v){
                    $scope.limit = v;
                    $scope.homePage = 1;
                    $scope.totalPage = Math.ceil($scope.pageTotalCount / $scope.limit);
                    $scope.currentPageInput = 1;
                    $scope._currentPage = 1;
                    $scope.$emit('pageCommon',v);
                }
            });
        }

        return{
            restrict: 'E',
            replace: true,
            scope: {
                currentPage: '=currentPage',
                totalCount: '='
            },
            templateUrl: baseUrl + 'app/views/common/directives/page.htm',
            link: linker
        };

    }]);
})();
