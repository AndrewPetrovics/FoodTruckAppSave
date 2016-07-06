(function () {
    'use strict';

    angular.module('foodTrucks').controller('IntroCtrl', ['$scope', '$state', '$ionicSlideBoxDelegate', IntroCtrl]);

    function IntroCtrl($scope, $state, $ionicSlideBoxDelegate ) {
        var vm = this;

       
        vm.next = function () {
            $ionicSlideBoxDelegate.next();
        };

        vm.previous = function () {
            $ionicSlideBoxDelegate.previous();
        };

        // Called each time the slide changes
        vm.slideChanged = function (index) {
            $scope.slideIndex = index;
        };

        vm.goToLogin = function loginUser() {
            $state.go('signup');
        }

    };

})();

