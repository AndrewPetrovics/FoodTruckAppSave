(function () {
    'use strict';

    angular.module('foodTrucks').factory('authSvc', ['$q', authSvc]);

    function authSvc($q) {

        function registerUser(email, password) {
            return firebase.auth().createUserWithEmailAndPassword(email, password);
        }

        function signInUser(email, password) {
            return firebase.auth().signInWithEmailAndPassword(email, password);
        }

        function signOutUser() {
            return firebase.auth().signOut();
        }

        function getCurrentUser() {
            return firebase.auth().currentUser;
        }

        function isUserLoggedIn() {

            var deferred = $q.defer();
            
            firebase.auth().onAuthStateChanged(function (user) {
                if (user) {
                    deferred.resolve(true);
                } else {
                    deferred.resolve(false);
                }
            });
            
            return deferred.promise;
        }



        return {
            registerUser: registerUser,
            signInUser: signInUser,
            signOutUser: signOutUser,
            getCurrentUser: getCurrentUser,
            isUserLoggedIn: isUserLoggedIn

        };
    };
})();
