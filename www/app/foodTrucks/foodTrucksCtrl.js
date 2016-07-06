(function () {
      'use strict';

      angular.module('foodTrucks').controller('FoodTrucksCtrl', ['$scope', 'dataSvc', FoodTrucksCtrl]);

      function FoodTrucksCtrl($scope, dataSvc) {
            var vm = this;

            $scope.$on("$ionicView.enter", function (event, data) {
                  vm.loadFoodTrucks()
            });

            vm.loadFoodTrucks = function () {
                  dataSvc.getFoodTrucks().then(function (foodTrucks) {
                        vm.foodTrucks = foodTrucks;
                  })
            }

            vm.getCurrentStatus = function(foodTruck){

                  if (foodTruck.schedule == null || foodTruck.schedule.length <= 0) {
                        return null;
                  }

                  var nextSchedule = foodTruck.schedule[0];
                  var nextScheduledDate = nextSchedule.startTime;
                  var now = new Date();
                  var status = "";
                  if (nextSchedule.startTime <= now && nextSchedule.endTime >= now) {
                        status = "Serving now!"
                  }
                  else {
                        status = vm.getDateStatus(nextScheduledDate);// + " at " +  nextScheduledDate.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' });
                  }

                  return status;

            }

            vm.getDateStatus = function(date){
    
                  var now = new Date();
                  var beginningNow = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
                  var beginningDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0);

                  if (beginningNow.getTime() == beginningDate.getTime()) {
                        return "Serving later today";
                  }
                  else if ((beginningNow.getTime() - beginningDate.getTime()) == 60 * 60 * 24 * 1000) {
                        return "Serving tomorrow"
                  }
                  else {
                        return null;// date.getMonth() + 1 + "/" + date.getDate();
                  }
            }

      };
})();
