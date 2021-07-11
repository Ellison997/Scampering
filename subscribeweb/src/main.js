import Vue from 'vue'
import App from './App.vue'

import { Col, Row } from 'vant';
import { Field } from 'vant';
import { Button } from 'vant';
import { Cell, CellGroup } from 'vant';
import { NumberKeyboard } from 'vant';
import { Picker } from 'vant';
import { RadioGroup, Radio } from 'vant';
import { Popup } from 'vant';
import { Calendar } from 'vant';

import { Area } from 'vant';
import { DatetimePicker } from 'vant';
import { Overlay } from 'vant';
import { Icon } from 'vant';

Vue.use(Icon);
Vue.use(Overlay);
Vue.use(DatetimePicker);
Vue.use(Area);
Vue.use(Calendar);
Vue.use(Popup);
Vue.use(Radio);
Vue.use(RadioGroup);
Vue.use(Col);
Vue.use(Row);
Vue.use(Field);
Vue.use(Button);
Vue.use(Cell);
Vue.use(CellGroup);
Vue.use(Popup);
Vue.use(NumberKeyboard);
Vue.use(Picker);


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
