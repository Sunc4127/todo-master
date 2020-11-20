import Vue from "vue";
import App from "./App.vue";
import Buefy from "buefy";
import "buefy/dist/buefy.css";
import "@mdi/font/css/materialdesignicons.min.css";
import { Datetime } from "vue-datetime";
import "vue-datetime/dist/vue-datetime.css";

Vue.use(Buefy);
Vue.use(Datetime);

Vue.config.productionTip = false;

new Vue({
  render: h => h(App)
}).$mount("#app");
