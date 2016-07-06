(function () {
  'use strict';

  angular.module('foodTrucks').controller('FoodTruckDetailsCtrl', ['$scope', '$stateParams', '$ionicSlideBoxDelegate', 'dataSvc', FoodTruckDetailsCtrl]);

  function FoodTruckDetailsCtrl($scope, $stateParams, $ionicSlideBoxDelegate, dataSvc) {
    var vm = this;

    $scope.$on("$ionicView.enter", function (event, data) {
      dataSvc.getFoodTruckById($stateParams.foodTruckId)
        .then(function (foodTruck) {
          vm.foodTruck = foodTruck;
        })
    });

    vm.openLink = function (url) {
      window.open(url.trim(), '_blank', 'location=yes');
    }

    $scope.next = function () {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function () {
      $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function (index) {
      $scope.slideIndex = index;
    };
  };
})();
