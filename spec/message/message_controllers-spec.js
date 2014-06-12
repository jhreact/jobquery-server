var messageCtrl = require('../../server/message/message_controllers.js');

describe("Message Controller", function() {

  it("should have a post method", function () {
    expect(messageCtrl.post).toEqual(jasmine.any(Function));
  });

  it("should have a getById method", function () {
    expect(messageCtrl.getById).toEqual(jasmine.any(Function));
  });

});
