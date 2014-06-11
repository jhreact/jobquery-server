var tagCtrl = require('../../server/tag/tag_controllers.js');

describe("Tag Controller", function() {

    it("should have a post method", function () {
        expect(tagCtrl.post).toBeDefined();
    });

    it("should have a get method", function () {
        expect(tagCtrl.get).toBeDefined();
    })
});