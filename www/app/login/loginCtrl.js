(function () {
    'use strict';

    angular.module('foodTrucks').controller('LoginCtrl', ['$scope', '$state', 'authSvc', LoginCtrl]);

    function LoginCtrl($scope, $state, authSvc) {
        var vm = this;

        vm.loginInfo = {
            'email': null,
            'password': null,
            'isValid': false
        }

        vm.goToSignup = function () {
            $state.go('signup');
        }

        vm.loginWithEmail = function () {
            
            if (!vm.loginInfo.isValid){
                vm.errorMessage = "Email and password cannot be blank";
                return;
            }
            else{
                vm.errorMessage = null;
            }
            
            try {
                authSvc.signInUser(vm.loginInfo.email, vm.loginInfo.password).then(function (result) {
                    $state.go('app.foodTrucks');
                }).catch(function (error) {
                    var errorCode = error.code;
                    $scope.$apply(function () {
                        vm.errorMessage = error.message;
                    });
                });
            }
            catch (err) {
                    vm.errorMessage = err.message;
            }
        }

        vm.onFieldChange = function () {
            vm.loginInfo.isValid = vm.loginInfo.email != null && vm.loginInfo.email != "" &&
                vm.loginInfo.password != null && vm.loginInfo.password != "";
        }





    };

})();

