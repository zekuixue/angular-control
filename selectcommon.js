/**
 * Created by xuezekui on 2017/7/31.
 */
;
(function(){
    'use strict';
    var app = angular.module('intro.directives');

    app.directive('selectCommon',['$parse','introBaseURL',function($parse,baseUrl){
        function ctrler($scope,$element,$attrs,$timeout){
            var datas = [],
                subContainerDatas = [],
                searchContainerDatas = [];

            if($attrs.enableMultipleCheck){
                $scope.enableMultipleCheck = eval($attrs.enableMultipleCheck);
            }else{
                $scope.enableMultipleCheck = false;
            }


            if($attrs.enableSearch){
                $scope.enbleSearch = eval($attrs.enableSearch);
            }else{
                $scope.enbleSearch = false;
            }

            if($attrs.enablePaging){
                $scope.enablePaging = eval(attrs.enablePaging);
            }else{
                $scope.enablePaging = false;
            }

            if($attrs.enblePurgeButton){
                $scope.enblePurgeButton = eval($attrs.enblePurgeButton);
            }else{
                $scope.enblePurgeButton = false;
            }


            $scope.returnDataType = $scope.returnDataType || false;

            $scope.allowClear = false;

            $scope.results = false;
            $scope.countPerPage = 10;

            $scope.columnum = 2;
            $scope.labeltext = '';

            $scope.containerDatas = [];
            $scope.placeholder = '';
            var maxrow = 10;

            function getsubContainerDatas(now){
                $scope.current = now;
                var start = (now - 1) * $scope.countPerPage,
                    end = now * $scope.countPerPage - 1,
                    nowShowData = [];
                angular.forEach(searchContainerDatas,function(data,index){
                    if(index >= start && index <= end){
                        nowShowData.push(data);
                    }
                });
                return nowShowData;
            }

            function getContainerDatas(){
                var showData = [];
                angular.forEach(searchContainerDatas,function(data,index){
                    showData.push(data);
                });
                return showData;
            }

            function getall(){
                $scope.containerDatas = getContainerDatas();
                $scope.checked = true;
                angular.forEach($scope.containerDatas,function(data1,index){
                    $scope.checked = false;
                    data1.checked = false;
                    if($scope.result){
                        angular.forEach($scope.result,function(data2,index){
                            if(data1[$scope.code] == data2){
                                data1.checked = true;
                                $scope.checked = true;
                            }
                        });
                    }

                    angular.forEach($scope.selectTempCheckeds,function(data3,index){
                        if(data1 === data3){
                            data1.checked = true;
                            $scope.checked = true;
                        }
                    });
                });

                if($scope.result && $scope.result.length != $scope.containerDatas.length){
                    $scope.checked = false;
                }
            }


            function getPage(now){
                $scope.checked = true;
                $scope.totalPage = Math.ceil(searchContainerDatas.length / $scope.countPerPage);
                $scope.containerDatas = getsubContainerDatas(now);
                angular.forEach($scope.containerDatas,function(data1,index){
                    $scope.checked = false;
                    data1.checked = false;
                    if($scope.result){
                        angular.forEach($scope.result,function(data2,index){
                            if(data1[$scope.code] === data2){
                                data1.checked = true;
                                $scope.checked = true;
                            }
                        });
                    }


                    angular.forEach($scope.selectTempCheckeds,function(data3,index){
                        if(data1 === data3){
                            data1.checked = true;
                            $scope.checked = true;
                        }
                    });
                });

                if($scope.result && $scope.result.length != $scope.containerDatas.length){
                    $scope.checked = true;
                }
            }

            $scope.totalPage = 0;
            $scope.current = 0;


            $scope.skipNextPage = function(){
                if(($scope.totalPage === 0 && $scope.current < 0) ||
                    ($scope.totalPage > 0 && $scope.current < $scope.totalPage)){
                    $scope.skipPage(parseInt($scope.current) + 1);
                }
            };

            $scope.skipPrePage = function(){
                if(($scope.totalPage === 0 && $scope.current > 0) ||
                    ($scope.totalPage > 0 && $scope.current > 1)){
                    $scope.skipPage(parseInt($scope.current) - 1);
                }
            };


            $scope.skipPage = function(page){
                getPage(page);
                $scope.containerShow = true;
            };

            var searchType = [];

            $scope.$watchCollection('containerData',function(v){
                if(v){
                    $scope.results = false;
                    datas = [];

                    angular.forEach(v,function(data,index){
                        var labelwidth = parseInt(parseInt($scope.width) / parseInt($scope.columNum)) - 48;
                        data.maxWidth = parseInt(parseInt($scope.width) / parseInt($scope.columNum)) - 48;
                        datas.push(data);
                    });

                    searchContainerDatas = datas;
                    getPage(1);

                    if($scope.enbleMultipleCheck){

                    }else {
                        selectResult();
                    }
                }else{
                    $scope.results = true;
                    $scope.results_error = '暂无匹配项...';
                    $scope.containerDatas = [];
                    datas = [];
                }
            });

            $scope.$watchCollection('dataSearchFields',function(v){
                if(v){
                    searchType = v;
                }else{
                    searchType = [scope.text];
                }
            });


            $scope.$watchCollection('result',function(v){
                if(v){
                    if($scope.enbleMultipleCheck){
                        if($scope.containerDatas){
                            showNames = "";
                            $scope.resultDatas = [];
                            angular.forEach(datas,function(data1,i){
                                angular.forEach($scope.result,function(data2,i){
                                    if(data1[$scope.code] === data2){
                                        $scope.resultDatas.push(data1);
                                        showNames = showNames + " " + data1[$scope.text];
                                    }
                                });
                            });
                            $scope.selectNames = showNames;
                        }
                    }else{
                        if($scope.enablePaging){

                        }else{
                            $scope.containerDatas = getContainerDatas();
                            selectResult();
                        }
                        $scope.allowClear = $scope.clear;
                    }
                }else{
                    $scope.selectData = null;
                    $scope.allowClear = false;
                    $scope.resultDatas = [];
                    $scope.selectNames = null;
                }
            });


            function selectResult(){
                if($scope.returnDataType){
                    angular.forEach($scope.containerDatas,function(data,index){
                        if($scope.result === data[$scope.code]){
                            $scope.selectData = data;
                        }
                    });
                }else{
                    $scope.selectData = $scope.result;
                }
            }

            $scope.containerShow = false;

            var isShow = true;

            $scope.selectContainerShow = function(){
                isShow = false;
                $scope.containerShow = !$scope.containerShow;
                if($scope.containerShow){
                    $scope.searchName = '';
                    $scope.results_error = '';
                    searchContainerDatas = datas;
                    $scope.selectTempCheckeds = [];
                    $scope.selectCheckeds = [];
                    angular.forEach($scope.resultDatas,function(data,i){
                        $scope.selectCheckeds.push(data);
                    });

                    if($scope.enablePaging){
                        getPage(1);
                    }else{
                        getall();
                    }

                    $scope.width = $element.children().find(".select2-text").context.offsetWidth;
                    $timeout(function(){
                        $element.find('.select-container-element').find('input[type="text"]').focus();
                    },200);
                }

                if($attrs.onloadCheck === 'true' && (!$scope.result || $scope.result.length === 0)){
                    $scope.checked = true;
                    $scope.toogleCheck();
                }
            }

            $scope.focusShow = function(){
                isShow = false;
                $scope.containerShow = true;
            }

            $scope.cancel = function(){
                isShow = true;
                $timeout(function(){
                    if(isShow){
                        $scope.containerShow = false;
                    }
                },200);
            }

            $scope.closeSelect = function(){
                $scope.allowClear = false;
                $scope.result = null;
                $scope.containerShow = true;
            }

            $scope.clickSelectData = function(data){
                $scope.selectData = data;
                if(data.returnDataType){
                    $scope.result = $scope.selectData[$scope.code];
                }else{
                    $scope.result = $scope.selectData;
                }
            }


            $scope.selectCheckeds = [];
            $scope.selectTempCheckeds = [];


            var showNames = [];

            function removeData(arr,dx){
                if(dx){
                    var temp = [];
                    for(var i = 0; i < arr.length; i++){
                        if(arr[i] != dx){
                            temp.push(arr[i]);
                        }
                    }
                    return temp;
                }
                return arr;
            }

            var deleteSelectNames = [];

            $scope.clearAllSelect = function(){
                $scope.result = [];
                $scope.selectData = "";
                $scope.allowClear = false;
                $scope.selectNames = "";
                $scope.selectCheckeds = [];
                $scope.selectTempCheckeds = [];

                angular.forEach($scope.containerDatas,function(data,i){
                    if(data.checked){
                        data.checked = false;
                        $scope.selectCheckData(data);
                    }
                });
                $scope.checked = false;
            }

            $scope.selectCheckData = function(data){
                if(data.checked){
                    $scope.selectCheckeds.push(data);
                    $scope.selectTempCheckeds.push(data);
                }else{
                    $scope.selectCheckeds = removeData($scope.selectCheckeds.data);
                    $scope.selectTempCheckeds = removeData($scope.selectTempCheckeds.data);
                }
            }

            $scope.resultDatas = [];


            $scope.sure = function(){
                $scope.result = [];
                angular.forEach($scope.selectCheckeds,function(data,i){
                    $scope.result.push(data[$scope.code]);
                });
                $scope.containerShow = false;
            }

            $scope.checked = false;

            $scope.toogleCheck = function(){
                if($scope.checked){
                    angular.forEach($scope.containerDatas,function(data,i){
                        if(!data.checked){
                            data.checked = true;
                            $scope.selectCheckData(data);
                        }
                    });
                }else{
                    angular.forEach($scope.containerDatas,function(data,i){
                        if(data.checked){
                            data.checked = false;
                            $scope.selectCheckData(data);
                        }
                    });
                }
            }


            if(angular.isUndefined($scope.columnNum) === true ||
                $scope.columnNum === null || $scope.columnNum === ''){
                $scope.rowClass = 'col-xs-12';
            }else{
                var colnum = parseInt($scope.columnNum);
                if(colnum){
                    var num = parseInt(10/colnum);
                    $scope.rowClass = 'col-xs-' + num;
                }else{
                    $scope.rowClass = 'col-xs-12';
                }
            }


            $scope.clearsearchName = function(){
                $scope.serchName = '';
                $scope.results_error = '';
                searchContainerDatas = datas;
                if($scope.enablePaging){
                    getPage(1);
                }else{
                    getall();
                }
                $scope.isclose = false;
            }

            $scope.serch = function(){
                if($scope.searchName){
                    $scope.isclose = true;
                    searchContainerDatas = [];
                    angluar.forEach(datas,function(data,index){
                        var isFlag = true;
                        angular.forEach(searchType,function(node,index){
                            var dataLower = data[node] ? data[node].toLowerCase() : '';
                            if(isFlag && dataLower.indexOf($.trim($scope.serchName).toLowerCase()) > -1){
                                searchContainerDatas.push(data);
                                isFlag = false;
                            }
                        });
                    });

                    if(!searchContainerDatas || searchContainerDatas == ''){
                        $scope.results = true;
                        $scope.results_error = '暂无匹配项';
                    }else{
                        $scope.results = false;
                        $scope.results_error = '暂无匹配项';
                    }

                    if($scope.enablePaging){
                        getPage(1);
                    }else{
                        getall();
                    }
                }else{
                    searchContainerDatas = datas;
                    if($scope.enablePaging){
                        getPage(1);
                    }else{
                        getall();
                    }
                    $scope.isclose = false;
                }
            }
        }
        return {
            restrict: 'E',
            scope: {
                labeltext: '@labeltext',
                code: '@code',
                text: '@text',
                containerDatas: '=containerDatas',
                dataSearchFields: '=dataSearchFields',
                returnDataType: '=returnDataType',
                width: '@width',
                columNum: '@columnum',
                countPerPage: '@countPerPage',
                clear: '=enablePurgeButton',
                result: '=result',
                placeholder: '@placeholder'
            },
            replace: true,
            templateUrl: templateUrl + 'app/view/common/directive/selectCommon.html',
            controller:ctrler
        }
    }]);
})();
