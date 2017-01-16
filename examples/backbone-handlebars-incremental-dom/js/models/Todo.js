import {defaults} from 'Lib/backbone-decorators'
import Backbone   from 'backbone'

@defaults({
  title: "",
  order: 0,
  completed: false
})
export default class Todo extends Backbone.Model {
  reset() {
    this.set(_.clone(this.defaults));
  }
}
