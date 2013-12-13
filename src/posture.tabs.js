// This is a closure for shared private methods and properties
(function() {
  // Iterate through the options and set them
  // as properties on the view
  function setOptions(context, options) {
    _(options).each(function(value, option) {
      context[option] = options[option];
    });
  }

  //### Tab
  // Wrap Tab definition in a closure for private methods and properties
  (function() {
    Posture.Tab = Backbone.View.extend({
      events: {
        "click": "handleClick"
      },

      // Initialize the tab with options from the tabs view
      initialize: function(options) {
        // Assign context for private methods
        setOptions(this, options);
        this.paneSelector = this.$el.attr("href");
        this.$pane = $(this.paneSelector);
      },

      // Convenience method to determine if the tab is active
      isActive: function() {
        return this.$el.hasClass("active");
      },

      // Add the active class to the tab
      activate: function() {
        this.$el.addClass(this.activeClass);
      },

      // Removes the active class to the tab
      deactivate: function() {
        this.$el.removeClass(this.activeClass);
      },

      handleClick: function(event) {
        event.preventDefault();
        if (!this.isActive()) this.dispatcher.trigger("posture.tab.activate", this);
      }
    });
  })();

  //### Tabs
  // Wrap Tabs definition in a closure for private methods and properties
  (function() {
    // Create a tab view for each .tab
    function createTabViews() {
      var _this = this;
      this.tabViews = [];
      _(this.$el.find(this.tabSelector)).each(function(tab) {
        _this.tabViews.push(new Posture.Tab({
          el: tab,
          activeClass: _this.activeClass,
          dispatcher: _this.dispatcher
        }));
      });
    }

    Posture.Tabs = Backbone.View.extend({
      // Initialize the view with defaults and
      // cache the elements
      initialize: function(options) {
        // Assign context for private methods
        this.defaults = {
          tabSelector: ".tab",
          activeClass: "active",
          dispatcher: _.clone(Backbone.Events)
        };
        setOptions(this, _.defaults(options, this.defaults));
        createTabViews.call(this);
        this.dispatcher.on("posture.tab.activate", this.activateTab, this);
        if (!this.hasActiveTab() && this.tabViews.length) _(this.tabViews).first().activate();
      },

      hasActiveTab: function() {
        return !!this.activeTab();
      },

      activeTab: function() {
        return _(this.tabViews).find(function(tabView) {
          return tabView.isActive();
        });
      },

      activateTab: function(activeTab) {
        console.log("activateTab");
        // _(this.tabViews).each(function(tabView) {
        //   tabView.deactivate();
        // });
        // activeTab.activate();
      }
    });
  })();
})();
