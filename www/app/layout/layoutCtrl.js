(function () {
      'use strict';

      angular.module('foodTrucks').controller('LayoutCtrl', ['$scope', '$state', 'authSvc', LayoutCtrl]);

      function LayoutCtrl($scope, $state, authSvc) {
            var vm = this;

            vm.logout = function () {
                  authSvc.signOutUser().then(function () {
                        $state.go('login');
                  }, function (error) {
                        alert("error occured when trying to sign out user")
                  });
            }
      };

})();

