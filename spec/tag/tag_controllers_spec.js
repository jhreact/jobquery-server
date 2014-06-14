var tagCtrl = require('../../server/tag/tag_controllers.js');

describe("Tag Controller", function() {

    it("should have a post method", function () {
        expect(tagCtrl.post).toBeDefined();
    });

    it("should have a get method", function () {
        expect(tagCtrl.get).toBeDefined();
    });

    it("should have a getById method", function () {
        expect(tagCtrl.getById).toBeDefined();
    });

    it("should have a putById method", function () {
        expect(tagCtrl.putById).toBeDefined();
    });
});
