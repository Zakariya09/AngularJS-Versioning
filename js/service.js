angular.module('mainApp.services', [])
.service('studentService', ['$http', function ($http) {
    return {
        registerUser: function (student, successCallback, failureCallback) {
            $http.post(`${BASE_URL}enquiry`, student).success(successCallback).error(failureCallback);
        },
        getDateRange: function (successCallback, failureCallback) {
            $http.get(`${BASE_URL}dateRange`).success(successCallback).error(failureCallback);
        },
        getYears: function (successCallback, failureCallback) {
            $http.get(`${BASE_URL}year`).success(successCallback).error(failureCallback);
        },
        getClassStatus: function (successCallback, failureCallback) {
            $http.get(`${BASE_URL}classStatus`).success(successCallback).error(failureCallback);
        }
    }
}])

.service('limitReachedService', ['$http', function ($http) {
    return {
        get: function (successCallback, failureCallback) {
            $http.get(`${BASE_URL}enquiry/limit-reached`).success(successCallback).error(failureCallback);
        }
    }
}])

.service('addmissionService', ['$http', function ($http) {
    return {
        get: function (UID, successCallback, failureCallback) {
            $http.get(`${BASE_URL}enquiry/get/` + UID).success(successCallback).error(failureCallback);
        },
    }
}]);
