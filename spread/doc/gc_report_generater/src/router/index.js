import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import TemplateIndex from '../views/Template/Index.vue'
import TemplateList from '../views/Template/List.vue'
import RecordIndex from '../views/Record/Index.vue'
import RecordList from '../views/Record/List.vue'
import TaskIndex from '../views/Task/Index.vue'
import TaskList from '../views/Task/List.vue'

import { Loading } from 'element-ui';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/About.vue')
    }
  },
  {
    path: '/design',
    name: 'Design',
    component: function () {
      return import(/* webpackChunkName: "design" */ '../views/Design/Index.vue')
    },
    beforeEnter:function(to, from, next){
      Loading.service({ fullscreen: true, background: 'transparent' })
      next();
    }
  },
  {
    path: '/task',
    component: TaskIndex,
    children: [
      {
        path: 'list',
        component: TaskList
      },
      {
        path: 'new',
        component: function () {
          return import(/* webpackChunkName: "taskNew" */ '../views/Task/New.vue')
        }
      },
      {
        path: 'report',
        component: function () {
          return import(/* webpackChunkName: "taskReport" */ '../views/Task/Report.vue')
        }
      }
    ]
  },
  {
    path: '/template',
    component: TemplateIndex,
    children: [
      {
        path: 'list',
        component: TemplateList
      }
    ]
  },
  {
    path: '/record',
    component: RecordIndex,
    children: [
      {
        path: 'list',
        component: RecordList
      },
      {
        path: 'viewer',
        component: function () {
          return import(/* webpackChunkName: "viewer" */ '../views/Record/Viewer.vue')
        }
      },
      {
        path: 'allData',
        component: function () {
          return import(/* webpackChunkName: "allData" */ '../views/Record/AllData.vue')
        }
      },
      {
        path: 'total',
        component: function () {
          return import(/* webpackChunkName: "recordTotal" */ '../views/Record/Total.vue')
        }
      },
      {
        path: 'rangeTemplate',
        component: function () {
          return import(/* webpackChunkName: "RangeTemplateViewer" */ '../views/Record/RangeTemplateViewer.vue')
        }
      }
    ]
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})


export default router
