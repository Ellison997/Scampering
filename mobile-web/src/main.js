import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";


Vue.config.productionTip = false;

// moment
import moment from "moment";
Vue.prototype.$moment = moment;


import 'vant/lib/button/style';

import { Form, Button, Field, Loading, Overlay, Cascader, Picker, Popup, Divider, Area } from "vant";


Vue.use(Area);
Vue.use(Divider);
Vue.use(Field);
Vue.use(Form);
Vue.use(Button);
Vue.use(Loading);
Vue.use(Overlay);
Vue.use(Cascader);
Vue.use(Picker);
Vue.use(Popup);

new Vue({
    router,
    store,
    render: (h) => h(App),
}).$mount("#app");