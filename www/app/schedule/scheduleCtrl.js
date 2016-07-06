(function () {
    'use strict';

    angular.module('foodTrucks').controller('ScheduleCtrl', ['$scope', '$stateParams', 'dataSvc', ScheduleCtrl]);

    function ScheduleCtrl($scope, $stateParams, dataSvc) {
        var vm = this;

        $scope.$on("$ionicView.enter", function (event, data) {
            vm.getSchedules();
        });



        vm.getSchedules = function () {
            dataSvc.getFoodTrucks().then(foodTrucks => {
                vm.foodTrucks = foodTrucks;

                var schedules = [];
                for (var ftKey in foodTrucks) {

                    var foodTruck = foodTrucks[ftKey];
                    // if (this.queryText != null && this.queryText != '' && !foodTruck.name.toLowerCase().includes(this.queryText.toLowerCase())) {
                    //     continue;
                    // }

                    for (var schKey in foodTruck.schedule) {

                        var schedule = foodTruck.schedule[schKey];
                        var scheduleItem = foodTruck.schedule[schKey];
                        scheduleItem.foodTruck = foodTruck;

                        schedules.push(scheduleItem)
                    }
                }

                vm.schedules = schedules.sort((a, b) => a.startTime > b.startTime)
                vm.groupedSchedules = vm.getGroupedSchedules(vm.schedules);

            });

        }

        vm.getLocalTimeString = function (date) {
            return date.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
        }

        vm.getGroupedSchedules = function (schedules) {

            var now = new Date();
            var groups = [];
            var groupSchedules = [];
            var groupDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            for (var i = 0; i < schedules.length; i++) {

                var scheduleStartDate = new Date(schedules[i].startTime.getFullYear(), schedules[i].startTime.getMonth(), schedules[i].startTime.getDate());

                if (scheduleStartDate.getTime() == groupDate.getTime()) {
                    groupSchedules.push(schedules[i]);
                }
                else {

                    if (groupSchedules.length > 0) {
                        var group = {
                            'header': vm.getHeaderFromDate(groupDate),
                            'schedules': groupSchedules
                        }
                        groups.push(group);
                    }

                    groupDate = scheduleStartDate;
                    groupSchedules = [];
                    groupSchedules.push(schedules[i]);
                }
            }

            if (groupSchedules.length > 0) {
                var group = {
                    'header': vm.getHeaderFromDate(groupDate),
                    'schedules': groupSchedules
                }
                groups.push(group);
            }

            return groups;
        }

        vm.getHeaderFromDate = function (date) {
            var options = {
                weekday: "long", month: "long", day: "numeric"
            };

            return date.toLocaleDateString("en-us", options)

        }

    };
})();
