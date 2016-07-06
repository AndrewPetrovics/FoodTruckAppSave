(function () {
    'use strict';

    angular.module('foodTrucks').controller('FoodTruckScheduleCtrl', ['$scope', '$rootScope', '$stateParams', '$ionicModal', 'dataSvc', FoodTruckScheduleCtrl]);

    function FoodTruckScheduleCtrl($scope, $rootScope, $stateParams, $ionicModal, dataSvc) {
        var vm = this;


        $ionicModal.fromTemplateUrl('addScheduleModal.html', {
            scope: $scope
        }).then(function (modal) {
            $rootScope.modal = modal;
        });

        $scope.$on('modal.hidden', function () {
            vm.clearNewSchedule();
            vm.refreshSchedules(vm.foodTruck.id);
        });

        $scope.$on("$ionicView.beforeLeave", function (event, data) {
            $rootScope.showAddButton = false;
        });

        $scope.$on("$ionicView.enter", function (event, data) {
            $rootScope.showAddButton = true;
            vm.clearNewSchedule();
            vm.refreshSchedules($stateParams.foodTruckId)
        });

        vm.clearNewSchedule = function () {
            vm.newSchedule = {
                'lat': null,
                'lng': null,
                'date': null,
                'locationName': null,
                'address': null,
                'fullAddress': null,
                'startTime': null,
                'endTime': null,
                'isValid': false,
                'isEdit': false
            }
        }

        vm.refreshSchedules = function (foodTruckId) {
            dataSvc.getFoodTruckById(foodTruckId)
                .then(function (foodTruck) {
                    vm.foodTruck = foodTruck;
                    vm.dailySchedules = vm.getDailySchedules(foodTruck.schedule);
                })
        }


        vm.getDailySchedules = function (schedules) {

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

            return date.toLocaleDateString("en-us", options);

        }

        vm.getLocalTimeString = function (date) {
            return date.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })
        }

        vm.removeSchedule = function (schedule) {
            dataSvc.removeSchedule(vm.foodTruck.id, schedule.key).then(function (data) {
                vm.refreshSchedules(vm.foodTruck.id)
            });
        }

        vm.editSchedule = function (schedule) {

            vm.newSchedule = {
                'lat': schedule.lat,
                'lng': schedule.lng,
                'date': new Date(schedule.startTime),
                'locationName': schedule.locationName,
                'address': schedule.address,
                'fullAddress': schedule.fullAddress,
                'startTime': schedule.startTime,
                'endTime': schedule.endTime,
                'isValid': false,
                'isEdit': true,
                'key': schedule.key
            }

            $rootScope.modal.show();
        }

        vm.addSchedule = function () {

            var startDateStr = vm.newSchedule.date.toDateString() + " " + vm.newSchedule.startTime.toLocaleTimeString();
            var endDateStr = vm.newSchedule.date.toDateString() + " " + vm.newSchedule.endTime.toLocaleTimeString()

            var startDt = new Date(startDateStr);
            var endDt = new Date(endDateStr);

            if (endDt < startDt) {
                endDt.setDate(endDt.getDate() + 1)
            }

            var locationName = vm.newSchedule.locationName;
            if (locationName == 'newLocation') {
                locationName = vm.newSchedule.newLocation;
            }

            var schedule = {
                'lat': vm.newSchedule.lat,
                'lng': vm.newSchedule.lng,
                'locationName': locationName,
                'address': vm.newSchedule.address,
                'fullAddress': vm.newSchedule.fullAddress,
                'startTime': startDt.toLocaleString(),
                'endTime': endDt.toLocaleString()
            };




            if (vm.newSchedule.isEdit) {
                dataSvc.editSchedule(schedule, vm.foodTruck.id, vm.newSchedule.key).then(function () {
                    $rootScope.modal.hide();
                })
            }
            else {
                dataSvc.addSchedule(schedule, vm.foodTruck.id).then(function () {
                    $rootScope.modal.hide();
                })
            }


        }

        vm.onAddressChange = function () {
            vm.validateAddress(vm.newSchedule.address);
        }

        vm.fieldChanged = function () {
            vm.validateSchedule();
        }


        vm.validateSchedule = function () {
            var isValid = vm.newSchedule.lat != null && vm.newSchedule.lat != 0 &&
                vm.newSchedule.lng != null && vm.newSchedule.lng != 0 &&
                vm.newSchedule.date != null && vm.newSchedule.date != "" &&
                vm.newSchedule.locationName != null && vm.newSchedule.locationName != "" &&
                vm.newSchedule.address != null && vm.newSchedule.address != "" &&
                vm.newSchedule.fullAddress != null && vm.newSchedule.fullAddress != "" &&
                vm.newSchedule.startTime != null && vm.newSchedule.startTime != "" &&
                vm.newSchedule.endTime != null && vm.newSchedule.endTime != "" &&
                vm.newSchedule.fullAddress != null && vm.newSchedule.fullAddress != "";

            vm.newSchedule.isValid = isValid;

        }

        // $scope.$watch('vm.newSchedule.address', function (oldValue, newValue) {
        //      vm.validateAddress(vm.newSchedule.address);
        // });

        vm.validateAddress = function (address) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status === google.maps.GeocoderStatus.OK) {

                    $scope.$apply(function () {
                        vm.newSchedule.lat = results[0].geometry.location.lat();
                        vm.newSchedule.lng = results[0].geometry.location.lng();
                        vm.newSchedule.fullAddress = results[0].formatted_address;
                    });
                }
                else {
                    $scope.$apply(function () {
                        vm.newSchedule.isValid = false;
                        vm.newSchedule.lat = null;
                        vm.newSchedule.lng = null;
                        vm.newSchedule.fullAddress = null;
                    });
                }

                vm.validateSchedule();
            });
        }




    };
})();
