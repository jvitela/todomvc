import {props} from 'Lib/backbone-decorators'
import Backbone   from 'backbone'

@props({
	"idAttribute": "order",
	"defaults" : {
	  title: "",
	  order: 0,
	  completed: false
	}
})
export default class Todo extends Backbone.Model {
  reset() {
    this.set(_.clone(this.defaults));
  }
}
