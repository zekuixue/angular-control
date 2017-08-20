/**
 * Created by xuezekui on 2017/7/13.
 * com-table和com-table-freeze 控件说明
 * columns：表头
 * columns2：双层表头的标题
 * data-rows: 显示数据
 * replace：替换数据中空字符配置
 * width：自定义宽度配置
 * data-check="true" 多选配置 默认为true
 * data-radio="true" 单选配置 默认为false
 * data-expander="true" 扩展按钮配置 默认为false
 * data-cellTemplate: 行编辑配置  默认为false
 * colsnum: 表头合并从第几个td开始
 * rowsnum: 表头合并到第几个td结束
 * freeze 冻结列数，com-table-freeze 控件
 * scroll: 一个页面多个table 滚动条同步滚动，值left、top、all
 * stripBaseYear:历史年 基准年 预测年 值：true
 *
 */
;
'use strict';
var app = angular.module('myApp',[]);

app.controller('actrl',function($scope){
    $scope.rulesCollection = [{}];
    $scope.drugChargeTypeConfirmFn = chargeTypeConfirmFnFactorPage(0);
    //点击扩展事件
    $scope.expandChange = function(data){
        var billRulesDetaileds = [{}];
        for(var i = 0; i < billRulesDetaileds.length; i++){
            var myResultDesc = billRulesDetaileds[i].resultDesc.split(/;;|<br>/);
            if(myResultDesc[myResultDesc.length - 1] == ""){
                myResultDesc.splice(myResultDesc.length - 1,1);
            }
            billRulesDetaileds[i].childrenDesc = myResultDesc;
        }
        initExpanderContentTemplate();
    };

    $scope.columns = [];
    $scope.columns2 = [{}];

    $scope.filterdatas = [];


    function initExpanderContentTemplate(){
        function getExpanderContent(span){
            return '<div colspan="2">' +
                '<div></div>' +
                '<ol ng-if="billRulesDetaileds.length >= 1" style="margin:opx;">' +
                   '<li ng-repeat="result in billRulesDetaileds">' +
                '<p ng-repeat="desc in result.childrenDesc track by $index" style="white-space:normal;word-wrap:break-word;margin-bottom: 0px;">{{desc}}</p>&nbsp;<span style="width:12px;right:275px;position:absolute;"></span></li></ol></div></td>';
        }
        $scope.expanderContent9 = getExpanderContent(9);
    }
});


var getcellTemplate = function(){
    return '<input type="number" ng-show="cellupdate" ng-model="data.doseForm" ng-bind="data.doseForm" ' +
        'ng-readonly="detailtable.readOnly||data.editAbla==1" ng-style="{\'background-color\':data.change?\'yellow\':\'\'}" ' +
        'style="height:26px;width:100%;border:0px" ng-min="0" ng-max="30" ng-change="detailtable.change(data)"/>';
};


var getExpanderTemplate = function(spanType){
    return '<table-expander ng-show="expander" style="color:#7b7b7b" data-change="expandChange(data)" data-content="data.START_ROWUNM_" ' +
        'data-span="12" ng-show="data.START_ROWNUM_" data-template="expanderContent'+ spanType +'"></table-expander>';
};

function chargeTypeConfirmFnFactoryPage(){
  return function(v){
      var chargeType = [];
      if(null != v && v.length > 0){
          for(var i = 0; i < v.length; i++){
              chargeType.push(v[i].identityID);
          }
      }
  }
};

var getChargeTypeFilterPlugin = function(confirm){
    return '<div filter-box style="width:280px;" column-num="1" data-show="header.filterPluginShow" datas="filterdatas" label-field="orgName" ' +
        'value-filed="identityID" data-confirm="' + confirm + '"></div>';
};


'use strict'
function tableExpander($parse,$compile,$scope){
    var contentTemp = '<tr ng-show="contentShow"></tr>';
    return {
        restrict: 'EA',
        scope: {
            change:'&',
            template:'='
        },
        replace:true,
        template: '<a ng-click="chClick()"><span class="glyphicon" ng-class="{true:\'glyphicon-minus\',false:\'glyphicon-plus\'}{contentShow}"></span></a>',
        link: function($scope,$element,$attrs,$controller){
            var ngShow = $attrs.ngShow;
            var hasContent = $parse(ngShow)($scope.$parent);
            var contentElem;

            $scope.contentShow = false;

            if(hasContent){
                contentElem = $compile(contentTemp)($scope);
                $element.parent().parent().parent().after(contentElem);
            }

            $scope.click = function(){
              $scope.contentShow = !$scope.contentShow;
              $scope.change();
            };
        }
    };
}



'use strics';

/*
<div filter-box
    column-num="3"                           //一共多少列
    data-show="header.filterPluginShow"      //绑定show/hide变量
    datas="datas"                            //里面显示的数据
    label-field="description"                //显示字段
    data-confirm="confirmFn">                //确认回调

    </div>
 */
function filterBox($parse){
    function linker($scope,$element,$attrs){
        var checkedItem = [];
        var showFn = $parse($attrs.show);
        $scope.text = $attrs.labelField || 'label';
        $scope.code = $attrs.valueField || 'value';
        $scope.allCheckedbox = false;
        $scope.columnNum = $attrs.columnNum || 1;

        //css
        $element.css({
            position: 'absolute'
        });

        //显示监听
        $scope.$parent.$watch($attrs.show,function(v){
            if(v){
                $element.removeClass('hide');
            } else {
                $element.addClass('hide');
            }
        });

        $scope.$parent.$watchCollection($attrs.datas,function(v){
            checkedItem = [];
            $scope.collection = v || [];
         });

        //item 勾选监听
        $scope.itemCheckedChange = function(item){
            var index = checkedItems.indexOf(item);
            if(item.checked){
                if(index == -1){
                    checkedItems.push(item);
                }
                if(checkedItems.length == $scope.collection.length){
                    $scope.allCheckedbox = true;
                }
            } else {
                $scope.allCheckBox = false;
                if(index != -1){
                    checkedItems.splice(index,1);
                }
            }
        };

        $scope.cancel = function(){
            showFn.assign($scope.$parent,false);
        };


        $scope.sure = function(){
            var confirmFn = $scope.$eval($attrs.confirm);
            showFn.assign($scope.$parent,false);
            confirmFn(checkedItems);
        };
    }

    return {
        restrict: 'A',
        templateUrl: 'libs/html/filterbox_view.html',
        replace: true,
        scope: true,
        link: linker
    };
}


function pageCommon($parse){
    function linker($scope,$elm,$attrs,$ctrl){
        $scope.limit = 20;
        $scope.light = $scope.$eval($attrs.light);
        $scope.id = $attrs.id;
        $scope.monitorName = $attrs.monitorName;

        $scope.limits = ["5","10","20","30","40","50","60","70","80","90"];

        $scope.skipNextPage = function(){
            if (!(($scope.totalPage == 0 && $scope.currentPage < 0) || ($scope.totalPage > 0 && $scope._currentPage < $scope.totalPage))) {
                $scope.skipPage(parentInt($scope._currentPage));
            }
        };

        $scope.skipPrePage = function(){
            if(($scope.totalPage == 0 && $scope._currentPage > 0) || ($scope.totalPage > 0 && $scope._currentPage > 1)){
                $scope.skipPage(parseInt($scope._currentPage) - 1);
            }
        };

        $scope.skipPage = function(page){
            $scope._currentPage = page;
            $scope.currentPageInput = page;
            $scope.currentPage = page;
            $scope.$emit('pageCommon.skipPage',page);
            $scope.$emit($scope.monitorName,page);
        }

        $scope.onSkip = function(){
            if(isNaN($scope.currentPageInput)){
                alert('请输入数字！');
            }else if($scope.currentPageInput < 1){
                alert('输入页数不能小于1！');
            }else if($scope.currentPageInput != parseInt($scope.currentPageInput)){
                alert('输入页数必须为整数！');
            }else if($scope.currentPageInput > $scope.totalPage){
                alert('输入页数大于总页数！');
            }else{
                $scope.currentPage = $scope.currentPageInput;
                $scope._currentPage = $scope.currentPageInput;
                $scope.$emit('pageCommon.skipPage',$scope.currentPageInput);
                $scope.$emit($scope.monitorName,$scope.currentPageInput);
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
                $scope.pageTotalCount = v/$scope.limit;
                $scope.homePage = 1;
                $scope.totalPage = Match.ceil(v/($scope.limit * $scope.limit));
                if(!$scope.currentPageInput){
                    $scope.currentPageInput = 1;
                    $scope._currentPage = 1;
                }
            }else{
                $scope.pageTotalCount = 1;
                $scope.homePage = 0;
                $scope.totalPage = 0;
                $scope.currentPageInput = 0;
                $scope._currentPage = 0;
            }
        });


        $scope.$watch('limit',function(){
            if(v){
                $scope.limit = v;
                $scope.$emit('pageCommon.limit',v);
            }
        });
    }

    return {
        restrict: 'E',
        replace: true,
        scope: {
            currentPage: '#currentPage',
            totalCount: '='
        },
        templateUrl: 'libs/page.htm',
        link: linker
    };
}


app.directive('comTable',['$compile','$parse',comTable])
    .directive('comTableTh',['$compile','$document',comTableTh])
    .directive('comTableTr',comTableTr)
    .directive('comTableFreeze',['$compile','$document',comTableFreezeTh])
    .directive('comTableFreezeTh',['$compile','$document',comTableFreezeTh])
    .directive('comTableFreezeTr',['$compile','$document',comTableFreezeTr])
    .directive('tableExpander',['$parse','$compile',tableExpander])
    .directive('filterBox',['$parse',filterBox])
    .directive('pageCommon',['$parse',pageCommon]);




function comTable($compile,$parse){
    var theadTemplate = "";
}
