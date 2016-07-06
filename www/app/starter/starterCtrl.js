(function () {
    'use strict';

    angular.module('foodTrucks').controller('StarterCtrl', ['$scope', '$state', 'authSvc', 'applicationSvc', StarterCtrl]);

    function StarterCtrl($scope, $state, authSvc, applicationSvc) {
        var vm = this;
        vm.status = "Initializing..."

        $scope.$on("$ionicView.enter", function (event, data) {
            
            if (window.cordova){
                checkForUpdates();
            }
            else{
               startApp();
            }
        });
        
        function checkForUpdates(){
            updateStatus("Checking for updates...");
            
            var deploy = new Ionic.Deploy();  
        
            deploy.check().then(function(hasUpdate) {
                if (hasUpdate){
                        updateStatus("Update found. Starting download...");
                
                        deploy.update().then(function(res) {
                            if (res){
                                updateStatus("Update successfully completed! Restarting...");
                            }
                            else{
                                updateStatus("Hmm, something happened. Update finished successful but a bad status was recieved...");
                            }
                        }, function(err) {
                            updateErrorStatus("Hmm, something happened. Error occured when trying to update", err);
                        }, function(prog) {
                           updateStatus("Updating " + prog + "%...");
                        });
                }
                else{
                    updateStatus("No new updates found...");
                    startApp();
                }
        
            }, function(err) {
                updateErrorStatus("Hmm, something happened. Unable to check for updates.", err);
            });
        }
        
        function startApp(){
            if (applicationSvc.isInitialRun()) {
                applicationSvc.setInitialRun(false);
                $state.go("intro");
            }
            else{
                authSvc.isUserLoggedIn().then(function(isLoggedIn){
                    if (isLoggedIn){
                        $state.go("app.foodTrucks");
                    }
                    else{
                        $state.go("login");
                    }
                })
            } 
        }
        
        function updateStatus(status){
            vm.status = status;
        }
        
        
        
        


    };

})();

