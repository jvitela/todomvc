import {component, event} from 'Lib/backbone-decorators'
import ComponentView      from 'Components/ComponentView'
import template           from 'Templates/todos-footer.hbs'
import TodosCollection    from 'Models/TodosCollection'

@component({
  tagName: 'todos-footer',
  template: template
})
export default class TodosFooter extends ComponentView {
  initialize() {
    this.pending   = new TodosCollection();
    this.completed = new TodosCollection();

    this.listenTo(this.pending,   "add remove", this.render);
    this.listenTo(this.completed, "add remove", this.render);
  }

  setState({ todos }) {
    let completed = todos.groupBy('completed');
    this.pending.set(completed[false]  || []);
    this.completed.set(completed[true] || []);
  }
}