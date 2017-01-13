import {component, event} from '../lib/backbone-decorators'
import ComponentView      from './ComponentView'
import template           from './todos-app.hbs'

// console.log("Template", todosAppTemplate);

@component({
  tagName:  'todos-app',
  template: template
  // template: `
  //   <todos-header></todos-header>
  //   <todos-list></todos-list>
  //   <todos-footer></todos-footer>`
})
export default class TodosApp extends ComponentView {}

@component({
  tagName:  'todos-header',
  template: `
    <header class="header">
      <h1>todos</h1>
      <input class="new-todo" placeholder="What needs to be done?" autofocus>
    </header>`
})
class TodosHeader extends ComponentView {
}

@component({
  tagName:  'todos-list',
  template: `
    <section class="main">
      <input class="toggle-all" type="checkbox">
      <label for="toggle-all">Mark all as complete</label>
      <ul class="todo-list">
        <!-- These are here just to show the structure of the list items -->
        <!-- List items should get the class 'editing' when editing and 'completed' when marked as completed -->
        <li class="completed">
          <div class="view">
            <input class="toggle" type="checkbox" checked>
            <label>Taste JavaScript</label>
            <button class="destroy"></button>
          </div>
          <input class="edit" value="Create a TodoMVC template">
        </li>
        <li>
          <div class="view">
            <input class="toggle" type="checkbox">
            <label>Buy a unicorn</label>
            <button class="destroy"></button>
          </div>
          <input class="edit" value="Rule the web">
        </li>
      </ul>
    </section>`
})
class TodosList extends ComponentView {
}

@component({
  tagName: 'todos-footer',
  template: `
    <footer class="footer">
      <!-- This should be '0 items left' by default -->
      <span class="todo-count"><strong>0</strong> item left</span>
      <!-- Remove this if you don't implement routing -->
      <ul class="filters">
        <li>
          <a class="selected" href="#/">All</a>
        </li>
        <li>
          <a href="#/active">Active</a>
        </li>
        <li>
          <a href="#/completed">Completed</a>
        </li>
      </ul>
      <!-- Hidden if no completed items are left ↓ -->
      <button class="clear-completed">Clear completed</button>
    </footer>`
})
class TodosFooter extends ComponentView {
}

