/**
 * Created by xuezekui on 2017/7/25.
 */



var app = angular.module('myApp',[]);
    app.directive('menuTree',['$compile','$parse',function($compile){

        var linkFn = function(scope,element,attrs){
            var checkbox = scope.$eval(attrs.checked);
            scope.textName = attrs.textName || 'text';
            scope.nodesName = attrs.nodesName || 'isChild';
            var hasChildFieldName = attrs.hasChild;
            var lazy = scope.$eval(attrs.lazy) || false;
            scope.depth = -1;
            scope.openDepth = parseInt(attrs.openDepth || '0');
            scope.show = true;
            scope.nodesShow = true;
            scope.selectedData = null;
            var temp = '<menu-tree-node data-text-name="{{::textName}}" data-is-child="{{::isChild}}" data-lazy="'+ lazy
                + '" data-has-child="'+ hasChildFieldName +'" ng-repeat="data in '+ attrs.data +'" data-show="true" data-checkbox="'+
                checkbox+'"></menu-tree-node>';

            var nodes = $compile(temp)($scope);
            element.children().append(nodes);
        };

        function treeCtrl($scope,$element,$attrs,$transclude){
            this.changeSelected = function(data){
                $scope.$broadcast('menuTree.internalSelectedChange',data);
                $scope.$emit('menuTree.selectedChange',data,$scope.selectedData);
                $scope.selectedData = data;
            };
        }

        return {
            restrict: 'E',
            scope: true,
            replace: true,
            template: '<div class="fwa-true"><ul class="list-group full-width full-height"></ul></div>',
            link: linkFn,
            controller: ['$scope','$element','$attrs','$transclude',treeCtrl]
        };

    }]);

    directive('menuTreeNode',['$compile',function($compile){
        function compileFn(ielem,attrs,link){
            return linkFn;
        }

        function linkFn(scope,element,attrs,ctrl){
            scope.inited = false;
            scope.nodesShow = false;
            scope.show = scope.$parent.nodesShow;
            scope.hasChild = false;
            scope.depth++;
            var textName = attrs.textName || 'text';
            var nodesName = attrs.nodesName || 'nodes';
            var isChildFieldName = attrs.isChild || 'isChild';
            var hasChildFieldName = attrs.hasChild;
            //默认true 表示默认是子节点
            scope.data[isChildFieldName] = scope.data[isChildFieldName] === false ? false : true;
            var lazy = scope.$eval(attrs.lazy) || false;
            scope.selected = false;
            var inited = false;
            scope.checkbox = scope.$eval(attrs.checkbox);

            if((lazy && ((hasChildFieldName && scope.data[hasChildFieldName]) || !scope.data[isChildFieldName])) ||
                (scope.data && scope.data[scope.nodesName] && scope.data[scope.nodesName].length > 0)){
                var temp = '';
                scope.hasChild = true;
                temp = '<menu-tree-node ng-repeat="data in data.' + scope.nodesName + '" data-depth="{{depth}}" ' +
                    'data-text-name="' + textName + '" data-is-child="'+ isChildFieldName +'" data-has-child="' + hasChildFieldName + '" ' +
                    'data-lazy="' + lazy + '" ng-show="show && $parent.show" data-checkbox="' + scope.checkbox + '"></menu-tree-node>';

                var node = $compile(temp)($scope);
                element.after(node);
            }

            for(var i = 1; i < scope.depth; i++){
                element.prepend('<span class="tree-space" style="width:20px;display:inline-block;"></span>');
            }

            scope.expand = function(data){
                if(lazy && !scope.nodesShow && scope.hasChild &&
                    !(scope.data[scope.nodesName] && scope.data[scope.nodesName].length > 0)){
                    scope.$emit('menuTree.loadChild',data);
                }
                scope.nodesShow = scope.nodesShow === true ? false : true;
            };

            scope.$watch('nodesShow',function(v){
                scope.$broadcast('nodesStateChange');
            });


            scope.$on('treenode.innerchecked',function(e,checked){
                if(e.targetScope === scope){
                    return;
                }
                e.preventDefault();
                if(checked){
                    $("#" + scope.data.code + "").prop('checked',true);
                }else{
                    var b = false;
                    var nodes = scope.data[scope.nodesName];
                    for(var i = 0; nodes && i < nodes.length; i++){
                        if($("#" + nodes[i].code + "").prop("checked")){
                            b = true;
                            break;
                        }
                    }

                    if(b){
                        $("#" + scope.data.node + "").prop("checked",true);
                    }else{
                        $("#" + scope.data.node + "").prop("checked",false);
                    }
                }
            });

            function isShow(){
                return scope.$parent.nodesShow && scope.$parent.show;
            }

            scope.$on('nodesStateChange',function(e){
                if(e.targetScope === scope){
                    return;
                }
                e.preventDefault();

                scope.show = isShow();
            });

            scope.onCheckedChange = function(){
                var checked = $("#" + scope.data.code + "").prop('checked');
                scope.$broadcast('treenode.innerchecked',checked); //子菜单
                scope.$emit('treenode.checked',checked);//父菜单
                scope.$emit('menuTree.nodeChecked',checked,scope.data);
            };

            scope.$on('menuTree.internalSelectedChange',function(e,d){
                if(d != scope.data){
                    scope.selected = false;
                    scope.data.selected = false;
                }else{
                    scope.selected = true;
                    scope.data.selected = true;
                }
            });

            scope.onClick = function(e) {
                if (e.target !== element.find(':input').get(0) &&
                    e.target !== element.find('.tree-expander').get(0)) {
                    scope.data.selected = true;
                    ctrl.changeSelected(scope.data);
                    scope.expand(scope.data);
                }
            };

            if(scope.openDepth >= scope.depth + 1){
                scope.nodesShow = true;
            }

            if(scope.nodesShow &&
                lazy && scope.hasChild &&
                !(scope.data[scope.nodesName] && scope.data[scope.nodesName].length > 0)){
                scope.$emit('menuTree.loadChild',scope.data);
            }
        }

        return{
            restrict: 'E',
            scope: true,
            replace: true,
            require: 'menuTree',
            template: '<li class="list-group-item" ng-class="{active:selected || data.selected}" ng-click="onClick($event)">' +
            '<span ng-class="expand(data);" ng-show="hasChild" style="margin-right:5px;" class="glyphicon tree-expender"' +
            'ng-class="{\'glyphicon-plus\': !nodesShow, \'glyphicon-minus\':nodesShow}"></span>' +
            '<span ng-show="!hasChild" style="margin-right:5px;"></span>' +
            '<input id="{{data.code}}" type="checkbox" class="css-checkbox" ng-model="data.checked" style="margin-right:0px;" ng-show="::checkbox"' +
            'ng-click="onCheckedChange()">' +
            '<label class="css-label1" ng-show="checkbox" for="{{data.code}}" ng-bind="data.{{textName}}"></label>' +
            '<span class="tree-node-label" ng-show="!checkbox" ng-bind="data.{{textName}}"></span></li>',
            compile: compileFn
        }



    }]);


