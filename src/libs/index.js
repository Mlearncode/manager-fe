import QueryForm from './QueryForm.vue'
import BaseTable from './BaseTable.vue'

const components = [
  QueryForm,
  BaseTable
]

const install = function(Vue) {
  components.forEach(component => {
    Vue.component(component.name, component);
  });
};

export default install