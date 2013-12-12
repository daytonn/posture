describe("Colon", function() {
  var subject;
  beforeEach(function() {
    subject = Colon;
  });

  it("has a Models object", function() {
    expect(subject.Models).toBeDefined();
    expect(subject.Models).toBeObject();
  });

  it("has a Collections object", function() {
    expect(subject.Collections).toBeDefined();
    expect(subject.Collections).toBeObject();
  });

  it("has a Views object", function() {
    expect(subject.Views).toBeDefined();
    expect(subject.Views).toBeObject();
  });
});
