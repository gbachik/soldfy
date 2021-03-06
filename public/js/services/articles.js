'use strict';

//Articles service used for articles REST endpoint
angular.module('mean.articles').factory('Articles', ['$resource', function($resource) {
    return $resource('articles/:articleId', {
        articleId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    });
}]);
angular.module('mean.system').factory('Dls', ['$resource', function($resource) {
    return $resource('dl/:dlKey', {
        dlKey: '@dlKey'
    }, {
        search: {
            method: 'GET'
        }
    });
}]);