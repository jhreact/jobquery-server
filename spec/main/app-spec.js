var app = require('../../server/main/app.js');

describe("app", function () {
  it("check app is a function", function () {
    expect(typeof app).toEqual("function");
  });
  it("check routers are set", function () {
    expect(typeof app._router).toEqual("function");

  });
});
