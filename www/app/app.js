// Ionic Starter App


angular.module('foodTrucks', ['ionic'])

  .run(function ($ionicPlatform, $state, authSvc) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }

      $state.go('starter');
    });
  })

  .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
    
    $ionicConfigProvider.tabs.position('bottom');
    
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'app/layout/layout.html',
        controller: 'LayoutCtrl'
      })

      .state('app.foodTrucks', {
        url: '/foodTrucks',
        views: {
          'tab-foodTrucks': {
            templateUrl: 'app/foodTrucks/foodTrucks.html'
          }
        }
      })

      .state('app.foodTruckDetails', {
        url: '/foodTrucks/:foodTruckId',
        views: {
          'tab-foodTrucks': {
            templateUrl: 'app/foodTrucks/foodTruckDetails/foodTruckDetails.html'
          }
        }
      })

      .state('app.foodTruckMenu', {
        url: '/foodTrucks/:foodTruckId/menu',
        views: {
          'tab-foodTrucks': {
            templateUrl: 'app/foodTrucks/foodTruckDetails/foodTruckMenu/foodTruckMenu.html'
          }
        }
      })

      .state('app.foodTruckSchedule', {
        url: '/foodTrucks/:foodTruckId/schedule',
        views: {
          'tab-foodTrucks': {
            templateUrl: 'app/foodTrucks/foodTruckDetails/foodTruckSchedule/foodTruckSchedule.html'
          }
        }
      })



      .state('app.map', {
        url: '/map',
        views: {
          'tab-map': {
            templateUrl: 'app/map/map.html'
          }
        }
      })
      .state('app.schedule', {
        url: '/schedule',
        views: {
          'tab-schedule': {
            templateUrl: 'app/schedule/schedule.html',
          }
        }
      })

      .state('app.about', {
        url: '/about',
        views: {
          'tab-about': {
            templateUrl: 'app/about/about.html',
          }
        }
      })

      .state('intro', {
        url: '/intro',
        templateUrl: 'app/intro/intro.html',
      })

      .state('login', {
        url: '/login',
        templateUrl: 'app/login/login.html',
      })
      
        .state('signup', {
        url: '/signup',
        templateUrl: 'app/signup/signup.html',
      })
      
        .state('starter', {
        url: '/starter',
        templateUrl: 'app/starter/starter.html',
      })






    // if none of the above states are matched, use this as the fallback
    //$urlRouterProvider.otherwise('/app/foodTrucks');
  });
