(function () {
    'use strict';

    angular.module('foodTrucks').controller('FoodTruckMenuCtrl', ['$scope', '$stateParams', '$rootScope', '$ionicModal', 'dataSvc', FoodTruckMenuCtrl]);

    function FoodTruckMenuCtrl($scope, $stateParams, $rootScope, $ionicModal, dataSvc) {
        var vm = this;

        $scope.$on("$ionicView.beforeLeave", function (event, data) {
            $rootScope.showAddMenuButton = false;
        });

        $scope.$on("$ionicView.enter", function (event, data) {
            $rootScope.showAddMenuButton = true;
            vm.clearNewMenu();
            vm.refreshMenu($stateParams.foodTruckId)
        });



        $ionicModal.fromTemplateUrl('addMenuModal.html', {
            scope: $scope
        }).then(function (modal) {
            $rootScope.menuModal = modal;
        });

        $scope.$on('modal.hidden', function () {
            vm.clearNewMenu();
            vm.refreshMenu(vm.foodTruck.id);
        });

        vm.refreshMenu = function (foodTruckId) {
            dataSvc.getFoodTruckById(foodTruckId)
                .then(function (foodTruck) {
                    vm.foodTruck = foodTruck;
                })
        }

        vm.clearNewMenu = function () {
            vm.newMenu = {
                'category': null,
                'name': null,
                'description': null,
                'price': null,
                'isValid': false,
                'isEdit': false,
                'newCateogry': null
            }
        }

        vm.fieldChanged = function () {
            vm.newMenu.isValid = vm.newMenu.category != null && vm.newMenu.name != null && vm.newMenu.name != "";
        }

        vm.addMenu = function () {

            if (vm.newMenu.price == null)
                vm.newMenu.price = 0;


            if (vm.newMenu.category == "newCat") {
                var category = {
                    "category": vm.newMenu.newCategory
                }
                dataSvc.addNewCategory(vm.foodTruck.id, category)
                    .then(newItem => {
                        vm.newMenu.category = newItem.key;
                        vm.addMenuItem();
                    });
            }
            else{
                 vm.addMenuItem();
            }
        }

        vm.addMenuItem = function () {

            var menuItem = {
                'name': vm.newMenu.name,
                'description': vm.newMenu.description,
                'price': parseFloat(vm.newMenu.price)
            };

            if (vm.newMenu.isEdit) {
                dataSvc.editMenuItem(vm.foodTruck.id, vm.newMenu.category, vm.newMenu.key, menuItem).then(function () {
                    $rootScope.menuModal.hide();
                })
            }
            else {
                dataSvc.addMenuItem(vm.foodTruck.id, vm.newMenu.category, menuItem).then(function () {
                    $rootScope.menuModal.hide();
                })
            }

        }

        vm.removeMenuItem = function (categoryKey, menuItem) {
            dataSvc.removeMenuItem(vm.foodTruck.id, categoryKey, menuItem.key).then(data => {
                vm.refreshMenu(vm.foodTruck.id);
            });
        }

        vm.editMenuItem = function (menuItem, category) {

            vm.newMenu = {
                'category': category,
                'name': menuItem.name,
                'description': menuItem.description,
                'price': menuItem.price,
                'isValid': false,
                'isEdit': true,
                'newCateogry': null,
                'key': menuItem.key
            }

            $rootScope.menuModal.show();

        }

    };
})();
