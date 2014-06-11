'use strict'

var loginControllers = require('../../server/login/login_controllers.js');

describe("login get controller", function () {
    var express = require('express');

  it("check login controllers is an object", function () {
    expect(typeof loginControllers).toEqual("object");
  });

  it("check login controllers has a post function", function () {
    expect(typeof loginControllers.post).toEqual("function");
  });


});
