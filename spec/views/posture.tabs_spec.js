beforeEach(function() {
  loadFixtures("tabs.html");
});

describe("Posture.Tab", function() {
  var subject;

  beforeEach(function() {
    var tab = $(".tab:first")[0];
    subject = new Posture.Tab({
      el: tab,
      activeClass: "active",
      dispatcher: _.clone(Backbone.Events)
    });
  });

  describe("initialize", function() {
    it("accepts an active class option", function() {
      expect(subject.activeClass).toEqual("active");
    });

    it("accepts an event dispatcher", function() {
      expect(subject.dispatcher.on).toBeFunction();
      expect(subject.dispatcher.off).toBeFunction();
    });

    it("has a pane selector", function() {
      expect(subject.paneSelector).toEqual("#p1");
    });

    it("has a pane element", function() {
      expect(subject.$pane).toBeJqueryWrapped(subject.paneSelector);
    });
  });

  describe("isActive", function() {
    it("returns the state of the tab", function() {
      expect(subject.isActive()).toBeFalse();
      subject.activate();
      expect(subject.isActive()).toBeTrue();
    });
  });

  describe("activate", function() {
    beforeEach(function() {
      subject.$el.removeClass(subject.activeClass);
      subject.activate();
    });

    it("adds the active class", function() {
      expect(subject.$el).toHaveClass("active");
    });
  });

  describe("deactivate", function() {
    beforeEach(function() {
      subject.$el.removeClass(subject.activeClass);
      subject.deactivate();
    });

    it("removes the active class", function() {
      expect(subject.$el).not.toHaveClass("active");
    });
  });

  describe("handleClick", function() {
    beforeEach(function() {
      spyOn(subject.dispatcher, "trigger");
      spyOn(subject, "activate");
    });

    it("should prevent default", function() {
      subject.handleClick(eventStub);
      expect(eventStub.preventDefault).toHaveBeenCalled();
    });

    describe("when active", function() {
      beforeEach(function() {
        spyOn(subject, "isActive").andReturn(true);
        subject.handleClick(eventStub);
      });

      it("does not trigger an event", function() {
        expect(subject.dispatcher.trigger).not.toHaveBeenCalledWith("posture.tab.activate", subject);
      });
    });

    describe("when not active", function() {
      beforeEach(function() {
        spyOn(subject, "isActive").andReturn(false);
        subject.handleClick(eventStub);
      });

      it("triggers an event on the dispatcher", function() {
        expect(subject.dispatcher.trigger).toHaveBeenCalledWith("posture.tab.activate", subject);
      });
    });
  });
});

describe("Posture.Tabs", function() {
  var subject;

  beforeEach(function() {
    subject = new Posture.Tabs({
      el: "#default-tabs"
    });
  });

  describe("initialize", function() {
    describe("dispatcher event listeners", function() {
      beforeEach(function() {
        spyOn(subject, "activateTab");
        subject.dispatcher.trigger("posture.tab.activate", _(subject.tabViews).first());
      });

      it("registers for the tab activate event", function() {
        expect(subject.activateTab).toHaveBeenCalled();
      });
    });

    describe("defaults", function() {
      it("has a default tab selector", function() {
        expect(subject.tabSelector).toEqual(".tab");
      });

      it("has a default active class", function() {
        expect(subject.activeClass).toEqual("active");
      });

      it("creates a view for each tab", function() {
        expect(subject.tabViews.length).toEqual(4);
        expect(_(subject.tabViews).first()).toBeTypeof(Posture.Tab);
        expect(_(subject.tabViews).first().el).toEqual($(".tab").first()[0]);
        expect(_(subject.tabViews).first().activeClass).toEqual(subject.activeClass);
        expect(_(subject.tabViews).first().dispatcher).toEqual(subject.dispatcher);
      });

      it("activates the first tab", function() {
        expect(_(subject.tabViews).first().isActive()).toBeTrue();
      });

      it("has an event dispatcher", function() {
        expect(subject.dispatcher.on).toBeFunction();
        expect(subject.dispatcher.off).toBeFunction();
      });

      describe("with existing active tab", function() {
        var subject;
        beforeEach(function() {
          loadFixtures("active_tabs.html");
          subject = new Posture.Tabs({
            el: "#active-tabs"
          });
        });

        it("respects the active tab", function() {
          expect(subject.activeTab()).toEqual(_(subject.tabViews).last());
        });
      });
    });
  });

  describe("hasActiveTab", function() {
    it("determines if there is an active tab", function() {
      expect(subject.hasActiveTab()).toBeTrue();
    });
  });

  describe("activeTab", function() {
    it("returns the active tab view", function() {
      expect(subject.activeTab()).toEqual(_(subject.tabViews).first());
    });
  });
});
