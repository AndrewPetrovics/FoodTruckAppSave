(function () {
    'use strict';

    angular.module('foodTrucks').factory('dataSvc', ['$q', dataSvc]);

    function dataSvc($q) {

        var _foodTrucks = null;

        function getFoodTrucks() {

            var deferred = $q.defer();

            if (_foodTrucks) {
                // already loaded data
                deferred.resolve(_foodTrucks);
            }

            var ref = firebase.database().ref("foodTrucks");
            ref.on('value', function (data) {

                var foodTrucks = []
                data.forEach(ft => {
                    foodTrucks.push(ft.val())
                });

                _foodTrucks = processFoodTrucks(foodTrucks);
                deferred.resolve(_foodTrucks);
            });

            return deferred.promise;


        }

        function processFoodTrucks(foodTrucks) {


            var processedFoodTrucks = [];
            for (var ftKey in foodTrucks) {

                var foodTruck = foodTrucks[ftKey];

                if (!foodTruck.show) {
                    continue;
                }

                foodTruck.locations = getLocations(foodTruck);
                foodTruck.schedule = getSchedules(foodTruck)
                foodTruck.menu = getMenu(foodTruck);


                processedFoodTrucks.push(foodTruck);
            }

            return processedFoodTrucks;

        }

        function getMenu(foodTruck) {
            var categories = [];
            for (var categoryKey in foodTruck.menu) {

                var category = foodTruck.menu[categoryKey];

                var menuItems = []
                for (var menuItemKey in category.items) {

                    var menuData = category.items[menuItemKey];

                    var menuItem = {
                        'key': menuItemKey,
                        'description': menuData.description,
                        'name': menuData.name,
                        'price': menuData.price
                    };

                    menuItems.push(menuItem)
                }

                var category = {
                    "key": categoryKey,
                    "category": category.category,
                    "items": menuItems
                }

                categories.push(category);
            }

            return categories;
        }

        function getSchedules(foodTruck) {
            var now = new Date();
            var schedules = [];
            for (var key in foodTruck.schedule) {

                var scheduleData = foodTruck.schedule[key];

                var schedule = {
                    'key': key,
                    'startTime': new Date(scheduleData.startTime),
                    'endTime': new Date(scheduleData.endTime),
                    'lat': scheduleData.lat,
                    'lng': scheduleData.lng,
                    'locationName': scheduleData.locationName,
                    'address': scheduleData.address,
                    'fullAddress': scheduleData.fullAddress
                };

                if (now < schedule.endTime) {
                    schedules.push(schedule)
                }
            }

            return schedules.sort((a, b) => a.startTime > b.startTime);
        }

        function getLocations(foodTruck) {

            var locations = [];
            for (var key in foodTruck.schedule) {

                var schedule = foodTruck.schedule[key];

                if (locations.find(_ => _.locationName == schedule.locationName) == null) {
                    var location = {
                        "address": schedule.address,
                        "fullAddress": schedule.fullAddress,
                        "lat": schedule.lat,
                        "lng": schedule.lng,
                        "locationName": schedule.locationName
                    }

                    locations.push(location);
                }
            }

            return locations;

        }

        function getFoodTruckById(id) {
            var deferred = $q.defer();

            if (!_foodTrucks) {
                getFoodTrucks().then(function (foodTrucks) {
                    _foodTrucks = foodTrucks;

                    var foodTruck = _foodTrucks.find(_ => _.id == id);
                    deferred.resolve(foodTruck);
                });
            }
            else {
                var foodTruck = _foodTrucks.find(_ => _.id == id);
                deferred.resolve(foodTruck);

            }

            return deferred.promise;
        }

        //
        // Scheudles
        //
        function addSchedule(schedule, foodTruckId) {
            var deferred = $q.defer();
            
            var ref = firebase.database().ref("foodTrucks/" + foodTruckId + "/schedule");
            ref.push(schedule, data => {
                deferred.resolve(data);
            });
            
             return deferred.promise;
        }

        function editSchedule(schedule, foodTruckId, scheduleId) {
            var deferred = $q.defer();

            var ref = firebase.database().ref("foodTrucks/" + foodTruckId + "/schedule/" + scheduleId);
            ref.update(schedule, data => {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        function removeSchedule(foodTruckId, scheduleId) {
            var deferred = $q.defer();

            var ref = firebase.database().ref("foodTrucks/" + foodTruckId + "/schedule/" + scheduleId);
            ref.remove(data => {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        //
        // Menu
        //
        function addMenuItem(foodTruckId, categoryKey, menuItem) {
            var deferred = $q.defer();
            
            var ref = firebase.database().ref("foodTrucks/" + foodTruckId + "/menu/" + categoryKey + "/items");
            ref.push(menuItem, data => {
                deferred.resolve(data);
            });
            
            return deferred.promise;
        }

        function editMenuItem(foodTruckId, categoryKey, menuItemKey, menuItem) {
            var deferred = $q.defer();

            var ref = firebase.database().ref("foodTrucks/" + foodTruckId + "/menu/" + categoryKey + "/items/" + menuItemKey);
            ref.update(menuItem, data => {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        function removeMenuItem(foodTruckId, categoryKey, menuItemKey) {
            var deferred = $q.defer();

            var ref = firebase.database().ref("foodTrucks/" + foodTruckId + "/menu/" + categoryKey + "/items/" + menuItemKey);
            ref.remove(data => {
                deferred.resolve(data);
            });

            return deferred.promise;
        }

        function addNewCategory(foodTruckId, category) {

            var ref = firebase.database().ref("foodTrucks/" + foodTruckId + "/menu/");
            var item = ref.push(category, data => {
            });

            return  item
        }


        return {
            getFoodTrucks: getFoodTrucks,
            getFoodTruckById: getFoodTruckById,
            addSchedule: addSchedule,
            editSchedule: editSchedule,
            removeSchedule: removeSchedule,
            addMenuItem: addMenuItem,
            editMenuItem: editMenuItem,
            removeMenuItem: removeMenuItem,
            addNewCategory: addNewCategory,
        };
    };
})();
