var messageCtrl = require('../../server/message/message_controllers.js');

describe("Message Controller", function() {

    it("should have a post method", function () {
        expect(messageCtrl.post).toBeDefined();
    });
});