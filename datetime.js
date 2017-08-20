/**
 * Created by xuezekui on 2017/7/25.
 */
;
(function(){
    'use strict';

    var app = angular.module('intro.directives');

    app.directive('dateTime',[function(){
        function linker($scope,elm,attrs,ctrl){
            //var modelFn
            var startView = attrs.type || 'year';
            var format = attrs.format || 'yyyy-mm-dd';
            var pickerPosition = attrs.pickerPosition || 'bottom-right';
            var value = '';

            $scope.$watch(attrs.ngModel,function(e){
                if(v){
                    value = v;
                }else{
                    value = "";
                }
            });

            function getValue(){
                return elm.val();
            }

            if(!elm.hasClass('DateTimes')){
                elm.addClass('DateTimes');
            }

            elm.datetimepicker({
                format: format,
                autoclose: true,
                startView: startView,
                maxView: 'decade',
                pickerPosition: pickerPosition,
                initialDate: new Date()
            }).on('change',function(){
                value = getValue();
                ctrl.$setViewValue(value);
                $scope.$emit('dateTime.change',getValue());
            }).on('blur',function(){
                if(value != getValue()){
                    $scope.$emit('dateTime.change',getValue());
                }
            });

            ctrl.$render = function(){
                elm.val(ctrl.$modelValue);
            };
        }


        return {
            restrict: 'A',
            replace: false,
            require: 'ngModel',
            link: linker
        };
    }]).directive('dateTimeInput',['$parse','$compile',function($parse,$compile){
        var template = "";

        function linker($scope,elm,attrs){
            var startView = attrs.type || 'month';
            var format = attrs.format || 'yyyy-mm-dd';
            var pickerPosition = attrs.pickerPosition || 'bottom-right';
            var modelFn = null,
                model = null;
            if(attrs.ngModel){
                modelFn = $parse(attrs.ngModel);
            }

            var readOnly = attrs.readonly;

            $scope.labeltext = attrs.labeltext;
            var html = '';
            if(readOnly == 'N'){
                html = template.replace(/#READONLY#/g,'');
            }else{
                html = template.replace(/#READONLY#/g,'readonly=readonly')
            }
            elm.html('').append($compile(html)($scope));

            function getValue(){
                return{
                    start: startDateInput.val(),
                    end: endDateInput.val()
                };
            }
        }

        function setValue(){
            if(modelFn){
                var model = modelFn($scope);
                if(model){
                    startDateValue = model.start;
                    var endDateValue = model.end;
                    startDateInput.val(model.start);
                    endDateInput.val(model.end);
                    startDateInput.datetimepicker('update');
                    endDateInput.datetimepicker('update');
                    endDateInput.datetimepicker('setStartDate',startDateInput.val());
                    startDateinput.datetimepicker('setEndDate',endDateInput.val());
                }
            }


            var startDateValue = '', endDataValue = '';
            var startDateInput = elm.find('.DateTime').first().
            datetimepicker({
                format: format,
                autoclose: true,
                startView: startView,
                minView: startView,
                maxView: 'decade',
                endDate: new Date(),
                pickerPosition: pickerPosition,
                initialDate: new Date()
            }).on('change',function(){
                if(modelFn){
                    modelFn.assign($scope,getValue());
                }
                startDateValue = $(this).val();

                var startdate = new Date(startDateValue);
                var interval = parseInt(attrs.interval);
                if(startView == 'year'){
                    endDateInput.datetimepicker('setEndDate',((startdate.getFullYear() + interval) + '-' + (startdate.getMonth() + 1) + '-' + (startdate.getDate())));
                }else if(startView == 'month'){
                    endDateInput.datatimepicker('setEndDate',((startdate.getFullYear()) + '-' + (startdate.getMonth() + 1 + interval) + '-' + (startdate.getDate())));
                }else if (startview != 'day') {
                } else {
                    //endDateInput.datatimepicker('setEndDate', (startdate.getFullYear() + '-' + (startdate.getMonth() + 1) + '-' + (startdate.getDate() + interval));
                }
                var startdate = new Date(startDateValue);
                $scope.$emit('dateTimeInput.change',getValue());
            }).on('blur',function(){
                if(startDateValue !== $(this).val()){
                    if(modelFn){
                        modelFn.assign($scope,getValue());
                    }
                    endDateInput.datetimepicker('setStartDate',$(this).val());

                    $scope.$emit('dateTimeInput.change',getValue);
                }
            });


            var endDateInput = elm.find('.DateTime').last().datetimepicker({
                format: format,
                autoclose: true,
                startView: startView,
                minView: startView,
                maxView: 'decade',
                startDate: '2000-1-1',
                pickerPosition: pickerPosition,
                initialDate: new Date()
            }).on('change',function(){
                if(modelFn){
                    modelFn.assign($scope,getValue());
                }
                var endDateValue = $(this).val();
                startDateInput.datetimepicker('setEndDate',$(this).val());
                $scope.$emit('dateTimeInput.change',getValue());
            }).on('blur',function(){
                if(endDateValue !== $(this).val()){
                    if(modelFn){
                        modelFn.assign($scope,getValue());
                    }
                    startDateInput.datetimepicker('setEndDate',$(this).val());
                    $scope.$emit('dateTimeInput.change',getValue());

                }
            });

            $scope.$watch(attrs.ngModel,function(v){
                if(v){
                    setValue();
                }
            });

        }

        return {
            restrict: 'E',
            replace: true,
            template: template,
            link: linker
        };
    }]);
})();


