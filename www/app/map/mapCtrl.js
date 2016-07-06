(function () {
      'use strict';

      angular.module('foodTrucks').controller('MapCtrl', ['$scope', '$stateParams', 'dataSvc', MapCtrl]);

      function MapCtrl($scope, $stateParams, dataSvc) {
            var vm = this;

            $scope.$on("$ionicView.enter", function (event, data) {
                  vm.loadMap();
            });

            vm.loadMap = function () {

                  dataSvc.getFoodTrucks().then(foodTrucks => {

                        var now = new Date();
                        var endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
                        var mapData = [];
                        for (var ftKey in foodTrucks) {

                              var foodTruck = foodTrucks[ftKey];

                              for (var schKey in foodTruck.schedule) {

                                    var schedule = foodTruck.schedule[schKey];

                                    var data = {
                                          'foodTruck': foodTruck,
                                          'locationName': schedule.locationName,
                                          'startTime': schedule.startTime,
                                          'endTime': schedule.endTime,
                                          'lat': schedule.lat,
                                          'lng': schedule.lng,
                                          'center': mapData.length <= 0,
                                          'status': 'now'
                                    };

                                    if (now >= schedule.startTime && now <= schedule.endTime) {
                                          data.status = 'now'
                                          mapData.push(data);
                                          continue;
                                    }
                                    else if (schedule.startTime < endOfDay && now <= schedule.endTime) {
                                          data.status = 'later';
                                          mapData.push(data);
                                          continue;
                                    }

                              }

                        }

                        var mapEle = document.getElementById('main_map');

                        var map = new google.maps.Map(mapEle, {
                              center: {
                                    "lat": 33.5276,
                                    "lng": -86.802109,
                                    "center": true
                              },
                              zoom: 12,
                              disableDefaultUI: true,
                              zoomControl: true,
                        });

                        // var centerControlDiv = document.createElement('div');
                        // var centerControl = new this.CenterControl(centerControlDiv, map);

                        // centerControlDiv.index = 1;
                        // map.controls[google.maps.ControlPosition.TOP_LEFT].push(centerControlDiv);

                        mapData.forEach(markerData => {


                              let infoWindow = new google.maps.InfoWindow({
                                    content: `<h5>${markerData.foodTruck.name}</h5><p>${markerData.locationName}</p>
          <p>${markerData.startTime.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })} - ${markerData.endTime.toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' })}</p>`
                              });

                              var icon = {
                                    url: "img/offTheHookIcon.png", // "img/FoodTruck.ico", // url
                                    scaledSize: new google.maps.Size(80, 42), // scaled size
                                    origin: new google.maps.Point(0, 0), // origin
                                    anchor: new google.maps.Point(0, 0)// anchor

                              };

                              let marker = new google.maps.Marker({
                                    position: markerData,
                                    map: map,


                                    // label: markerData.foodTruck.name,
                                    animation: google.maps.Animation.DROP,
                                    //icon: icon
                              });

                              if (markerData.status == "later") {
                                    marker.setOptions({ 'opacity': 0.6 })
                              }

                              marker.addListener('click', () => {
                                    infoWindow.open(map, marker);
                              });
                        });

                        google.maps.event.addListenerOnce(map, 'idle', () => {
                              mapEle.classList.add('show-map');
                        });

                  });
            }

      };
})();
