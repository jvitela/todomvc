import {component, event} from 'Lib/backbone-decorators'
import ComponentView      from 'Components/ComponentView'
import template           from 'Templates/todos-footer.hbs'

@component({
  tagName: 'todos-footer',
  template: template
})
export default class TodosFooter extends ComponentView {
}