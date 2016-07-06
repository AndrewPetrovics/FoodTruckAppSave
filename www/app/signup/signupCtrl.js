(function () {
    'use strict';

    angular.module('foodTrucks').controller('SignupCtrl', ['$scope', '$state', 'authSvc', SignupCtrl]);

    function SignupCtrl($scope, $state, authSvc ) {
        var vm = this;
        
        vm.signupInfo = {
            'email': null,
            'password': null,
            'confirmPassword': null,
            'isValid': false
        }

        vm.goToSignin = function(){
            $state.go('login');
        }
        
        vm.registerWithEmail = function(){
            authSvc.registerUser(vm.signupInfo.email, vm.signupInfo.password).then(function(result){
                $state.go('app.foodTrucks');
            }).catch(function (error) {
                // Handle Errors here.
                var errorCode = error.code;
                $scope.$apply(function () {
                        vm.errorMessage = error.message;
                    });
                
            });
            
        }
        
        vm.onFieldChange = function(){
            vm.signupInfo.isValid = vm.signupInfo.email != null &&  vm.signupInfo.email != "" &&
                                    vm.signupInfo.password != null &&  vm.signupInfo.password != "" &&
                                    vm.signupInfo.confirmPassword != null &&  vm.signupInfo.confirmPassword != "" &&
                                    vm.signupInfo.password == vm.signupInfo.confirmPassword;
        }
       

    };

})();

