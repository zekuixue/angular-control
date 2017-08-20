/**
 * Created by xuezekui on 2017/8/7.
 * <search-select
 *      code="code"                                //属性代码【必填】
 *      desc="desc"                               //属性描述【必填】
 *      enableMultipleCheck="false"               //是否多选【必填项】  {默认false：单选，true：多选}
 *      defaultCheckedArray="code1,code2"         //多选时可配置默认选中的code数组，多个以逗号分割
 *      resultCodeFlag="true"                     //是否返回属性代码【必填项】 {默认true,返回code属性值，false：返回对象}
 *      placeholder="请输入...."                  //配置输入提示文字
 *      width="400"                               //配置宽度
 *      is-clicknode="false"                      //配置子叶节点是否可选择作为参数   默认为false，
 *      is-clear="false"                          //全选清除按钮配置  默认为false  不显示
 *      result="result">                          //返回的集合集
 *
 *
 * </search-select>
 *
 *
 *
 */
;

'use strict';

var app = angular.module('myApp',[]);

app.controller('bctrl',function($scope){
    $scope.rulesCollection = [{
        "divisionType": "20001",
        "divisionDesc": "first",
        "list": [{
            "RULECHS": "CFWJY",
            "RULEGRANULARITY": "2",
            "RULEID": "1",
            "RULENAME": "first1rule_name",
            "RULEAUDITRESULTTYPE": 20001,
            "RULEDESC": "first1rule_desc"
        },{
            "RULECHS": "CLKYDC,CLKYCC,CLKYSC",
            "RULEGRANULARITY": "2",
            "RULEID": "R0198",
            "RULENAME": "first2rule_name",
            "RULEAUDITRESULTTYPE": 20001,
            "RULEDESC": "first2rule_desc"
        }]
    }];
});


app.directive('selectTree',['$timeout',function($timeout){
    return{
        restrict: 'AE',
        scope: {
            options: '@options',
            name: '@name',
            code: '@code',
            desc: '@desc',
            width: '@width',
            height: '@height',
            enableMultipleCheck: '@enableMultipleCheck',
            enableClickNode: '@enableClickNode',
            defaultCheckedArray: '=defaultCheckedArray',
            returnDataType: '@returnDataType',
            result: '=result',
            enableSearchNot: '=enableSearchNot',
            isEmit: '@isEmit',
            placeholder: '@placeholder'
        },
        templateUrl: 'libs/html/selectTree.html',
        replace: true,
        transclude: true,
        link: function($scope,$element,$attrs){
            var allDatas = [];              //缓存所有数据
            var searchTypes = [];          //筛选的属性值集合
            var defaultCheckeds = [];      //多选时间配置默认选中的code数组
            var selectCheckeds = [];       //存储选中的数据
            var showNames = "";           //存储选中的desc，多个以分号分割
            var isShow = true;           //是否还在搜索框内
            var deleteSelectNames = [];  //存储删除的描述数据
            var selectCheckedTemp = [];
            var canelTemp = 0;
            var newDatas = [];
            $scope.placeholder = '';

            $scope.enableMultipleCheck = $element.attr("enableMultipleCheck") === 'true' ? true : false;
            $scope.returnCodeFlag = $element.attr("returnDataType") === 'false' ? false : true;
            $scope.showMessageFlag = false;          //是否显示查询文字
            $scope.datas = [];      //下拉数据
            $scope.checked = false;        //全选checkbox是否勾选，默认不勾选
            $scope.showFlag = false;      //是否显示

            //是否显示清除按钮 默认false   不显示清除
            if($attrs.enblePurgeButton){
                $scope.enblePurgeButton = eval($attrs.enblePurgeButton);
            }else{
                $scope.enblePurgeButton = false;
            }

            $scope.showSearch = $element.attr("enableSearchNot") === 'true' ? true : false;
            $scope.isEmit = $element.attr('isEmit') === 'true';

            /*****   文本框绑定单击事件，展示全部tree数据  ****/
            $scope.showTree = function(){
                isShow = false;
                $scope.showFlag = !$scope.showFlag;
                if($scope.showFlag){
                    if(!$scope.datas || ($scope.datas && $scope.datas.length === 0)){
                        $scope.showMessageFlag = true;
                        $scope.message = '正在加载中......';
                    }

                    $scope.searchName = '';
                    $scope.datas = allDatas;

                    if(!$scope.enableMultipleCheck){    //重新清空deleteSelectNames
                        deleteSelectNames = [];
                        checkResult();
                    }

                    $scope.width = $element.children().find(".dropdownlist").context.offsetWidth;
                }

                angular.forEach($scope.datas,function(data,i){
                    data.show = false;

                    if($scope.enableClickNode === 'true'){

                    }else{
                        if(data.list.length < 1){
                            $element.find('#' + data.divisionDesc).attr("disabled","disabled");
                            $element.find('.' + data.divisionDesc).css({
                                color: '#dddddd'
                            });
                        }
                    }
                });

                $timeout(function(){
                    $element.find(".dropdownlist").find(".searchInput").focus();
                },200);
            }

            $scope.$watchCollection("dataList",function(){
                if(v){
                    $scope.showMessageFlag = false;
                    $scope.datas = v;

                    if(allDatas && allDatas.length === 0){
                        selectCheckeds = [];

                        angular.forEach(v,function(data,index){
                            allDatas.push(data);
                            data.show = true;
                        });

                        if(data.list && data.list.length > 0 && defaultCheckeds && defaultCheckeds.length > 0){
                            angular.forEach(data.list,function(rule,index){
                                angular.forEach(defaultCheckeds,function(dCode,index2){
                                    if(dCode === rule[$scope.code]){
                                        if($scope.returnCodeFlag){
                                            selectCheckeds.push(rule[$scope.code]);
                                        }else{
                                            selectCheckeds.push(rule);
                                        }

                                        rule.checked = true;
                                        checkedNum++;
                                    }
                                });
                            });
                        }
                    }
                }
            });
            $scope.result = selectCheckeds;

            someChildrenChecked();
        }
    }
}]);
