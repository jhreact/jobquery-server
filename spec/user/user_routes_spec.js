var userRoutes = require('../../server/user/user_routes.js');
var express = require('express');

var router = express.Router();
userRoutes(router); // extend 'router' with userRoutes

var mockRequest;

for (var i = 0; i < router.stack.length; i += 1) {
  console.log('router.stack[', i, ']');
  console.dir(router.stack[i]);
  // TODO: create a lookup object so do not have to hardcode index numbers
}

describe('User routes', function () {

  beforeEach(function () {
    mockRequest = {
      method: 'GET',
      url: '/',
      params: {}
    };
  });

  it('should have a method for GET /', function () {
    expect(router.stack[1].route.path).toBeDefined();
    expect(router.stack[1].route.path).toEqual('/');
    expect(router.stack[1].route.methods.get).toEqual(true);
  });

  it('should invoke correct method for GET /', function () {
    spyOn(router.stack[1].route.stack[0], 'handle');
    router(mockRequest);
    expect(router.stack[1].route.stack[0].handle).toHaveBeenCalled();
    // TODO: add test for GET/:id
  });

  it('should have a method for POST /', function () {
    expect(router.stack[1].route.path).toBeDefined();
    expect(router.stack[1].route.path).toEqual('/');
    expect(router.stack[1].route.methods.post).toEqual(true);
  });


  it('should invoke correct method for POST /', function () {
    mockRequest.method = 'POST';

    spyOn(router.stack[1].route.stack[1], 'handle');
    router(mockRequest);
    expect(router.stack[1].route.stack[1].handle).toHaveBeenCalled();
  });

});
