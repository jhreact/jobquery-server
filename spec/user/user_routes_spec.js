var userRoutes = require('../../server/user/user_routes.js');
var express = require('express');

var router = express.Router();
userRoutes(router); // extends 'router' with userRoutes module

// declare expected paths and RESTful verbs here
var expectedPaths = {
  '/':      ['GET', 'POST'],
  '/:id':   ['GET', 'PUT']
};

// setup: translates router properties into an object tht we can work with
var routes = {};
var i, j;
var verb;
for (i = 0; i < router.stack.length; i += 1) {
  routes[router.stack[i].route.path] = {};
  for (j = 0; j < router.stack[i].route.stack.length; j += 1) {
    verb = router.stack[i].route.stack[j]['method'];
    routes[router.stack[i].route.path][verb] = router.stack[i].route.stack[j];
  }
}

describe("User routes", function () {

  describe("All expected paths are declared", function () {
    for (var path in expectedPaths) {
      for (var k = 0; k < expectedPaths[path].length; k += 1) {
        var action = expectedPaths[path][k].toLowerCase();
        (function (path, action) {
          it('should be declared for ' + action.toUpperCase() + ' at ' + path,
            function () {
              expect(routes[path][action].method).toEqual(action);
            }
          );
        })(path, action);
      }
    }
  });

  describe('All declared routes are expected', function () {
    for (var path in routes) {
      for (var action in routes[path]) {
        (function (path, action) {
          it('should expect ' + action.toUpperCase() + ' at ' + path,
            function () {
              expect(expectedPaths[path].indexOf(action.toUpperCase()))
                .not.toEqual(-1);
            }
          );
        })(path, action);
      }
    }
  });

  // save this information --- useful for integration testing
  xdescribe("Passing in a mock http object", function () {
    it('should invoke a route handler for GET /', function () {
      spyOn(routes['/'].get, 'handle');
      router({method: 'GET', url: '/'});
      expect(routes['/'].get.handle).toHaveBeenCalled();
    });

    it('should invoke a route handler for POST /', function () {
      spyOn(routes['/'].post, 'handle');
      router({method: 'POST', url: '/'});
      expect(routes['/'].post.handle).toHaveBeenCalled();
    });

    it('should invoke a route handler for GET /:id', function () {
      spyOn(routes['/:id'].get, 'handle');
      router({method: 'GET', url: '/12'});
      expect(routes['/:id'].get.handle).toHaveBeenCalled();
    });

    it('should invoke a route handler for PUT /:id', function () {
      spyOn(routes['/:id'].put, 'handle');
      router({method: 'PUT', url: '/:id'});
      expect(routes['/:id'].put.handle).toHaveBeenCalled();
    });
  });

});

