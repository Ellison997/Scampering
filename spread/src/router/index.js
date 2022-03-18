import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Spread from '@/components/Spread'
import Scrollbar from '@/components/Scrollbar'
// import Designer from '@/components/Designer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/Spread',
      name: 'Spread',
      component: Spread
    }, {
      path: '/Scrollbar',
      name: 'Scrollbar',
      component: Scrollbar
    }, {
      path: '/Designer',
      name: 'Designer',
      component: Spread
    }
  ]
})
