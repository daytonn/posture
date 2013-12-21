(function() {
  //### isNotTypeof
  // determine if the given constructor does NOT
  // match a certain type
  function isNotTypeof(constructor, suspect) {
    return suspect.constructor != constructor;
  }

  Posture.Model = Backbone.Model.extend({
    //### constructor
    // force parsing all the time and call through
    // to native backbone constructor
    constructor: function(attributes, options) {
      options = options || {};
      options.parse = true;
      this.inheritsFromBaseModel = true;
      Backbone.Model.call(this, attributes, options);
    },

    //### parse
    // check for wrappedAttributes and instantiate
    // objects for the given key
    parse: function(data) {
      if (this.wrappedAttributes) {
        _(this.wrappedAttributes).each(function(Class, key) {
          var value = data[key];
          if (data[key] && isNotTypeof(Class, value)) {
            data[key] = new Class(value);
          }
        });
      }
      return data;
    }
  });
})();
