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
      if (this.isActive()) this.$pane.show();
    },

    // Convenience method to determine if the tab is active
    isActive: function() {
      return this.$el.hasClass("active");
    },

    // Add the active class to the tab
    activate: function() {
      this.$el.addClass(this.activeClass);
      this.$pane.show();
    },

    // Removes the active class to the tab
    deactivate: function() {
      this.$el.removeClass(this.activeClass);
      this.$pane.hide();
    },

    // Trigger the activate event on click
    handleClick: function(event) {
      event.preventDefault();
      if (!this.isActive()) this.dispatcher.trigger(this.eventNamespace + ".activate", this);
    }
  });

  //### Tabs
  // Wrap Tabs definition in a closure for private methods and properties
  (function() {
    // Create a tab view for each .tab
    // this method is private inside the closure
    function createTabViews() {
      // Keep a local reference to this to use in
      // the iterator
      var _this = this;
      this.tabViews = [];
      // Push a new tab view into the tabViews array
      // for each element matching the tabSelector
      _(this.$el.find(this.tabSelector)).each(function(tab) {
        _this.tabViews.push(new Posture.Tab({
          el: tab,
          eventNamespace: _this.eventNamespace(),
          activeClass: _this.activeClass,
          dispatcher: _this.dispatcher
        }));
      });
    }

    Posture.Tabs = Backbone.View.extend({
      // Initialize the view with defaults and
      // cache the elements
      initialize: function(options) {
        // Create an id for this view
        this.id = _.uniqueId();
        // Create empty options object if none passed
        // then create common defaults for convenience
        options = options || {};
        this.defaults = {
          tabSelector: ".tab",
          activeClass: "active",
          dispatcher: _.clone(Backbone.Events)
        };
        setOptions(this, _.defaults(options, this.defaults));
        createTabViews.call(this);
        this.dispatcher.on(this.eventNamespace("activate"), this.activateTab, this);
        if (!this.hasActiveTab() && this.tabViews.length) _(this.tabViews).first().activate();
      },

      // Determine if the tabs have an active tab
      hasActiveTab: function() {
        return !!this.activeTab();
      },

      // Find the current active tab
      activeTab: function() {
        return _(this.tabViews).find(function(tabView) {
          return tabView.isActive();
        });
      },

      // Deactivate the currently active tab and trigger
      // the `posture.tab.deactivated` event, then
      // activate the given tab, and trigger the
      // `posture.tab.activated` event
      activateTab: function(activeTab) {
        var currentActiveTab = this.activeTab();
        currentActiveTab.deactivate();
        activeTab.activate();

        this.trigger("tab.deactivated", currentActiveTab);
        this.trigger("tab.activated", activeTab);
        this.dispatcher.trigger(this.eventNamespace("deactivated"), currentActiveTab);
        this.dispatcher.trigger(this.eventNamespace("activated"), activeTab);
      },

      // Convenience method to return the unique event namespace
      eventNamespace: function(event) {
        var eventName = event ? "." + event : "";
        return "posture.tab:" + this.id + eventName;
      }
    });
  })();
})();
