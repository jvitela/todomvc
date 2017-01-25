import {component}     from 'Lib/backbone-decorators'

@routes
export default Backbone.Router.extend({
  routes: {
    'active':    'showActive',
    'completed': 'showCompleted',
    '*path':     'showAll'
  },

  initialize: function(options) {
    let app = new TodosApp({
      el: options.el
    });
  },

  active: function(path) {
    this.app.showActive();
  },

  completed: function() {
    this.app.showCompleted();
  },

  index: function() {
    this.app.showAll();
  }
});