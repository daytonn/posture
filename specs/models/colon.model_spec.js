describe("Colon.Models.Model", function() {
  var BaseModel;
  var ChildModel;
  var data;
  var subject;

  beforeEach(function() {
    ChildModel = Colon.Models.Model.extend({});
    BaseModel = Colon.Models.Model.extend({
      wrappedAttributes: {
        first_child: ChildModel,
        second_child: ChildModel
      }
    });
    data = { first_child: { id: 1 }};
    subject = new BaseModel;
  });

  describe("parse", function() {
    it("wraps the given attributes", function() {
      subject.parse(data);
      expect(data.first_child).toBeTypeof(ChildModel);
    });
  });
});
