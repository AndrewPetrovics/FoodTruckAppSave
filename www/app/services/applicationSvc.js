(function () {
    'use strict';

    angular.module('foodTrucks').factory('applicationSvc', ['$window', applicationSvc]);

    function applicationSvc($window) {

        function setInitialRun(initial) {
            $window.localStorage["initialRun"] = (initial ? "true" : "false");
        }

        function isInitialRun() {
            var value = $window.localStorage["initialRun"] || "true";
            return value == "true";
        }

        return {
            setInitialRun: setInitialRun,
            isInitialRun: isInitialRun,

        };



    };
})();
